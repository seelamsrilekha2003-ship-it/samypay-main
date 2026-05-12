const axios = require("axios");

const {
  PLAN_API_ID,
  PLAN_API_PASSWORD
} = require("../config/env");

exports.getPlans = async ({ operator, circle }) => {

  if (!operator || !circle) {
    throw new Error("Operator or Circle missing");
  }

  try {
    console.log("PLAN API CALLING ->", operator, circle);

    // Try multiple parameter name variations if needed, common in PlanAPI
    const params = {
      apimember_id: PLAN_API_ID,
      api_password: PLAN_API_PASSWORD,
      ApiUserID: PLAN_API_ID, // Variation
      ApiPassword: PLAN_API_PASSWORD, // Variation
      user_id: PLAN_API_ID, // Variation
      operatorcode: operator,
      cricle: circle, // Typo common in PlanAPI
      circle: circle  // Standard name
    };

    const response = await axios.get(
      "https://planapi.in/api/Mobile/Operatorplan",
      { params, timeout: 20000 }
    );

    const apiData = response.data;
    console.log("PLAN API RESPONSE =>", JSON.stringify(apiData).substring(0, 500));

    // If PlanAPI returns success: 0 or STATUS: 0, it means it worked but no data or error
    if (apiData.STATUS == "0" || apiData.STATUS === 0) {
      console.warn("PlanAPI returned failure status:", apiData.MESSAGE);
    }

    return apiData;

  } catch (error) {
    const errorData = error.response?.data || error.message;
    console.error("PLAN FETCH FATAL ERROR =>", errorData);

    // Throw descriptive error
    throw new Error(typeof errorData === 'string' ? errorData : JSON.stringify(errorData));
  }
};
