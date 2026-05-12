const db = require('./config/db');

async function checkSchema() {
    try {
        console.log("Checking users table schema...");
        const columns = await db.promise().query("PRAGMA table_info(users)");
        console.log(JSON.stringify(columns[0], null, 2));
    } catch (e) {
        console.error("Error:", e);
    }
}

checkSchema();
