
const express = require("express");
const router = express.Router();
const { recharge, fetchDetails } = require("./fastag.controller");
const authenticate = require("../middlewares/auth");

router.post("/recharge", authenticate, recharge);
router.post("/fetch-details", authenticate, fetchDetails);

module.exports = router;
