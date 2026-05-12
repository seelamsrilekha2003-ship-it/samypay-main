const service = require("./electricity.service");

/* ===============================
   ELECTRICITY BILL PAYMENT
================================ */
exports.recharge = async (req, res) => {
  try {
    const { account, operator, amount, paymentMode } = req.body;

    if (!account || !operator || !amount) {
      return res.status(400).json({
        success: false,
        message: "Account, operator and amount are required"
      });
    }

    const result = await service.processRecharge({
      userId: req.user.id,
      account: account.toString().trim(),
      operator,
      amount: Number(amount),
      service: "ELECTRICITY",
      paymentMode
    });

    return res.json({
      success: true,
      ...result
    });

  } catch (err) {
    console.error("Recharge Error:", err);
    return res.status(400).json({
      success: false,
      message: err.message || "Recharge failed"
    });
  }
};


/* ===============================
   AUTO OPERATOR (LIMITED SUPPORT)
================================ */
exports.autoOperator = async (req, res) => {
  try {
    const consumerNo = req.body.consumerNo?.toString().trim();

    if (!consumerNo) {
      return res.json({
        success: false,
        autoDetect: false,
        message: "Consumer number required"
      });
    }

    const result = await service.fetchOperator(consumerNo);
    console.log("AUTO OPERATOR RAW:", result);

    if (!result || result.STATUS !== "SUCCESS" || !result.DATA?.OperatorCode) {
      return res.json({
        success: true,
        autoDetect: false,
        message: "Auto operator not available. Please select manually."
      });
    }

    return res.json({
      success: true,
      autoDetect: true,
      operator: result.DATA.OperatorName || "UNKNOWN",
      opCode: result.DATA.OperatorCode
    });

  } catch (err) {
    console.error("Auto Operator Error:", err);
    return res.json({
      success: true,
      autoDetect: false,
      message: "Auto operator failed. Please select manually."
    });
  }
};


/* ===============================
   FETCH BILL DETAILS (REAL FIX)
================================ */
exports.fetchDetails = async (req, res) => {
  try {
    const consumerNo = req.body.consumerNo?.toString().trim();
    const operatorCode = req.body.operatorCode?.toString().trim();

    if (!consumerNo || !operatorCode) {
      return res.json({
        success: false,
        message: "Consumer number and operator required"
      });
    }

    const result = await service.fetchBillDetails(consumerNo, operatorCode);
    if (!result.success) return res.status(404).json(result);
    return res.json({ success: true, data: result });

  } catch (err) {
    console.error("Fetch Details Error:", err);
    return res.json({
      success: false,
      message: "Electricity bill fetch failed"
    });
  }
};


/* ===============================
   FETCH PLANS (OPTIONAL)
================================ */
exports.fetchPlans = async (req, res) => {
  try {
    const opCode = req.body.opCode?.toString().trim();

    if (!opCode) {
      return res.json({
        success: false,
        message: "Operator code required"
      });
    }

    const result = await service.fetchPlans(opCode);

    if (result && result.STATUS === "SUCCESS") {
      const plans = (result.DATA || []).map((p, i) => ({
        id: i + 1,
        amount: String(p.Amount || p.amount || "0"),
        description: p.Description || "Electricity Bill"
      }));

      return res.json({
        success: true,
        plans
      });
    }

    return res.json({
      success: false,
      message: result?.MESSAGE || "No plans available"
    });

  } catch (err) {
    console.error("Plans Error:", err);
    return res.json({
      success: false,
      message: "Plans fetch failed"
    });
  }
};
