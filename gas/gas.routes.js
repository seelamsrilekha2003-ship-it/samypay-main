const express = require("express");
const router = express.Router();
const controller = require("./gas.controller");
const authenticate = require("../middlewares/auth");

router.post("/recharge", authenticate, controller.recharge);
router.post("/fetch-bill", authenticate, controller.fetchBill);
router.post("/detect-operator", authenticate, controller.detectOperator); // New

module.exports = router;
