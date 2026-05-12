const express = require("express");
const router = express.Router();
const landlineController = require("./landline.controller");
const authenticate = require("../middlewares/auth");

// POST /api/landline/recharge
router.post("/recharge", authenticate, landlineController.recharge);
router.post("/fetch-bill", authenticate, landlineController.fetchBill);

module.exports = router;
