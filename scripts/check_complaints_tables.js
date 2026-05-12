const db = require("../config/db");

const checkTables = async () => {
    console.log("Checking for Complaints tables...");

    db.query("SELECT name FROM sqlite_master WHERE type='table' AND name='complaints'", [], (err, res) => {
        if (err) console.error("Error checking complaints:", err);
        else {
            if (res && res.length > 0) console.log("✅ Table 'complaints' EXISTS.");
            else console.log("❌ Table 'complaints' DOES NOT EXIST.");
        }
    });

    db.query("SELECT name FROM sqlite_master WHERE type='table' AND name='complaint_comments'", [], (err, res) => {
        if (err) console.error("Error checking comments:", err);
        else {
            if (res && res.length > 0) console.log("✅ Table 'complaint_comments' EXISTS.");
            else console.log("❌ Table 'complaint_comments' DOES NOT EXIST.");
        }
    });
};

setTimeout(checkTables, 1000);
