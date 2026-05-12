const express = require("express");
const router = express.Router();
const { login, register, verifyOtp } = require("./auth.controller");

router.post("/login", login);
router.post("/register", register);
router.post("/verify-otp", verifyOtp);

module.exports = router;
