const Database = require('better-sqlite3');
const db = new Database('./samypay.db');

try {
    // Check total count
    const count = db.prepare('SELECT COUNT(*) as count FROM roles').get();
    console.log("Total roles:", count.count);

    // List first 20 roles order by id ASC (likely original ones)
    const firstRoles = db.prepare('SELECT id, role_name, role_code, created_at FROM roles ORDER BY id ASC LIMIT 20').all();
    console.log("\n--- First 20 Roles ---");
    console.table(firstRoles);

    // List last 20 roles order by id DESC (likely the fake ones)
    const lastRoles = db.prepare('SELECT id, role_name, role_code, created_at FROM roles ORDER BY id DESC LIMIT 20').all();
    console.log("\n--- Last 20 Roles ---");
    console.table(lastRoles);

} catch (err) {
    console.error("Error:", err);
}
