const express = require("express");
const router = express.Router();
const db = require("../config/db");

/* ===============================
   SERVICES
================================ */

// GET /api/services
router.get("/", (req, res) => {
    db.query(
        "SELECT * FROM services ORDER BY orderno ASC",
        [],
        (err, rows) => {
            if (err) {
                console.error("Error fetching services:", err);
                return res.status(500).json({ success: false, message: "Failed to fetch services" });
            }
            res.json({ success: true, data: rows });
        }
    );
});


/* ===============================
   PROVIDERS (SPECIFIC ROUTES FIRST)
================================ */

// GET providers list
router.get("/providers/list", (req, res) => {
    db.query("SELECT * FROM api_providers ORDER BY id ASC", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Failed to fetch providers" });
        }
        res.json({ success: true, data: rows });
    });
});

// ADD provider
router.post("/providers", (req, res) => {
    const { provider_name, api_link, api_username, api_password, status } = req.body;
    db.query(
        "INSERT INTO api_providers (provider_name, api_link, api_username, api_password, status) VALUES (?, ?, ?, ?, ?)",
        [provider_name, api_link, api_username, api_password, status || "Active"],
        (err, result) => {
            if (err) return res.status(500).json({ success: false, message: "Failed to add provider" });
            res.json({ success: true, message: "Provider added", id: result.insertId });
        }
    );
});

// UPDATE provider
router.put("/providers/:id", (req, res) => {
    const { provider_name, api_link, api_username, api_password, status } = req.body;
    db.query(
        `UPDATE api_providers SET 
         provider_name = COALESCE(?, provider_name),
         api_link = COALESCE(?, api_link),
         api_username = COALESCE(?, api_username),
         api_password = COALESCE(?, api_password),
         status = COALESCE(?, status)
         WHERE id = ?`,
        [provider_name, api_link, api_username, api_password, status, req.params.id],
        (err) => {
            if (err) return res.status(500).json({ success: false, message: "Failed to update provider" });
            res.json({ success: true, message: "Provider updated" });
        }
    );
});

// DELETE provider
router.delete("/providers/:id", (req, res) => {
    db.query("DELETE FROM api_providers WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ success: false, message: "Failed to delete provider" });
        res.json({ success: true, message: "Provider deleted" });
    });
});

/* =========================================================================================
   OPERATOR MANAGEMENT
   ========================================================================================= */

// GENERIC GET OPERATORS (Fallback/Safety) - MOVED UP TO CATCH ALL
router.get("/operators/:type", (req, res) => {
    const type = req.params.type.toLowerCase();

    let table = "";
    if (type === "mobile" || type === "prepaid") table = "mobile_operators";
    else if (type === "dth") table = "dth_operators";
    else if (type === "datacard") table = "datacard_operators";
    else if (type === "landline" || type === "postpaid") table = "landline_operators";
    else return res.status(400).json({ success: false, message: "Invalid type" });

    db.query(`SELECT * FROM ${table} ORDER BY id ASC`, [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: "Failed to fetch operators" });
        res.json({ success: true, data: rows });
    });
});


/* ===============================
   BILLERS
================================ */

router.get("/billers/list", (req, res) => {
    const { category } = req.query;
    let sql = "SELECT * FROM billers";
    let params = [];

    if (category) {
        sql += " WHERE category = ?";
        params.push(category);
    }

    sql += " ORDER BY biller_name ASC";

    db.query(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: "Failed to fetch billers" });
        res.json({ success: true, data: rows });
    });
});


/* ===============================
   SERVICE BY ID (KEEP LAST!)
================================ */

// ⚠️ MUST BE LAST – generic route
router.get("/:id", (req, res) => {
    db.query(
        "SELECT * FROM services WHERE id = ?",
        [req.params.id],
        (err, rows) => {
            if (err) return res.status(500).json({ success: false, message: "Failed to fetch service" });
            if (!rows.length) return res.status(404).json({ success: false, message: "Service not found" });
            res.json({ success: true, data: rows[0] });
        }
    );
});

module.exports = router;
