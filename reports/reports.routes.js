const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { rechargeReport, walletReport, dashboardStats } = require("./reports.controller");

router.get("/recharges", auth, rechargeReport);
router.get("/wallet", auth, walletReport);
router.get("/stats", auth, dashboardStats);

module.exports = router;
