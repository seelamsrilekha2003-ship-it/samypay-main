const axios = require("axios");
const env = require("../config/env");
const db = require("../config/db");

/* =====================================================
   WALLET + TRANSACTION PROCESS
===================================================== */
exports.processRecharge = async ({
  userId,
  account,
  operator,
  amount,
  service
}) => {

  if (!amount || amount <= 0) {
    throw new Error("Invalid amount");
  }

  const [rows] = await db.promise().query(
    "SELECT wallet_balance FROM users WHERE id = ?",
    [userId]
  );

  if (!rows.length) {
    throw new Error("User not found");
  }

  const openingBalance = Number(rows[0].wallet_balance);

  if (openingBalance < amount) {
    throw new Error("Insufficient wallet balance");
  }

  const closingBalance = openingBalance - amount;
  const refId = `ELE_${Date.now()}`;

  await db.promise().query(
    "UPDATE users SET wallet_balance = ? WHERE id = ?",
    [closingBalance, userId]
  );

  await db.promise().query(
    `INSERT INTO recharges 
     (user_id, account_number, operator, amount, status, service, reference_id, created_at)
     VALUES (?, ?, ?, ?, 'SUCCESS', ?, ?, NOW())`,
    [userId, account, operator, amount, service, refId]
  );

  await db.promise().query(
    `INSERT INTO transactions
     (user_id, amount, type, transaction_type, service_type,
      operator_name, account_number, description, status,
      reference_id, opening_balance, closing_balance, created_at)
     VALUES (?, ?, 'DEBIT', 'RECHARGE', ?, ?, ?, 
     'Electricity Bill Payment', 'SUCCESS', ?, ?, ?, NOW())`,
    [
      userId,
      amount,
      service,
      operator,
      account,
      refId,
      openingBalance,
      closingBalance
    ]
  );

  return {
    message: "Electricity Bill Paid Successfully",
    balance: closingBalance,
    referenceId: refId
  };
};


/* =====================================================
   PLANAPI COMMON CALL HELPER
===================================================== */
const callApi = async (endpoint, params = {}, method = "GET") => {

  const baseUrl = "https://planapi.in";
  const url = `${baseUrl}/${endpoint}`;

  console.log(`PLANAPI CALL [${method}] →`, url, params);

  if (!env.PLAN_API_ID || !env.PLAN_API_PASSWORD) {
    return { STATUS: "FAILED", MESSAGE: "API credentials missing" };
  }

  try {
    const config = {
      method,
      url,
      timeout: 5000, // ⚡ Reduced to 5s to fit shotgun variations within 30s frontend limit
      headers: { "Content-Type": "application/json" }
    };

    if (method === "GET") {
      config.params = {
        apimember_id: env.PLAN_API_ID,
        api_password: env.PLAN_API_PASSWORD,
        ...params
      };
    } else {
      config.data = {
        apimember_id: env.PLAN_API_ID,
        api_password: env.PLAN_API_PASSWORD,
        ...params
      };
    }

    const response = await axios(config);
    return response.data;

  } catch (err) {

    if (err.response) {
      return {
        STATUS: "FAILED",
        MESSAGE: `${err.response.status} ${err.response.statusText}`
      };
    }

    return {
      STATUS: "FAILED",
      MESSAGE: err.message
    };
  }
};


/* =====================================================
   AUTO OPERATOR CHECK
===================================================== */
exports.fetchOperator = async (consumerNo) => {

  if (!consumerNo) {
    return { STATUS: "FAILED", MESSAGE: "Consumer number required" };
  }

  let res = await callApi(
    "api/Electricity/OperatorCheck",
    { consumer_number: consumerNo },
    "GET"
  );

  if (res.STATUS === "SUCCESS" || res.STATUS === "1") return res;

  // Fallback
  return await callApi(
    "api/Mobile/OperatorCheck",
    { consumer_number: consumerNo },
    "GET"
  );
};


