const axios = require("axios");
const { PLANAPI_TOKEN } = require("../config/env");

exports.mobileRecharge = async ({ mobile, operator, amount }) => {

  if (!mobile || !operator || !amount) {
    throw new Error("Mobile, operator, and amount are required");
  }

  try {

    if (!PLANAPI_TOKEN) {
      throw new Error("PLANAPI_TOKEN is missing in .env");
    }

    const response = await axios.post(
      "https://planapi.in/api/recharge/mobile",
      {
        mobile: String(mobile),
        operator: String(operator).toUpperCase(),
        amount: Number(amount)
      },
      {
        timeout: 30000, // 30 seconds for recharge
        headers: {
          apikey: PLANAPI_TOKEN  // Using same header as operators/plans
        }
      }
    );

    if (!response.data) {
      throw new Error("Invalid PlanAPI recharge response");
    }

    // Return the API response data
    return {
      success: true,
      apiResponse: response.data,
      transactionId: response.data.txn_id || response.data.transaction_id || `TXN_${Date.now()}`
    };

  } catch (error) {

    console.error("Real Recharge API Error:",
      error.response?.data || error.message
    );

    // Throw error so service can handle it
    throw new Error(`Recharge API failed: ${error.response?.data?.message || error.message}`);
  }

};
