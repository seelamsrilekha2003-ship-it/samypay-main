const service = require("./googleplay.service");

exports.recharge = async (req, res) => {
  try {
    const { account, operator, amount, paymentMode } = req.body;
    const userId = req.user.id;

    const result = await service.processRecharge({
      userId,
      account,
      operator,
      amount: Number(amount),
      service: "GOOGLEPLAY",
      paymentMode
    });

    // 🔥 ALWAYS SEND success: true
    return res.json({
      success: true,
      ...result
    });

  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
