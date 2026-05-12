const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'samypay.db');
if (!fs.existsSync(dbPath)) {
    console.log("DB NOT FOUND at", dbPath);
    process.exit(1);
}

try {
    const db = new Database(dbPath);
    const user = db.prepare("SELECT id, name, email, mobile, password, role, role_id FROM users WHERE mobile = '8688948515'").get();
    if (user) {
        console.log("USER FOUND:", JSON.stringify(user, null, 2));
    } else {
        console.log("USER NOT FOUND");
    }
} catch (e) {
    console.error("ERROR:", e.message);
}
