const db = require("./config/db");

async function forceCleanup() {
    console.log("🔥 Starting Force Cleanup...");

    try {
        // 1. Check current count
        const preCount = await db.promise().query("SELECT COUNT(*) as count FROM users");
        console.log(`📊 Users before cleanup: ${preCount[0][0].count}`);

        // 2. Delete All Users
        console.log("⚠️  Deleting all users...");
        await db.promise().query("DELETE FROM users");

        // 3. Reset Auto Increment
        try {
            await db.promise().query("DELETE FROM sqlite_sequence WHERE name='users'");
            console.log("🔄 Auto-increment reset.");
        } catch (e) {
            console.log("ℹ️  (Auto-increment reset skipped or not needed)");
        }

        // 4. Verify deletion
        const postCount = await db.promise().query("SELECT COUNT(*) as count FROM users");
        const finalCount = postCount[0][0].count;
        console.log(`📊 Users after cleanup: ${finalCount}`);

        if (finalCount === 0) {
            console.log("✅ SUCCESS: All users have been permanently deleted.");
            process.exit(0);
        } else {
            console.error("❌ FAILED: Users still exist in database!");
            process.exit(1);
        }

    } catch (error) {
        console.error("❌ CRITICAL ERROR:", error);
        process.exit(1);
    }
}

forceCleanup();
