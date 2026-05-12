const express = require("express");
const router = express.Router();
const {
    getDayRechargeReport,
    getDayCollectionReport,
    getRetailerSalesReport,
    getDistributorSalesReport
} = require("./daily-reports.controller");

router.get("/recharge", getDayRechargeReport);
router.get("/collection", getDayCollectionReport);
router.get("/retailer-sales", getRetailerSalesReport);
router.get("/distributor-sales", getDistributorSalesReport);

module.exports = router;
