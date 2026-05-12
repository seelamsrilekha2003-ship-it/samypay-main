const db = require("../config/db");

/* ================= BANK ================= */
exports.getBanks = (req, res) => {
    db.query("SELECT * FROM bank_details", (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
};

exports.addBank = (req, res) => {
    const { bank_name, account_number, ifsc, holder_name } = req.body;
    const sql = "INSERT INTO bank_details (bank_name, account_number, ifsc, holder_name) VALUES (?, ?, ?, ?)";
    db.query(sql, [bank_name, account_number, ifsc, holder_name], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true, message: "Bank added" });
    });
};

/* ================= NEWS ================= */
exports.getNews = (req, res) => {
    db.query("SELECT * FROM news ORDER BY created_at DESC", (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
};

exports.addNews = (req, res) => {
    const { message, type } = req.body;
    db.query("INSERT INTO news (message, type) VALUES (?, ?)", [message, type || 'INFO'], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true, message: "News added" });
    });
};

/* ================= BANNERS ================= */
exports.getBanners = (req, res) => {
    db.query("SELECT * FROM banners WHERE is_active=1", (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
};

/* ================= API SETTINGS (Unified with Providers) ================= */
// Now utilizing 'api_providers' table to ensure Routing Dropdowns and this list match.
exports.getApis = (req, res) => {
    db.query("SELECT * FROM api_providers ORDER BY id DESC", (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
};

exports.addApi = (req, res) => {
    const { name, base_url, api_key, api_username, status } = req.body;

    // Map fields: Frontend might send 'name', DB expects 'provider_name'
    const provider_name = name || req.body.provider_name;
    const api_link = base_url || req.body.api_link;
    const api_password = api_key || req.body.api_password;
    const username = api_username || req.body.api_username || '';
    const activeStatus = status || 'Active';

    db.query(
        "INSERT INTO api_providers (provider_name, api_link, api_username, api_password, status) VALUES (?, ?, ?, ?, ?)",
        [provider_name, api_link, username, api_password, activeStatus],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ success: true, message: "API Provider Added successfully", id: result.insertId });
        });
};

exports.updateApi = (req, res) => {
    const { name, base_url, api_key, api_username, status } = req.body;

    // Map fields
    const provider_name = name || req.body.provider_name;
    const api_link = base_url || req.body.api_link;
    const api_password = api_key || req.body.api_password;
    const username = api_username || req.body.api_username;

    let fields = [];
    let values = [];

    if (provider_name) { fields.push("provider_name=?"); values.push(provider_name); }
    if (api_link) { fields.push("api_link=?"); values.push(api_link); }
    if (api_password) { fields.push("api_password=?"); values.push(api_password); }
    if (username !== undefined) { fields.push("api_username=?"); values.push(username); }
    if (status) { fields.push("status=?"); values.push(status); }

    if (fields.length === 0) return res.json({ success: true, message: "Nothing to update" });

    values.push(req.params.id);
    const sql = `UPDATE api_providers SET ${fields.join(', ')} WHERE id=?`;

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true, message: "API Provider Updated Successfully" });
    });
};

exports.deleteApi = (req, res) => {
    const sql = "DELETE FROM api_providers WHERE id=?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true, message: "API Provider Deleted Successfully" });
    });
};

async function callWithFallback(serviceId, payload) {
  const routing = await getRoutingOrder(serviceId); // [1,4,7]

  for (const apiId of routing) {
    try {
      const api = await getApiConfig(apiId);
      const res = await axios.post(api.base_url, payload, {
        timeout: 8000
      });

      if (res.data.success) {
        return res.data; // ✅ SUCCESS
      }
    } catch (err) {
      console.log("API Failed:", apiId);
    }
  }

  throw new Error("All APIs failed");
}


