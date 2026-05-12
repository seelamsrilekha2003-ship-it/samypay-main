const Database = require('better-sqlite3');
const path = require('path');

try {
    const dbPath = path.join(__dirname, 'samypay.db');
    const db = new Database(dbPath);

    console.log("--- ROLES ---");
    const roles = db.prepare("SELECT * FROM roles").all();
    console.log(JSON.stringify(roles, null, 2));

    console.log("\n--- USER 8688948515 ---");
    const user = db.prepare("SELECT * FROM users WHERE mobile = '8688948515'").get();
    console.log(JSON.stringify(user, null, 2));

} catch (e) {
    console.error("FAILED:", e.message);
}
