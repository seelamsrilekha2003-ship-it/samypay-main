const express = require("express");
const router = express.Router();
const controller = require("./detect.controller");
const authenticate = require("../middlewares/auth");

// POST /api/detect/operator
router.post("/operator", authenticate, controller.detectOperator);

module.exports = router;
