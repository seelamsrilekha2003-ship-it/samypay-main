const axios = require("axios");
const env = require("../config/env");

/**
 * Common helper for PlanAPI calls
 */
const callApi = async (endpoint, params) => {
  const baseUrl = (env.PLAN_API_BASE_URL || "https://planapi.in").replace(/\/$/, "");
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const fullUrl = `${baseUrl}${cleanEndpoint}`;

  console.log(`[DTH API] Calling (GET): ${fullUrl}`);

  try {
    const response = await axios.get(fullUrl, {
      params: {
        // Try multiple variations of auth keys just in case
        apimember_id: env.PLAN_API_ID,
        api_password: env.PLAN_API_PASSWORD,
        ApiMemberID: env.PLAN_API_ID,
        ApiPassword: env.PLAN_API_PASSWORD,
        ...params
      },
      timeout: 20000 // Slightly longer timeout
    });
    return response.data;
  } catch (error) {
    console.error(`[DTH API ERROR] ${endpoint}:`, error.message);
    return { success: false, message: error.message };
  }
};

// 1️⃣ Operator auto fetch
// PlanAPI sometimes uses OperatorCheck or DthOperatorFetch
exports.fetchOperator = (consumerNo) =>
  callApi("/api/Mobile/DthOperatorFetch", {
    dth_number: consumerNo,
    Number: consumerNo
  });

// 2️⃣ Customer basic details
exports.fetchDetails = (consumerNo, operatorCode) =>
  callApi("/api/Mobile/DTHBasicDetails", {
    mobile_no: consumerNo,
    Opcode: operatorCode
  });

// 3️⃣ Detailed info (includes balance/plan)
exports.fetchLastRecharge = (consumerNo, operatorCode) =>
  callApi("/api/Mobile/DthInfoWithLastRechargeDate", {
    mobile_no: consumerNo,
    Opcode: operatorCode,
    operatorcode: operatorCode
  });

// 4️⃣ Plans (OpCode based)
exports.fetchPlans = (opCode) =>
  callApi("/api/Mobile/DthPlans", {
    operatorcode: opCode,
    Opcode: opCode
  });
