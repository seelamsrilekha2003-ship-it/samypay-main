const axios = require("axios");

router.post("/recharge", async (req, res) => {

  const { userId, mobile, operator, amount } = req.body;

  const conn = await db.promise().getConnection();

  try {

    await conn.beginTransaction();

    // 1️⃣ Wallet Check
    const [wallet] = await conn.query(
      "SELECT balance FROM wallet WHERE user_id=?",
      [userId]
    );

    if (!wallet.length || wallet[0].balance < amount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient Wallet Balance"
      });
    }

    // 2️⃣ Call PlanAPI Recharge FIRST
    const rechargeResponse = await axios.get(
      "https://planapi.in/api/Mobile/MobileRechargeNew",
      {
        params: {
          ApiUserID: process.env.PLAN_API_USERID,
          ApiPassword: process.env.PLAN_API_PASSWORD,
          MobileNo: mobile,
          OperatorCode: operator,
          Amount: amount
        },
        timeout: 15000
      }
    );

    const apiData = rechargeResponse.data;

    console.log("PLANAPI RECHARGE RESPONSE =>", apiData);

    // 3️⃣ Validate Recharge Status
    if (apiData?.Status !== "SUCCESS") {

      await conn.rollback();

      return res.status(400).json({
        success: false,
        message: apiData?.Message || "Recharge Failed"
      });
    }

    const txnId = apiData?.TxnId || apiData?.TransactionId || "TXN_" + Date.now();

    // 4️⃣ Deduct Wallet AFTER success
    await conn.query(
      "UPDATE wallet SET balance = balance - ? WHERE user_id=?",
      [amount, userId]
    );

    // 5️⃣ Save Transaction
    await conn.query(
      `INSERT INTO recharges 
      (user_id, mobile, operator, amount, status, txn_id)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, mobile, operator, amount, "SUCCESS", txnId]
    );

    await conn.commit();

    res.json({
      success: true,
      message: "Recharge Successful",
      transactionId: txnId
    });

  } catch (error) {

    await conn.rollback();

    console.error("Recharge Error =>", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Recharge Failed"
    });

  } finally {
    conn.release();
  }

});
