
const service = require("./fastag.service");

exports.recharge = async (req, res) => {
  try {
    const { account, operator, amount, paymentMode } = req.body;
    const userId = req.user.id;

    const result = await service.processRecharge({
      userId,
      account,
      operator,
      amount: Number(amount),
      service: "FASTAG",
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

exports.fetchDetails = async (req, res) => {
  try {
    const { operator, vehicleNumber } = req.body;
    if (!vehicleNumber) {
      return res.status(400).json({ success: false, message: "Vehicle Number required" });
    }
    const result = await service.fetchDetails(operator, vehicleNumber);
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
