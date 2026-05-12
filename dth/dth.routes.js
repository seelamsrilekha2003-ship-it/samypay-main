const express = require("express");
const router = express.Router();
const controller = require("./dth.controller");

// 1️⃣ Consumer number → auto operator
router.post("/auto-operator", controller.autoOperator);

// 2️⃣ Fetch customer details
router.post("/fetch-details", controller.fetchDetails);

// 3️⃣ Fetch plans
router.post("/plans", controller.fetchPlans);

module.exports = router;
