const express = require("express");
const router = express.Router();
const {
    getUserCommissions,
    getUserCommissionStats,
    getCommissionsByService,
    getMonthlyCommissionSummary
} = require("./user-commissions.controller");

router.get("/", getUserCommissions);
router.get("/stats", getUserCommissionStats);
router.get("/monthly", getMonthlyCommissionSummary);
router.get("/service/:serviceType", getCommissionsByService);

module.exports = router;
