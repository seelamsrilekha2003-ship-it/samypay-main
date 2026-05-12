const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "..", "samypay.db");
const db = new Database(dbPath);

console.log("🔄 Updating all user statuses to Active...");

try {
    // Update all users to Active status
    const result = db.prepare("UPDATE users SET status = 'Active'").run();

    console.log(`✅ Updated ${result.changes} users to Active status`);

    // Show current users
    const users = db.prepare("SELECT id, name, email, mobile, status FROM users").all();
    console.log("\n📋 Current Users:");
    users.forEach(user => {
        console.log(`  - ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Status: ${user.status}`);
    });

} catch (error) {
    console.error("❌ Error:", error.message);
} finally {
    db.close();
}
