const db = require("../config/db");

// 🔹 Recharge Reports (ADMIN)
exports.rechargeReport = (req, res) => {
  const sql = `
    SELECT
      r.service,
      r.account_number,
      r.amount,
      r.status,
      r.reference_id,
      r.created_at,
      u.name AS user_name
    FROM recharges r
    JOIN users u ON r.user_id = u.id
    ORDER BY r.created_at DESC
    LIMIT 100
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Recharge Report Error:", err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
};

// 🔹 Wallet Reports (ADMIN)
exports.walletReport = (req, res) => {
  const sql = `
    SELECT
      t.amount,
      t.type,
      t.reference_id as reference,
      t.description,
      t.created_at,
      u.name AS user_name
    FROM transactions t
    JOIN users u ON t.user_id = u.id
    ORDER BY t.created_at DESC
    LIMIT 100
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Wallet Report Error:", err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
};

// 🔹 Dashboard Stats (ADMIN/RETAILER)
exports.dashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const adminQuery = req.user.role === 'ADMIN';

    // 1. Total Success Amount
    const successQuery = adminQuery
      ? "SELECT SUM(amount) as total FROM recharges WHERE status = 'SUCCESS'"
      : "SELECT SUM(amount) as total FROM recharges WHERE user_id = ? AND status = 'SUCCESS'";
    const successParams = adminQuery ? [] : [userId];

    // 2. Pending Count
    const pendingQuery = adminQuery
      ? "SELECT COUNT(*) as count FROM recharges WHERE status = 'PENDING'"
      : "SELECT COUNT(*) as count FROM recharges WHERE user_id = ? AND status = 'PENDING'";
    const pendingParams = adminQuery ? [] : [userId];

    // 3. Wallet Balance
    const balanceQuery = "SELECT wallet_balance FROM users WHERE id = ?";

    // 4. Recent Transactions Count (Today)
    const txQuery = adminQuery
      ? "SELECT COUNT(*) as count FROM transactions WHERE date(created_at) = date('now')"
      : "SELECT COUNT(*) as count FROM transactions WHERE user_id = ? AND date(created_at) = date('now')";
    const txParams = adminQuery ? [] : [userId];

    const [successRes] = await db.promise().query(successQuery, successParams);
    const [pendingRes] = await db.promise().query(pendingQuery, pendingParams);
    const [balanceRes] = await db.promise().query(balanceQuery, [userId]);
    const [txRes] = await db.promise().query(txQuery, txParams);

    res.json({
      success: true,
      data: {
        totalSuccess: successRes[0].total || 0,
        pendingCount: pendingRes[0].count || 0,
        walletBalance: balanceRes.length ? balanceRes[0].wallet_balance : 0,
        recentTransactions: txRes[0].count || 0
      }
    });


  } catch (err) {
    console.error("Dashboard Stats Error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch stats" });
  }
};
