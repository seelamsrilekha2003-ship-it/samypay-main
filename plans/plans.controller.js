const plansService = require("./plans.service");

exports.getPlans = async (req, res) => {

  try {

    const { operator, circle } = req.query;

    console.log("REQUEST PARAMS =>", operator, circle);

    if (!operator || !circle) {
      return res.status(400).json({
        success: false,
        message: "Operator or Circle missing"
      });
    }

    const plans = await plansService.getPlans({
      operator,
      circle
    });

    // Handle PlanAPI success/failure status
    const isError = plans && (plans.STATUS === "0" || plans.STATUS === 0);
    if (isError) {
      return res.status(400).json({
        success: false,
        message: plans.MESSAGE || "No plans found for the selected operator/circle",
        data: plans
      });
    }

    return res.json({
      success: true,
      data: plans
    });

  } catch (error) {

    console.error("PLANS API ERROR =>", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch mobile plans",
      error: error.message
    });

  }

};
