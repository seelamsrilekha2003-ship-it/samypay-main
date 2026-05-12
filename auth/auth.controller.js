const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../config/db");
const otpService = require("../services/otp.service");
const nodemailer = require("nodemailer");

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL || 'annavarapuajay58@gmail.com',
    pass: process.env.PASSWORD || 'wnrg sgqf ndvu uxjm'
  }
});

// Mock In-Memory OTP Storage (In production use Redis or DB)
const otpStore = new Map();

exports.register = async (req, res) => {
  const { name, email, mobile, password, role, role_id } = req.body;

  // Validation
  if (!name || !email || !mobile || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  // Validate mobile number (10 digits)
  if (!/^\d{10}$/.test(mobile)) {
    return res.status(400).json({ success: false, message: "Mobile number must be 10 digits" });
  }

  try {
    // Check if user already exists
    const users = await db.promise().query(
      "SELECT id FROM users WHERE email = ? OR mobile = ?",
      [email, mobile]
    );

    if (users[0].length > 0) {
      return res.status(400).json({ success: false, message: "User already exists with this email or mobile" });
    }

    // Check if requested role requires approval
    const requestedRole = role || 'Retailer';
    const roleCheck = await db.promise().query(
      "SELECT id, role_approval_required FROM roles WHERE role_name = ? OR role_code = ?",
      [requestedRole, requestedRole.toUpperCase()]
    );

    const actualRoleId = roleCheck[0].length > 0 ? roleCheck[0][0].id : 5; // Default to Retailer (5)
    console.log(`[AUTH REG]: Role=${requestedRole} -> RoleID=${actualRoleId}`);

    const requiresApproval = roleCheck[0].length > 0 && roleCheck[0][0].role_approval_required === 1;

    // Generate Mock OTP (4 digits)
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Send OTP using Email
    try {
      await transporter.sendMail({
        from: process.env.EMAIL || 'annavarapuajay58@gmail.com',
        to: email,
        subject: "SamyPay Registration OTP",
        text: `Your OTP for SamyPay registration is ${otp}. Valid for 5 minutes.`,
      });
      console.log(`[OTP SUCCESS] Sent to ${email}`);
    } catch (mailError) {
      console.error("[OTP MAIL FAILURE]:", mailError.message);
      // Fallback: Log to console in development
      console.log(`[OTP DEBUG] The OTP for ${email} is: ${otp}`);
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    otpStore.set(mobile, {
      name, email, mobile, password: hashedPassword, otp,
      role: requestedRole,
      role_id: actualRoleId,
      expires: Date.now() + 5 * 60 * 1000 // 5 mins
    });

    res.json({
      success: true,
      message: "OTP sent successfully to your email: " + email,
      otpSent: true,
      email: email,
      mobile: mobile
    });

  } catch (error) {
    console.error("Registration Init Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.verifyOtp = async (req, res) => {
  const { mobile, otp, email } = req.body;
  const identifier = email || mobile;

  if (!identifier || !otp) {
    return res.status(400).json({ success: false, message: "Email/Mobile and OTP required" });
  }

  const data = otpStore.get(identifier);

  if (!data) {
    return res.status(400).json({ success: false, message: "OTP expired or invalid request" });
  }

  if (data.otp !== otp) {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }

  if (Date.now() > data.expires) {
    otpStore.delete(identifier);
    return res.status(400).json({ success: false, message: "OTP has expired" });
  }

  try {
    // Create User with selected role
    const result = await db.promise().query(
      "INSERT INTO users (name, email, mobile, password, role, role_id, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)",
      [data.name, data.email, data.mobile, data.password, data.role, data.role_id, 'Active']
    );

    // better-sqlite3 returns lastInsertRowid
    const userId = result[0].lastInsertRowid;

    // Clear OTP after success
    otpStore.delete(identifier);

    res.json({
      success: true,
      message: "Registration Successful! Redirecting to login...",
      userId: userId.toString()
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message
    });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by email or mobile
    const users = await db.promise().query(
      `SELECT u.*, r.role_code 
       FROM users u 
       LEFT JOIN roles r ON u.role_id = r.id 
       WHERE u.email = ? OR u.mobile = ?`,
      [username, username]
    );

    console.log(`[DEBUG]: Found ${users[0].length} users matching ${username}`);
    if (users[0].length > 0) {
      console.log(`[DEBUG]: Matching User Found: ID=${users[0][0].id}, Name=${users[0][0].name}, Email=${users[0][0].email}`);
    }

    if (users[0].length === 0) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    const user = users[0][0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    if (user.status === 'Inactive') {
      return res.status(403).json({ success: false, message: "Account is inactive. Contact support." });
    }

    // Allow login for pending users but mark their status
    const isPendingApproval = user.status === 'Pending';

    // Generate token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role_code || user.role // fallback if role_id/role_code join failed
      },
      process.env.JWT_SECRET || "samypay_secret_key_2024",
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role_code || user.role
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// New function for sending OTP via email
exports.sendEmailOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  try {
    const users = await db.promise().query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (users[0].length === 0) {
      return res.status(404).json({ success: false, message: "User not found with this email" });
    }

    const userId = users[0][0].id;
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    await db.promise().query(
      "UPDATE users SET otp = ? WHERE id = ?",
      [otp, userId]
    );

    try {
      await transporter.sendMail({
        from: process.env.EMAIL || 'annavarapuajay58@gmail.com',
        to: email,
        subject: "SamyPay Email OTP",
        text: `Your OTP is ${otp}. Valid for 5 minutes.`,
      });

      console.log(`[OTP SUCCESS] Sent to ${email}`);
      res.json({ success: true, message: "OTP sent to email" });
    } catch (err) {
      console.warn(`[OTP MAIL FAILURE] Could not send to ${email}. Check .env EMAIL_USER/EMAIL_PASS/EMAIL_HOST/EMAIL_PORT.`);
      console.log(`[OTP DEBUG] The OTP for ${email} is: ${otp}`);

      // Still return 200 so the user can proceed in dev mode
      res.json({
        success: true, // Changed to true as per instruction
        message: "OTP generated (Check backend console if email not received)",
        mocked: true,
        otp: process.env.NODE_ENV === 'development' ? otp : undefined
      });
    }
  } catch (error) {
    console.error("Send Email OTP error:", error);
    res.status(500).json({ success: false, message: "Failed to send email OTP" });
  }
};

exports.sendOTP = async (req, res) => {
  const { mobile } = req.body;

  if (!mobile || !/^\d{10}$/.test(mobile)) {
    return res.status(400).json({ success: false, message: "Valid 10-digit mobile number is required" });
  }

  try {
    // In a real app, you would integrate with an SMS gateway here
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Save to DB
    await db.promise().query(
      "UPDATE users SET otp = ? WHERE mobile = ?",
      [otp, mobile]
    );

    console.log(`[OTP DEBUG] Sending OTP ${otp} to ${mobile}`);

    // Call OTP Service
    await otpService.sendOtp(mobile, otp);

    // Mock success response
    res.json({
      success: true,
      message: "OTP sent successfully (Check backend console for code)",
      otp: process.env.NODE_ENV === 'development' ? otp : undefined // Return OTP for dev testing
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

