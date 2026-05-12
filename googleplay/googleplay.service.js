const db = require("../config/db");

/* =========================
   🔹 PROCESS GOOGLE PLAY REDEEM CODE
========================= */
exports.processRecharge = async ({
  userId,
  account, // Usually mobile or email
  operator,
  amount,
  service,
  paymentMode
}) => {

  amount = Number(amount);
  if (!amount || amount <= 0) throw new Error("Invalid amount");

  // Generate Redeem Code
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const randomStr = (length) => Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
  const redeemCode = `PLAY-${randomStr(4)}-${randomStr(4)}-${randomStr(4)}`;
  const referenceId = redeemCode;

  const recordRecharge = async (status = 'SUCCESS', bal = null) => {
    // 1. Insert Recharge
    await db.promise().query(
      `INSERT INTO recharges (user_id, account_number, operator, amount, status, service, reference_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      [userId, account || 'GooglePlay', operator, amount, status, service, referenceId]
    );

    // 2. Log Transaction
    const oldBal = bal !== null ? bal + amount : 0; // Simplified for display
    const currentBal = bal !== null ? bal : 0;

    await db.promise().query(
      `INSERT INTO transactions (user_id, amount, type, transaction_type, service_type, operator_name, account_number, description, status, reference_id, opening_balance, closing_balance, created_at) VALUES (?, ?, 'DEBIT', 'RECHARGE', ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      [userId, amount, service, operator, account || 'GooglePlay', `Google Play Redeem Code: ${redeemCode}`, status, referenceId, oldBal, currentBal]
    );
  };

  if (paymentMode === "WALLET") {
    const [rows] = await db.promise().query("SELECT wallet_balance FROM users WHERE id = ?", [userId]);
    if (!rows.length) throw new Error("User not found");
    const currentBalance = Number(rows[0].wallet_balance);

    if (currentBalance < amount) throw new Error(`Insufficient wallet balance (Current: ₹${currentBalance})`);

    const newBalance = currentBalance - amount;
    await db.promise().query("UPDATE users SET wallet_balance = ? WHERE id = ?", [newBalance, userId]);

    await recordRecharge('SUCCESS', newBalance);
    return {
      success: true,
      paymentMode: "WALLET",
      message: "Google Play Code Generated Successfully",
      referenceId,
      redeemCode,
      balance: newBalance
    };
  }

  if (paymentMode === "RAZORPAY" || paymentMode === "UPI") {
    await recordRecharge('SUCCESS');
    return {
      success: true,
      paymentMode,
      message: "Google Play Code Generated Successfully",
      referenceId,
      redeemCode
    };
  }

  throw new Error("Invalid payment mode");
};
