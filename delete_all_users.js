const db = require("./config/db");

async function clearUsers() {
    try {
        console.log("⚠️  Deleting all users from database...");
        await db.promise().query("DELETE FROM users");
        // Also reset auto-increment if supported (SQLite)
        await db.promise().query("DELETE FROM sqlite_sequence WHERE name='users'");
        console.log("✅ All users deleted successfully.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error deleting users:", error);
        process.exit(1);
    }
}

clearUsers();
