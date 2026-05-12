const Database = require('better-sqlite3');
const path = require('path');

try {
    const dbPath = path.join(__dirname, 'samypay.db');
    console.log("DB PATH:", dbPath);
    const db = new Database(dbPath);
    const info = db.prepare("PRAGMA table_info(users)").all();
    console.log("SCHEMA:", JSON.stringify(info, null, 2));

    const count = db.prepare("SELECT COUNT(*) as count FROM users").get();
    console.log("TOTAL USERS:", count.count);

    const lastUser = db.prepare("SELECT * FROM users ORDER BY created_at DESC LIMIT 1").get();
    console.log("LAST USER:", JSON.stringify(lastUser, null, 2));

} catch (e) {
    console.error("FAILED:", e.message);
}
