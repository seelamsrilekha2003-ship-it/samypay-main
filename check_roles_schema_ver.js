const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'samypay.db');
const db = new Database(dbPath);

console.log("Checking columns in 'roles' table...");
try {
    const columns = db.pragma("table_info(roles)");
    console.log(columns.map(c => c.name).join(", "));

    const requiredColumns = [
        'role_name', 'role_code', 'description', 'can_add_users', 'is_active', 'created_at', 'updated_at'
    ];

    const missing = requiredColumns.filter(req => !columns.some(c => c.name === req));

    if (missing.length > 0) {
        console.error("Missing columns:", missing);
    } else {
        console.log("All critical columns present.");
    }

} catch (err) {
    console.error("Error:", err.message);
} finally {
    db.close();
}
