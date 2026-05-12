const axios = require("axios");
const db = require("../config/db");
const env = require("../config/env");

/* ===============================
   PLANAPI HELPER
================================ */
const callApi = async (endpoint, params, method = "GET") => {
  const baseUrl = env.PLAN_API_BASE_URL || "https://planapi.in";
  const fullUrl = `${baseUrl.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

  console.log(`PLANAPI CALL [${method}]:`, fullUrl, params);

  if (!env.PLAN_API_ID || !env.PLAN_API_PASSWORD) return { STATUS: "FAILED", MESSAGE: "Credentials missing" };

  try {
    const config = {
      method, url: fullUrl,
      timeout: 5000,
      headers: { 'Content-Type': 'application/json' },
      params: method === "GET" ? { apimember_id: env.PLAN_API_ID, api_password: env.PLAN_API_PASSWORD, ...params } : undefined,
      data: method === "POST" ? { apimember_id: env.PLAN_API_ID, api_password: env.PLAN_API_PASSWORD, ...params } : undefined
    };
    const res = await axios(config);
    return res.data;
  } catch (err) {
    if (err.response) return { STATUS: "FAILED", MESSAGE: err.response.data?.message || `${err.response.status} ${err.response.statusText}` };
    return { STATUS: "FAILED", MESSAGE: err.message };
  }
};

/* =========================
   🔹 FETCH GAS DETAILS (OPTIMIZED)
========================= */
exports.fetchDetails = async (operator, consumerNumber) => {
  const endpoints = [
    "api/Mobile/GasInfoFetch",      // Primary for LPG
    "api/Mobile/GasPipeInfoFetch",  // Primary for Piped Gas
    "api/Mobile/GasBillFetch"       // Fallback
  ];

  const paramVariations = [
    { ConsumerNo: consumerNumber, operator_code: operator, Optional1: "", Optional2: "" }, // Primary
    { consumer_number: consumerNumber, operator_code: operator },
    { bill_number: consumerNumber, operator_code: operator },
    { k_number: consumerNumber, operator_code: operator }
  ];

  let lastRes = { STATUS: "FAILED", MESSAGE: "All endpoints failed" };

  // Phase 1: Parallel Probe (Top 1 Var for Top 2 Endpoints)
  console.log(`🚀 GAS Phase 1: PARALLEL PROBE...`);
  const phase1Tasks = endpoints.slice(0, 2).map(ep =>
    callApi(ep, paramVariations[0], "GET")
  );

  const results1 = await Promise.all(phase1Tasks);
  for (const res of results1) {
    if (res.STATUS === "SUCCESS" || res.STATUS === "1" || (res.DATA && (res.DATA.customername || res.DATA.CustomerName))) {
      return formatResponse(res, consumerNumber);
    }
  }

  // Phase 2: Sequential Deep Search
  console.log(`🔍 GAS Phase 2: DEEP SEARCH...`);
  for (const endpoint of endpoints) {
    for (const vars of paramVariations) {
      console.log(`👉 TRY: ${endpoint} [${Object.keys(vars)[0]}]`);
      let res = await callApi(endpoint, { ...vars, operatorcode: operator, Opcode: operator }, "GET");

      if (res.STATUS === "SUCCESS" || res.STATUS === "1" || (res.DATA && (res.DATA.customername || res.DATA.CustomerName))) {
        return formatResponse(res, consumerNumber);
      }
      lastRes = res;
    }
  }

  return { success: false, message: lastRes.MESSAGE || "Gas bill details not found" };
};

/* =========================
   🔹 AUTO-DETECT OPERATOR (LPG)
========================= */
exports.detectOperator = async (consumerNumber) => {
  const lpgProviders = [
    { id: "203", name: "Bharat Gas (LPG)" },
    { id: "204", name: "HP Gas (LPG)" },
    { id: "205", name: "Indane Gas (LPG)" }
  ];

  console.log(`🔍 Auto-Detecting Gas Operator for ${consumerNumber}...`);

  const promises = lpgProviders.map(async (p) => {
    try {
      const res = await exports.fetchDetails(p.id, consumerNumber);
      if (res.success) return p;
    } catch (e) { }
    return null;
  });

  const results = await Promise.all(promises);
  const found = results.find(r => r !== null);

  if (found) {
    console.log(`✅ Auto-Detected: ${found.name}`);
    return found;
  }

  console.log("❌ Auto-Detect Failed");
  return null;
};

/* =========================
   🔹 PROCESS RECHARGE
========================= */
exports.processRecharge = async ({
  userId,
  account,
  operator,
  amount,
  service,
  paymentMode
}) => {
  amount = Number(amount);
  if (!amount || amount <= 0) throw new Error("Invalid amount");

  const referenceId = `GAS${Date.now()}`;

  if (paymentMode === "WALLET") {
    const [rows] = await db.promise().query("SELECT wallet_balance FROM users WHERE id = ?", [userId]);
    if (!rows.length) throw new Error("User not found");
    const currentBalance = Number(rows[0].wallet_balance);

    if (currentBalance < amount) throw new Error(`Insufficient wallet balance (Current: ₹${currentBalance})`);

    const newBalance = currentBalance - amount;
    await db.promise().query("UPDATE users SET wallet_balance = ? WHERE id = ?", [newBalance, userId]);

    await db.promise().query(
      `INSERT INTO recharges (user_id, account_number, operator, amount, status, service, reference_id, created_at) VALUES (?, ?, ?, ?, 'SUCCESS', ?, ?, datetime('now'))`,
      [userId, account, operator, amount, service, referenceId]
    );

    await db.promise().query(
      `INSERT INTO transactions (user_id, amount, type, transaction_type, service_type, operator_name, account_number, description, status, reference_id, opening_balance, closing_balance, created_at) VALUES (?, ?, 'DEBIT', 'RECHARGE', ?, ?, ?, ?, 'SUCCESS', ?, ?, ?, datetime('now'))`,
      [userId, amount, service, operator, account, `${service} Bill Payment`, referenceId, currentBalance, newBalance]
    );

    return { success: true, paymentMode: "WALLET", message: "Gas bill paid successfully", referenceId, balance: newBalance };
  }

  if (paymentMode === "RAZORPAY" || paymentMode === "UPI") {
    await db.promise().query(
      `INSERT INTO recharges (user_id, account_number, operator, amount, status, service, reference_id, created_at) VALUES (?, ?, ?, ?, 'SUCCESS', ?, ?, datetime('now'))`,
      [userId, account, operator, amount, service, referenceId]
    );
    return { success: true, paymentMode: paymentMode, message: "Gas bill paid successfully (Online)", referenceId };
  }

  throw new Error("Invalid payment mode");
};

const formatResponse = (res, consumerNo) => {
  const data = res.DATA || res.BILLDEATILS || res;
  return {
    success: true,
    customerName: data.customername || data.CustomerName || data.Name || data.consumer_name || "N/A",
    billAmount: data.amount || data.bill_amount || data.BillAmount || data.DueAmount || 0,
    billNumber: data.bill_number || data.BillNo || data.BillNumber || consumerNo,
    dueDate: data.duedate || data.DueDate || "N/A",
    billDate: data.billdate || data.BillDate || data.bill_date || "N/A",
    state: data.state || data.State || "N/A",
    billingAddress: data.address || data.Address || data.billing_address || data.serviceAddress || "N/A",
    ...res
  };
};
