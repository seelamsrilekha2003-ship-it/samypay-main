const db = require("./config/db");

async function listUsers() {
    try {
        const rows = await db.promise().query("SELECT id, name, email, mobile FROM users");
        console.log(`📊 Total Users: ${rows[0].length}`);
        if (rows[0].length > 0) {
            console.table(rows[0]);
        } else {
            console.log("✅ Database is empty (Users table).");
        }
    } catch (error) {
        console.error("❌ Error listing users:", error);
    }
}

listUsers();