/* ================= PLANWISE API ================= */
exports.getPlanwiseApis = (req, res) => {
    // Intelligent Join: Fetches Operator Name from the correct table based on service_type
    const sql = `
        SELECT p.*, 
               ap.provider_name,
               COALESCE(m.operator_name, d.operator_name, dc.operator_name, l.operator_name, 'Unknown Operator') as operator_name
        FROM planwise_api p
        LEFT JOIN mobile_operators m ON p.operator_id = m.id AND (p.service_type = 'PREPAID' OR p.service_type = 'MOBILE')
        LEFT JOIN dth_operators d ON p.operator_id = d.id AND p.service_type = 'DTH'
        LEFT JOIN datacard_operators dc ON p.operator_id = dc.id AND p.service_type = 'DATACARD'
        LEFT JOIN landline_operators l ON p.operator_id = l.id AND p.service_type = 'LANDLINE'
        LEFT JOIN api_providers ap ON p.api_id = ap.id
        ORDER BY p.id DESC
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.error("Get Planwise API SQL Error:", err.message);
            console.error("Query attempted:", sql);
            return res.status(500).json({ success: false, message: "Database Error: " + err.message });
        }
        res.json({ success: true, data: result });
    });
};

exports.addPlanwiseApi = (req, res) => {
    const { operator_id, circle_id, service_type, min_amount, max_amount, api_id, status } = req.body;

    // Check for required fields
    if (!operator_id || !api_id || !min_amount || !max_amount) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const sql = "INSERT INTO planwise_api (operator_id, circle_id, service_type, min_amount, max_amount, api_id, status) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [operator_id, circle_id || 0, service_type || 'PREPAID', min_amount, max_amount, api_id, status || 'Active'], (err, result) => {
        if (err) {
            console.error("Add Planwise API Error:", err);
            return res.status(500).json({ success: false, message: "Failed to add planwise API: " + err.message });
        }
        res.json({ success: true, message: "Planwise API configuration added" });
    });
};

exports.deletePlanwiseApi = (req, res) => {
    db.query("DELETE FROM planwise_api WHERE id = ?", [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: "Failed to delete" });
        res.json({ success: true, message: "Planwise API deleted successfully" });
    });
};

/* ================= MIGRATION ================= */
const { exec } = require('child_process');
const path = require('path');

exports.runMigration = (req, res) => {
    // Warning: This will reset the database!
    // if (req.user.role !== 'ADMIN' && req.user.role_id !== 1) {
    //     return res.status(403).json({ success: false, message: "Unauthorized: Admin Access Required" });
    // }
    console.log("⚠️  WARNING: Running database migration - this will reset all data!");

    const scriptPath = path.join(__dirname, '..', 'scripts', 'migrate_from_mysql_dump.js');

    console.log("Running migration script:", scriptPath);

    exec(`node "${scriptPath}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Migration error: ${error.message}`);
            return res.status(500).json({
                success: false,
                message: "Migration Script Failed",
                logs: [error.message, stderr]
            });
        }
        const logs = stdout.split('\n').filter(line => line.trim() !== '');
        res.json({ success: true, message: "Database Migration Completed Successfully", logs: logs });
    });
};

/* ================= GENERAL SETTINGS (SAMYPAY) ================= */
exports.getGeneralSettings = (req, res) => {
    // We expect only one row
    db.query("SELECT * FROM samypay_settings LIMIT 1", (err, result) => {
        if (err) return res.status(500).json(err);
        // If result is an array (from wrapper), handle it
        const data = Array.isArray(result) ? result[0] : result;
        res.json(data || {});
    });
};

exports.updateGeneralSettings = (req, res) => {
    const { site_name, logo_url, support_email, support_phone, address, copyright_text } = req.body;

    // Check if row exists, if not insert, else update
    const checkSql = "SELECT count(*) as count FROM samypay_settings";

    db.query(checkSql, (err, countRes) => {
        if (err) return res.status(500).json(err);

        const count = countRes[0] ? (countRes[0].count || 0) : 0;

        if (count === 0) {
            const insertSql = "INSERT INTO samypay_settings (site_name, logo_url, support_email, support_phone, address, copyright_text) VALUES (?, ?, ?, ?, ?, ?)";
            db.query(insertSql, [site_name, logo_url, support_email, support_phone, address, copyright_text], (err, r) => {
                if (err) return res.status(500).json(err);
                res.json({ success: true, message: "Settings created successfully" });
            });
        } else {
            const updateSql = `
                UPDATE samypay_settings 
                SET site_name=?, logo_url=?, support_email=?, support_phone=?, address=?, copyright_text=?, updated_at=CURRENT_TIMESTAMP
                WHERE id = (SELECT id FROM samypay_settings LIMIT 1)
            `;
            db.query(updateSql, [site_name, logo_url, support_email, support_phone, address, copyright_text], (err, r) => {
                if (err) return res.status(500).json(err);
                res.json({ success: true, message: "Settings updated successfully" });
            });
        }
    });
};
