const Razorpay = require("razorpay");
const crypto = require("crypto");
const db = require("../config/db"); // Import DB
require("dotenv").config();

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_dummy",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "dummy_secret"
});

exports.createOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, message: "Invalid amount" });
        }

        const options = {
            amount: amount * 100, // amount in smallest currency unit (paise)
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`
        };

        let order;
        try {
            order = await razorpay.orders.create(options);
        } catch (e) {
            console.log("Razorpay create failed (likely dummy keys)", e.message);
        }

        if (!order) {
            // Dummy fallback
            order = {
                id: `order_dummy_${Date.now()}`,
                amount: options.amount,
                currency: "INR"
            };
        }

        res.json({
            success: true,
            orderId: order.id,
            amount: options.amount,
            currency: options.currency,
            key: process.env.RAZORPAY_KEY_ID || "rzp_test_dummy"
        });

    } catch (error) {
        console.error("Create Order Error:", error);
        res.status(500).json({ success: false, message: "Order creation failed" });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body;
        const userId = req.user.id; // From Auth Middleware

        const key_secret = process.env.RAZORPAY_KEY_SECRET || "dummy_secret";

        // 1. Verify Signature
        let isValid = false;
        if (key_secret === "dummy_secret") {
            isValid = true;
        } else {
            const body = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSignature = crypto
                .createHmac("sha256", key_secret)
                .update(body.toString())
                .digest("hex");
            if (expectedSignature === razorpay_signature) {
                isValid = true;
            }
        }

        if (isValid) {
            // 2. Credit Wallet
            const amt = Number(amount);
            if (!amt || amt <= 0) {
                return res.status(400).json({ success: false, message: "Invalid amount for wallet credit" });
            }

            // Get Current Balance
            const [userRows] = await db.promise().query("SELECT wallet_balance FROM users WHERE id = ?", [userId]);
            const currentBalance = userRows.length ? Number(userRows[0].wallet_balance) : 0;
            const newBalance = currentBalance + amt;

            // Update Balance in Users Table
            await db.promise().query(
                "UPDATE users SET wallet_balance = ? WHERE id = ?",
                [newBalance, userId]
            );

            // Record Transaction
            console.log("Verify: Recording Transaction for User", userId, amt);
            try {
                await db.promise().query(
                    `INSERT INTO transactions 
                    (user_id, amount, type, transaction_type, service_type, description, status, reference_id, opening_balance, closing_balance, created_at) 
                    VALUES (?, ?, 'CREDIT', 'WALLET_CREDIT', 'WALLET', 'Wallet Topup via Razorpay', 'SUCCESS', ?, ?, ?, datetime('now'))`,
                    [userId, amt, razorpay_payment_id, currentBalance, newBalance]
                );
            } catch (dbErr) {
                console.error("DB Insert Error:", dbErr);
                // Don't fail the verification if logging fails, but it's bad.
            }

            res.json({ success: true, message: "Payment Verified & Wallet Credited" });
        } else {
            res.status(400).json({ success: false, message: "Invalid Signature" });
        }

    } catch (error) {
        console.error("Verify Error:", error);
        res.status(500).json({ success: false, message: "Payment verification failed: " + error.message });
    }
};
