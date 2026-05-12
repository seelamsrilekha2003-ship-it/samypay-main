const Database = require('better-sqlite3');
const db = new Database('./samypay.db');

try {
    const userRoles = db.prepare('SELECT role_id, COUNT(*) as count FROM users GROUP BY role_id').all();
    console.log("Users per role_id:");
    console.table(userRoles);
} catch (err) {
    console.error("Error:", err);
}
