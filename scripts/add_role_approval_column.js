const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "..", "samypay.db");
const db = new Database(dbPath);

console.log("🚀 Adding role_approval_required column to roles table...");

try {
    const roleCols = db.prepare("PRAGMA table_info(roles)").all();
    const roleColNames = roleCols.map(c => c.name);

    if (!roleColNames.includes('role_approval_required')) {
        console.log("➕ Adding role_approval_required column...");
        db.exec("ALTER TABLE roles ADD COLUMN role_approval_required BOOLEAN DEFAULT 0;");
        console.log("✅ Column added successfully.");
    } else {
        console.log("ℹ️ Column role_approval_required already exists.");
    }

    // Set defaults for specific roles
    console.log("🔄 Updating default values for roles...");
    const updateRole = db.prepare("UPDATE roles SET role_approval_required = ? WHERE role_code = ?");

    // Distributor and Master Distributor usually require approval
    updateRole.run(1, 'DISTRIBUTOR');
    updateRole.run(1, 'MASTER');

    console.log("✅ Default values updated (DISTRIBUTOR, MASTER set to require approval).");

} catch (err) {
    console.error("❌ Error updating roles table:", err.message);
} finally {
    db.close();
}
