const db = require('./config/db');

async function checkFullSchema() {
    try {
        console.log("Checking users table schema...");
        const columns = await db.promise().query("PRAGMA table_info(users)");
        console.log("Columns found:", columns[0].map(c => c.name));

        const required = ['company_name', 'address', 'city', 'state', 'pincode', 'gst_no', 'preferences'];
        const existing = columns[0].map(c => c.name);

        const missing = required.filter(r => !existing.includes(r));

        if (missing.length > 0) {
            console.log("❌ MISSING COLUMNS:", missing);
        } else {
            console.log("✅ All required columns exist.");
        }
    } catch (e) {
        console.error("Error:", e);
    }
}

checkFullSchema();
