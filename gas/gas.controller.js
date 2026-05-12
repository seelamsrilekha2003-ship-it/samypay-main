
const service = require("./gas.service");

exports.recharge = async (req, res) => {
  try {
    const { account, operator, amount, paymentMode } = req.body;
    const userId = req.user.id;

    const result = await service.processRecharge({
      userId,
      account,
      operator,
      amount: Number(amount),
      service: "GAS",
      paymentMode
    });

    res.json({
      success: true,
      ...result
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.fetchBill = async (req, res) => {
  try {
    const { operator, consumerNumber } = req.body;
    if (!operator || !consumerNumber) {
      return res.status(400).json({ success: false, message: "Operator and Consumer Number required" });
    }
    const result = await service.fetchDetails(operator, consumerNumber);
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.detectOperator = async (req, res) => {
  try {
    const { consumerNumber } = req.body;
    if (!consumerNumber) return res.status(400).json({ success: false, message: "Number required" });

    const operator = await service.detectOperator(consumerNumber);
    if (!operator) return res.status(404).json({ success: false, message: "Operator not found" });

    res.json({ success: true, operator });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
