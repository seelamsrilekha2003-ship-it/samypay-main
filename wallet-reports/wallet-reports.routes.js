const express = require("express");
const router = express.Router();
const {
    getWalletTransactions,
    getWalletStats,
    getCurrentBalance,
    getBalanceHistory,
    getPaymentMethodBreakdown
} = require("./wallet-reports.controller");

router.get("/", getWalletTransactions);
router.get("/stats", getWalletStats);
router.get("/balance", getCurrentBalance);
router.get("/balance-history", getBalanceHistory);
router.get("/payment-breakdown", getPaymentMethodBreakdown);

module.exports = router;
