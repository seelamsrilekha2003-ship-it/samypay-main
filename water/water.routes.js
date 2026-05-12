const express = require("express");
const router = express.Router();
const waterController = require("./water.controller");
const authenticate = require("../middlewares/auth");

// POST /api/water/recharge
router.post("/recharge", authenticate, waterController.recharge);
router.post("/fetch-bill", authenticate, waterController.fetchBill);

module.exports = router;
