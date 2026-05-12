const axios = require("axios");
const { PLANAPI_TOKEN } = require("../config/env");

exports.getOperators = async () => {

  try {

    if (!PLANAPI_TOKEN) {
      throw new Error("PLANAPI_TOKEN is missing in .env");
    }

    const response = await axios.get(
      "https://planapi.in/api/operators",
      {
        timeout: 15000,
        headers: {
          apikey: PLANAPI_TOKEN   // ✅ CORRECT HEADER
        }
      }
    );

    if (!response.data) {
      throw new Error("Invalid PlanAPI response");
    }

    return response.data;

  } catch (error) {

    console.error("Operator LIVE API Error:",
      error.response?.data || error.message
    );

    throw new Error("Failed to fetch operators");
  }

};
