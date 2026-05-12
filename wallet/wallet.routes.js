const express = require("express");
const router = express.Router();

const {
  getBalance,
  addMoney,
  getTransactions,
  requestFund,
  getFundRequests
} = require("./wallet.controller");

const authenticate = require("../middlewares/auth");

// 🔥 PROTECTED ROUTES
router.use(authenticate);

// 🔥 NO AUTH FOR DEMO
router.get("/balance", getBalance);

// 🔥 ADD MONEY API
router.post("/add", addMoney);

// 🔥 GET TRANSACTIONS
router.get("/history", getTransactions);

// 🔥 MANUAL FUND REQUEST
router.post("/request", requestFund);
router.get("/requests", getFundRequests);

/* ================= RAZORPAY ROUTES ================= */
const { createOrder, verifyPayment } = require("./payment.controller");
router.post("/razorpay/order", createOrder);
router.post("/razorpay/verify", verifyPayment);

module.exports = router;
