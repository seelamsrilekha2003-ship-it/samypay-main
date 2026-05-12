
const express = require("express");
const router = express.Router();
const controller = require("./electricity.controller");
const authenticate = require("../middlewares/auth");

// Electricity bill payment
router.post("/recharge", authenticate, controller.recharge);

// ✅ Auto operator
router.post("/auto-operator", controller.autoOperator);

// ✅ Fetch bill details
router.post("/fetch-details", controller.fetchDetails);

// Optional plans
router.post("/plans", controller.fetchPlans);

// Debug
router.get("/ping", (req, res) => res.send("Electricity Routes Working"));

module.exports = router;
