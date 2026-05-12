const express = require("express");
const router = express.Router();
const {
  getUserTransactions,
  getTransactionStats,
  getTransactionById,
  getDailySummary,
  getServiceBreakdown
} = require("./transactions.controller");

router.get("/", getUserTransactions);
router.get("/stats", getTransactionStats);
router.get("/daily-summary", getDailySummary);
router.get("/service-breakdown", getServiceBreakdown);
router.get("/:id", getTransactionById);

module.exports = router;
