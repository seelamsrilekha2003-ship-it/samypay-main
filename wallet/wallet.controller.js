const db = require("../config/db");

/* 🔹 GET WALLET BALANCE */
exports.getBalance = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db
      .promise()
      .query(
        "SELECT wallet_balance FROM users WHERE id = ?",
        [userId]
      );

    if (!rows.length) {
      return res.json({ balance: 0 });
    }

    return res.json({
      balance: Number(rows[0].wallet_balance) || 0
    });

  } catch (err) {
    console.error("Wallet fetch error:", err);
    return res.json({ balance: 0 });
  }
};

/* 🔹 ADD MONEY TO WALLET (DUMMY UPI - OPTIONAL) */
exports.addMoney = async (req, res) => {
  try {
    const { amount, paymentMode } = req.body;
    const userId = req.user.id;

    const amt = Number(amount);

    if (!amt || amt <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount"
      });
    }

    // Get current balance
    const [userRows] = await db.promise().query("SELECT wallet_balance FROM users WHERE id = ?", [userId]);
    const currentBalance = userRows.length ? Number(userRows[0].wallet_balance) : 0;
    const newBalance = currentBalance + amt;

    // 1️⃣ Update wallet balance
    await db.promise().query(
      "UPDATE users SET wallet_balance = ? WHERE id = ?",
      [newBalance, userId]
    );

    // 2️⃣ Insert wallet transaction
    await db.promise().query(
      `
      INSERT INTO transactions
      (user_id, amount, type, transaction_type, service_type, description, status, reference_id, opening_balance, closing_balance, created_at)
      VALUES (?, ?, 'CREDIT', 'WALLET_CREDIT', 'WALLET', 'Manual Add', 'SUCCESS', 'MANUAL', ?, ?, datetime('now'))
      `,
      [userId, amt, currentBalance, newBalance]
    );

    return res.json({
      success: true,
      message: "Money added to wallet",
      amount: amt
    });

  } catch (err) {
    console.error("Add money error:", err);
    return res.status(500).json({
      success: false,
      message: "Add money failed"
    });
  }
};
/* 🔹 GET WALLET TRANSACTIONS */
exports.getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fromDate, toDate, type } = req.query;

    // SQLite: transactions table
    let sql = `
      SELECT id, amount, type, reference_id as reference, description, status, created_at 
      FROM transactions 
      WHERE user_id = ?
    `;
    const params = [userId];

    if (fromDate) {
      sql += " AND date(created_at) >= ?";
      params.push(fromDate);
    }
    if (toDate) {
      sql += " AND date(created_at) <= ?";
      params.push(toDate);
    }
    if (type) {
      sql += " AND type = ?";
      params.push(type);
    }

    sql += " ORDER BY created_at DESC";

    const [rows] = await db.promise().query(sql, params);

    res.json({
      success: true,
      data: rows
    });

  } catch (err) {
    console.error("Wallet transactions error:", err);
    res.status(500).json({ success: false, message: "Fetch failed" });
  }
};
/* 🔹 MANUAL FUND REQUEST */
exports.requestFund = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      bank_name,
      payment_mode,
      amount,
      payment_date,
      reference_no,
      remarks,
      proof_image
    } = req.body;

    // Basic Validation
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }
    if (!bank_name || !payment_mode || !payment_date || !reference_no) {
      return res.status(400).json({ success: false, message: "All required fields must be filled" });
    }

    // Insert into DB
    const sql = `
      INSERT INTO fund_requests 
      (user_id, bank_name, payment_mode, amount, payment_date, reference_no, remarks, proof_image, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')
    `;

    await db.promise().query(sql, [
      userId,
      bank_name,
      payment_mode,
      Number(amount),
      payment_date,
      reference_no,
      remarks || '',
      proof_image || ''
    ]);

    return res.json({
      success: true,
      message: "Fund request submitted successfully! Waiting for admin approval."
    });

  } catch (err) {
    console.error("Fund Request Error:", err);
    return res.status(500).json({ success: false, message: "Failed to submit fund request" });
  }
};

/* 🔹 GET FUND REQUEST HISTORY */
exports.getFundRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const sql = "SELECT * FROM fund_requests WHERE user_id = ? ORDER BY created_at DESC";

    const [rows] = await db.promise().query(sql, [userId]);

    res.json({
      success: true,
      data: rows
    });

  } catch (err) {
    console.error("Fetch Request Error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch history" });
  }
};
