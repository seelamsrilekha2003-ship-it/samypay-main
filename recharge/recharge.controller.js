const rechargeService = require("./recharge.service");

exports.mobileRecharge = async (req, res) => {
  try {
    const { mobile, operator, amount, paymentMode } = req.body;

    const userId = req.user.id;

    /* ===== VALIDATIONS ===== */
    if (!mobile || String(mobile).length !== 10) {
      return res.status(400).json({ success: false, message: "Invalid mobile number" });
    }

    if (!operator) {
      return res.status(400).json({ success: false, message: "Operator missing" });
    }

    const amt = Number(amount);
    if (!amt || amt <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    if (!["WALLET", "UPI", "RAZORPAY"].includes(paymentMode)) {
      return res.status(400).json({ success: false, message: "Invalid payment mode" });
    }

    /* ===== SERVICE ===== */
    console.log(`🚀 Processing ${paymentMode} recharge for ${mobile} (${operator})...`);
    const result = await rechargeService.mobileRecharge({
      userId,
      mobile,
      operator,
      amount: amt,
      paymentMode
    });

    console.log(`✅ Recharge result:`, JSON.stringify(result));

    return res.json({
      success: result.success !== undefined ? result.success : true,
      ...result
    });


  } catch (err) {
    console.error("❌ Recharge error:", err.message);
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

/* ===== GET RECHARGE HISTORY ===== */
exports.getRechargeHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const db = require("../config/db");
    const [rows] = await db.promise().query(
      `SELECT * FROM recharges WHERE user_id = ? ORDER BY created_at DESC LIMIT 50`,
      [userId]
    );

    return res.json({
      success: true,
      data: rows
    });

  } catch (err) {
    console.error("❌ Recharge history error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch recharge history"
    });
  }
};
