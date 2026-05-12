const landlineService = require("./landline.service");

exports.recharge = async (req, res) => {
  try {
    const { account, operator, amount, paymentMode } = req.body;
    const userId = req.user.id; // From auth middleware

    const result = await landlineService.processRecharge({
      userId,
      account,
      operator,
      amount,
      service: "LANDLINE",
      paymentMode
    });

    res.json({ success: true, ...result });

  } catch (error) {
    console.error("Landline Recharge Error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.fetchBill = async (req, res) => {
  try {
    const { operator, consumerNumber } = req.body;
    if (!operator || !consumerNumber) {
      return res.status(400).json({ success: false, message: "Operator and Consumer Number required" });
    }
    const result = await landlineService.fetchDetails(operator, consumerNumber);
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
