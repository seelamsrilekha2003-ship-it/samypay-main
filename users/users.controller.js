const db = require("../config/db");
const bcrypt = require("bcryptjs");

exports.getProfile = (req, res) => {
  const sql = `
    SELECT u.id, u.name, u.mobile, u.email, u.wallet_balance, u.company_name, u.address, u.city, u.state, u.pincode, u.gst_no, u.preferences, u.role as role_name
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    WHERE u.id = ?
  `;

  db.query(sql, [req.user.id], (err, result) => {
    if (err) {
      console.error("Get Profile Error:", err);
      return res.status(500).json({ success: false, message: "Database Error" });
    }
    if (result.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const user = result[0];
    if (user.preferences) {
      try {
        user.preferences = JSON.parse(user.preferences);
      } catch (e) {
        user.preferences = {};
      }
    } else {
      user.preferences = {};
    }

    res.json({ success: true, data: user });
  });
};

exports.updateProfile = async (req, res) => {
  const { name, email, mobile, company_name, address, city, state, pincode, gst_no, preferences } = req.body;
  const preferencesStr = preferences ? JSON.stringify(preferences) : JSON.stringify({});

  try {
    // Check if email/mobile is being changed and if it conflicts with another user
    if (email || mobile) {
      const checkSql = `SELECT id FROM users WHERE (email = ? OR mobile = ?) AND id != ?`;
      const conflicts = await db.promise().query(checkSql, [email, mobile, req.user.id]);

      if (conflicts[0].length > 0) {
        return res.status(400).json({
          success: false,
          message: "Email or Mobile number already in use by another account."
        });
      }
    }

    const sql = `
      UPDATE users 
      SET name = ?, email = ?, mobile = ?, company_name = ?, address = ?, city = ?, state = ?, pincode = ?, gst_no = ?, preferences = ?
      WHERE id = ?
    `;

    const params = [
      name || null,
      email || null,
      mobile || null,
      company_name || null,
      address || null,
      city || null,
      state || null,
      pincode || null,
      gst_no || null,
      preferencesStr,
      req.user.id
    ];

    db.query(sql, params, (err, result) => {
      if (err) {
        console.error("Update Profile Error:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to update profile: " + err.message
        });
      }
      res.json({ success: true, message: "Profile updated successfully" });
    });
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update profile: " + err.message
    });
  }
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    // Get current password hash
    const rows = await db.promise().query("SELECT password FROM users WHERE id = ?", [req.user.id]);
    if (rows[0].length === 0) return res.status(404).json({ success: false, message: "User not found" });

    const match = await bcrypt.compare(currentPassword, rows[0][0].password);
    if (!match) {
      return res.status(400).json({ success: false, message: "Incorrect current password" });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    await db.promise().query("UPDATE users SET password = ? WHERE id = ?", [hash, req.user.id]);

    res.json({ success: true, message: "Password changed successfully" });

  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getAllUsers = (req, res) => {
  const sql = `
    SELECT u.*, r.role_name, r.role_code
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    ORDER BY u.created_at DESC
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);

    // Parse preferences
    const users = result.map(u => {
      try {
        u.preferences = u.preferences ? JSON.parse(u.preferences) : {};
      } catch (e) {
        u.preferences = {};
      }
      return u;
    });

    res.json({ success: true, data: users });
  });
};

exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const updates = req.body; // { status: 'Active', is_otp: true, ... }

  try {
    // Get current user data to merge preferences
    const [rows] = await db.promise().query("SELECT * FROM users WHERE id = ?", [userId]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: "User not found" });

    const user = rows[0];
    let preferences = {};
    try {
      preferences = user.preferences ? JSON.parse(user.preferences) : {};
    } catch (e) { }

    // Handle updates
    const coreFields = ['name', 'mobile', 'email', 'status', 'role_id', 'wallet_balance'];
    const sqlUpdates = [];
    const params = [];

    // Separate core fields vs preferences
    Object.keys(updates).forEach(key => {
      if (coreFields.includes(key)) {
        sqlUpdates.push(`${key} = ?`);
        params.push(updates[key]);
      } else {
        // Assume it's a preference
        preferences[key] = updates[key];
      }
    });

    // Update preferences string
    sqlUpdates.push(`preferences = ?`);
    params.push(JSON.stringify(preferences));

    params.push(userId);

    const updateSql = `UPDATE users SET ${sqlUpdates.join(', ')} WHERE id = ?`;

    await db.promise().query(updateSql, params);

    res.json({ success: true, message: "User updated successfully" });

  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ success: false, message: "Failed to update user" });
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    await db.promise().query("DELETE FROM users WHERE id = ?", [userId]);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
};

exports.resetUserPassword = async (req, res) => {
  const userId = req.params.id;
  const { newPassword } = req.body;

  if (!newPassword) return res.status(400).json({ success: false, message: "New password is required" });

  try {
    const hash = await bcrypt.hash(newPassword, 10);
    await db.promise().query("UPDATE users SET password = ? WHERE id = ?", [hash, userId]);
    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ success: false, message: "Failed to reset password" });
  }
};

exports.resetUserPin = async (req, res) => {
  const userId = req.params.id;
  const { newPin } = req.body;

  if (!newPin) return res.status(400).json({ success: false, message: "New PIN is required" });

  try {
    // Get current preferences
    const [rows] = await db.promise().query("SELECT preferences FROM users WHERE id = ?", [userId]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: "User not found" });

    let preferences = {};
    try {
      preferences = rows[0].preferences ? JSON.parse(rows[0].preferences) : {};
    } catch (e) { }

    preferences.pin = newPin;

    await db.promise().query("UPDATE users SET preferences = ? WHERE id = ?", [JSON.stringify(preferences), userId]);
    res.json({ success: true, message: "PIN reset successfully" });
  } catch (error) {
    console.error("Reset PIN Error:", error);
    res.status(500).json({ success: false, message: "Failed to reset PIN" });
  }
};
