const Database = require('better-sqlite3');
const db = new Database('./samypay.db');

try {
    // Find roles currently in use
    const inUseRoles = db.prepare('SELECT DISTINCT role_id FROM users WHERE role_id IS NOT NULL').all().map(r => r.role_id);

    // Find minimum ID for each role_name (the "original")
    const originalRoles = db.prepare('SELECT MIN(id) as id, role_name FROM roles GROUP BY role_name').all().map(r => r.id);

    const safeIds = [...new Set([...inUseRoles, ...originalRoles])];

    console.log("Safe IDs to keep:", safeIds.sort((a, b) => a - b));

    // Delete all roles not in safeIds
    const beforeCount = db.prepare('SELECT COUNT(*) as count FROM roles').get().count;
    console.log("Roles before cleanup:", beforeCount);

    const placeholders = safeIds.map(() => '?').join(',');
    const info = db.prepare(`DELETE FROM roles WHERE id NOT IN (${placeholders})`).run(...safeIds);

    console.log(`Deleted ${info.changes} duplicate roles.`);

    const afterCount = db.prepare('SELECT COUNT(*) as count FROM roles').get().count;
    console.log("Roles after cleanup:", afterCount);

    // Show remaining roles
    const remaining = db.prepare('SELECT id, role_name, role_code FROM roles ORDER BY id ASC').all();
    console.table(remaining);

} catch (err) {
    console.error("Cleanup Error:", err);
}
