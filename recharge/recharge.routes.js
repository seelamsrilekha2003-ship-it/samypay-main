const express = require("express");
const router = express.Router();
const { mobileRecharge, getRechargeHistory } = require("./recharge.controller");
const authenticate = require("../middlewares/auth");

// FRONTEND CALLS POST /api/recharge
router.post("/", authenticate, mobileRecharge);



// GET /api/recharge/history - Fetch user's recharge history
router.get("/history", authenticate, getRechargeHistory);

module.exports = router;
