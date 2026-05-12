const express = require("express");
const router = express.Router();
const db = require("../config/db");
const axios = require("axios");

// --------------------
// ENV CHECK (IMPORTANT)
// --------------------
if (!process.env.PLANAPI_TOKEN) {
    console.warn("⚠️ PLANAPI_TOKEN is missing in .env file");
}

// --------------------
// HEALTH CHECK API
// --------------------
router.get("/check", async (req, res) => {
    try {
        const [rows] = await db.promise().query("SELECT 1 as val");

        res.json({
            success: true,
            message: "Backend and Database are connected!",
            dbCheck: rows[0].val === 1
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Database connection failed",
            error: error.message
        });
    }
});

// --------------------
// DANGER ZONE API
// --------------------
router.delete("/nuke", async (req, res) => {

    try {

        console.log("🔥 Triggering INTERNAL FORCE DELETE via API...");

        await db.promise().query("DELETE FROM users");

        try {
            await db.promise().query("DELETE FROM sqlite_sequence WHERE name='users'");
        } catch (e) { }

        const [rows] = await db.promise().query("SELECT COUNT(*) as count FROM users");

        console.log(`✅ Nuke Complete. Remaining users: ${rows[0].count}`);

        res.json({
            success: true,
            message: "Users Table Truncated via Internal API",
            remaining: rows[0].count
        });

    } catch (error) {

        console.error("Nuke Error:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// --------------------
// PLANAPI LIVE PLANS
// --------------------
router.get("/plans", async (req, res) => {

    try {

        const { operator, type } = req.query;

        if (!operator || !type) {
            return res.status(400).json({
                success: false,
                message: "operator and type required"
            });
        }

        const response = await axios.get(
            "https://planapi.in/api/recharge/plans",
            {
                timeout: 15000, // 15 sec timeout
                headers: {
                    Authorization: `Bearer ${process.env.PLANAPI_TOKEN}`
                    // apikey: process.env.PLANAPI_TOKEN
                },
                params: {
                    operator,
                    type
                }
            }
        );

        if (!response.data) {
            return res.status(502).json({
                success: false,
                message: "Invalid PlanAPI response"
            });
        }

        res.json({
            success: true,
            plans: response.data
        });

    } catch (error) {

        console.error("PlanAPI Error:", error.response?.data || error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch plans"
        });
    }

});

// --------------------
// WALLET BALANCE API
// --------------------
router.get("/wallet/:userId", async (req, res) => {

    try {

        const { userId } = req.params;

        const [rows] = await db.promise().query(
            "SELECT balance FROM wallet WHERE user_id = ?",
            [userId]
        );

        res.json({
            success: true,
            balance: rows.length ? rows[0].balance : 0
        });

    } catch (error) {

        console.error("Wallet Error:", error);

        res.status(500).json({
            success: false,
            message: "Wallet fetch failed"
        });
    }
});

// --------------------
// RECHARGE API
// --------------------
router.post("/recharge", async (req, res) => {

    const { userId, mobile, operator, amount } = req.body;

    if (!userId || !mobile || !operator || !amount) {
        return res.status(400).json({
            success: false,
            message: "Missing recharge fields"
        });
    }

    const conn = await db.promise().getConnection();

    try {

        await conn.beginTransaction();

        // Check Wallet
        const [wallet] = await conn.query(
            "SELECT balance FROM wallet WHERE user_id=?",
            [userId]
        );

        if (!wallet.length || wallet[0].balance < amount) {

            await conn.rollback();

            return res.status(400).json({
                success: false,
                message: "Insufficient Wallet Balance"
            });
        }

        // Deduct Wallet
        await conn.query(
            "UPDATE wallet SET balance = balance - ? WHERE user_id=?",
            [amount, userId]
        );

        // Call PlanAPI Recharge
        const rechargeResponse = await axios.post(
            "https://planapi.in/api/recharge/mobile",
            {
                mobile,
                operator,
                amount
            },
            {
                timeout: 20000,
                headers: {
                    Authorization: `Bearer ${process.env.PLANAPI_TOKEN}`
                }
            }
        );

        const txnId = rechargeResponse.data?.txn_id || `TXN_${Date.now()}`;

        // Save Transaction
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

        console.error("Recharge Error:", error.response?.data || error.message);

        res.status(500).json({
            success: false,
            message: "Recharge Failed"
        });

    } finally {

        conn.release();
    }

});

module.exports = router;
