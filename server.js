const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

/* ================= IMPORT ROUTES ================= */

// Auth / Users
const authRoutes = require("./auth/auth.routes");
const usersRoutes = require("./users/users.routes");

// Wallet
const walletRoutes = require("./wallet/wallet.routes");

// Mobile Recharge
const operatorsRoutes = require("./operators/operators.routes");
const plansRoutes = require("./plans/plans.routes");
const rechargeRoutes = require("./recharge/recharge.routes");

// DTH
const dthRoutes = require("./dth/dth.routes");

// Bills & Services
const electricityRoutes = require("./electricity/electricity.routes");
const googlePlayRoutes = require("./googleplay/googleplay.routes");
const gasRoutes = require("./gas/gas.routes");
const fastagRoutes = require("./fastag/fastag.routes");

// Others
const transactionsRoutes = require("./transactions/transactions.routes");
const reportsRoutes = require("./reports/reports.routes");


/* ================= APP INIT ================= */

const app = express();

/* ================= CORS ================= */

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.use(express.json());

/* ================= GLOBAL LOGGER ================= */

app.use((req, res, next) => {
  console.log("➡️ REQ:", req.method, req.originalUrl);
  next();
});

/* ================= DB MIGRATION ================= */

try {
  console.log("Checking database schema...");
  require("./migrate");
} catch (err) {
  console.log("⚠️ Migration skipped:", err.message);
}

/* ================= EMAIL OTP ================= */

let otpStore = {};

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000);

// 📧 SMTP TRANSPORTER CONFIG
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
      ? process.env.PASSWORD.replace(/\s+/g, "")
      : ""
  }
});

transporter.verify(err => {
  if (err) console.error("❌ SMTP ERROR:", err.message);
  else console.log("✅ SMTP READY");
});

/* ================= OTP ROUTES ================= */

app.post("/api/send-otp", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email required" });
  }

  const otp = generateOTP();
  otpStore[email] = {
    otp,
    expiry: Date.now() + 5 * 60 * 1000
  };

  console.log(`[OTP] ${email} => ${otp}`);
  res.json({ message: "OTP generated (DEV MODE)" });
});

// ✅ VERIFY EMAIL OTP
app.post("/api/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  const record = otpStore[email];

  if (!record) {
    return res.status(400).json({ message: "OTP not found" });
  }

  if (Date.now() > record.expiry) {
    delete otpStore[email];
    return res.status(400).json({ message: "OTP expired" });
  }

  if (record.otp == otp) {
    return res.json({ message: "OTP verified" });
  }

  return res.status(400).json({ message: "Invalid OTP" });
});

/* ================= API ROUTES ================= */

// Auth
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);

// Wallet
app.use("/api/wallet", walletRoutes);

// Mobile Recharge
app.use("/api/operators", operatorsRoutes);
app.use("/api/plans", plansRoutes);
app.use("/api/recharge", rechargeRoutes);

// DTH
app.use("/api/dth", dthRoutes);

// Bills
app.use("/api/electricity", electricityRoutes);
app.use("/api/googleplay", googlePlayRoutes);
app.use("/api/gas", gasRoutes);
app.use("/api/fastag", fastagRoutes);

// Other services
app.use("/api/datacard", require("./datacard/datacard.routes"));
app.use("/api/landline", require("./landline/landline.routes"));
app.use("/api/water", require("./water/water.routes"));
app.use("/api/detect", require("./detect/detect.routes")); // New Operator Detection

// Reports / Transactions
app.use("/api/transactions", transactionsRoutes);
app.use("/api/reports", reportsRoutes);

// Common
app.use("/api/services", require("./services/services.routes")); // ✅ only once
app.use("/api/settings", require("./settings/settings.routes"));
app.use("/api/complaints", require("./complaints/complaints.routes"));
app.use("/api/invalid-amounts", require("./invalid-amounts/invalid-amounts.routes"));
app.use("/api/bank", require("./bank/bank.routes"));
app.use("/api/banners", require("./banners/banners.routes"));
app.use("/api/news", require("./news/news.routes"));
app.use("/api/commissions", require("./commissions/commissions.routes"));
app.use("/api/my-commissions", require("./user-commissions/user-commissions.routes"));
app.use("/api/user-roles", require("./user-roles/user-roles.routes"));
app.use("/api/menu", require("./menu/menu.routes"));

/* ================= 404 HANDLER ================= */

app.use((req, res) => {
  console.error("❌ 404 NOT FOUND:", req.originalUrl);
  res.status(404).json({
    success: false,
    message: "API route not found",
    url: req.originalUrl
  });
});

/* ================= SERVER START ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`⚡ Electricity API → /api/electricity`);
  console.log(
    "🔑 PLAN_API_ID:",
    process.env.PLAN_API_ID ? "FOUND" : "❌ MISSING"
  );
  console.log(
    "🔑 PLAN_API_PASSWORD:",
    process.env.PLAN_API_PASSWORD ? "FOUND" : "❌ MISSING"
  );
});