/* =====================================================
   FETCH ELECTRICITY BILL DETAILS (ROBUST)
===================================================== */
exports.fetchBillDetails = async (consumerNo, operatorCode) => {

  if (!consumerNo || !operatorCode) {
    return { STATUS: "FAILED", MESSAGE: "Missing parameters" };
  }

  console.log(
    `⚡ Electricity Bill Fetch → Consumer: ${consumerNo} | Operator: ${operatorCode}`
  );

  const paramVariations = [
    { consumer_number: consumerNo, operator_code: operatorCode },
    { ConsumerNo: consumerNo, operator_code: operatorCode },
  ];

  // Specific mapping for TSSPDCL (474) - Priority
  if (operatorCode === "474" || operatorCode === 474) {
    paramVariations.unshift({ CUSTOMERNUMBER: consumerNo, operator: "TSSPDCL" });
    paramVariations.unshift({ bill_number: consumerNo, operator_code: "474" });
  }

  // Fallback variations
  paramVariations.push(
    { bill_number: consumerNo, operator_code: operatorCode },
    { k_number: consumerNo, operator_code: operatorCode },
    { account: consumerNo, operator: operatorCode },
    { number: consumerNo, operator: operatorCode },
    { Optional1: "", Optional2: "", consumer_number: consumerNo, operator_code: operatorCode }
  );

  const endpoints = [
    "api/Electricity/FetchDetails",
    "api/Mobile/BillFetch",
    "api/Mobile/ElectricityBillFetch"
  ];

  let lastRes = { MESSAGE: "Electricity bill details not found" };

  // Phase 1: Parallel Probe (Top 1 Variation for Top 3 Endpoints) - ~5s total
  console.log(`🚀 Phase 1: FAST PARALLEL PROBE...`);
  const phase1Tasks = endpoints.map(ep =>
    callApi(ep, { ...paramVariations[0], bill_number: consumerNo }, "GET")
  );

  const results1 = await Promise.all(phase1Tasks);
  for (const res of results1) {
    if (res.STATUS === "SUCCESS" || res.STATUS === "1" || (res.DATA && (res.DATA.ConsumerName || res.DATA.BillAmount))) {
      return formatResponse(res, consumerNo);
    }
  }

  // Phase 2: Sequential Deep Search (remaining variations)
  console.log(`🔍 Phase 2: SEQUENTIAL DEEP SEARCH...`);
  for (const endpoint of endpoints) {
    for (const vars of paramVariations.slice(1, 4)) {
      console.log(`👉 TRY: ${endpoint} [${Object.keys(vars)[0]}]`);
      let res = await callApi(endpoint, { ...vars, bill_number: consumerNo }, "GET");

      if (res.STATUS === "SUCCESS" || res.STATUS === "1" || (res.DATA && (res.DATA.ConsumerName || res.DATA.BillAmount))) {
        return formatResponse(res, consumerNo);
      }
      lastRes = res;
    }
  }

  return { success: false, message: lastRes.MESSAGE || "Electricity bill details not found" };
};

/* Internal helper to standardize response */
const formatResponse = (res, consumerNo) => {
  const data = res.DATA || res.BILLDEATILS || res;
  return {
    success: true,
    customerName: data.ConsumerName || data.Name || data.consumer_name || data.customername || "N/A",
    billAmount: data.BillAmount || data.DueAmount || data.Amount || data.amount || 0,
    billNumber: data.BillNumber || data.bill_number || consumerNo,
    dueDate: data.DueDate || data.dueDate || data.duedate || "N/A",
    billDate: data.BillDate || data.bill_date || data.billdate || "N/A",
    state: data.State || data.state || "N/A",
    billingAddress: data.Address || data.address || data.billing_address || "N/A",
    lastPaymentAmount: data.LastPaymentAmount || data.last_payment_amount || null,
    lastPaymentDate: data.LastPaymentDate || data.last_payment_date || null,
    connectionStatus: data.Status || data.status || data.ConnectionStatus || "Active",
    ...res
  };
};


/* =====================================================
   FETCH ELECTRICITY PLANS
===================================================== */
exports.fetchPlans = async (operatorCode) => {

  if (!operatorCode) {
    return { STATUS: "FAILED", MESSAGE: "Operator code required" };
  }

  return await callApi(
    "api/Electricity/Plans",
    { operator_code: operatorCode },
    "GET"
  );
};
