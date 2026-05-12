const express = require("express");
const router = express.Router();
const datacardController = require("./datacard.controller");
const authenticate = require("../middlewares/auth");

// POST /api/datacard/recharge
router.post("/recharge", authenticate, datacardController.recharge);

// POST /api/datacard/fetch-details
router.post("/fetch-details", authenticate, datacardController.fetchDetails);


module.exports = router;
