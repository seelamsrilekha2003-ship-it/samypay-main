const express = require("express");
const router = express.Router();
const { recharge } = require("./googleplay.controller");
const authenticate = require("../middlewares/auth");

router.post("/recharge", authenticate, recharge);

module.exports = router;
