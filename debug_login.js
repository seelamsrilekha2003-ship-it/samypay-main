const db = require('./config/db');
const bcrypt = require('bcryptjs');

async function debug() {
    try {
        console.log("--- SCHEMA CHECK: users ---");
        const columns = await db.promise().query("PRAGMA table_info(users)");
        console.log(JSON.stringify(columns[0], null, 2));

        console.log("\n--- USER CHECK: 8688948515 ---");
        const users = await db.promise().query("SELECT * FROM users WHERE mobile = '8688948515'");
        console.log(JSON.stringify(users[0], null, 2));

        if (users[0].length > 0) {
            const user = users[0][0];
            console.log("\n--- PASSWORD TEST ---");
            // Hardcoded test password if user knows it, or we can just check if hashed
            console.log("Has password hash:", !!user.password);

            // Test a common password if known, but let's just see if hashed
            if (user.password && user.password.startsWith('$2')) {
                console.log("Password seems to be correctly hashed with bcrypt.");
            } else {
                console.log("WARNING: Password does not look like a bcrypt hash!");
            }
        } else {
            console.log("\nNo user found with mobile 8688948515");
        }

        console.log("\n--- RECENT USERS ---");
        const recent = await db.promise().query("SELECT id, name, mobile, created_at FROM users ORDER BY created_at DESC LIMIT 5");
        console.log(JSON.stringify(recent[0], null, 2));

    } catch (err) {
        console.error("DEBUG ERROR:", err);
    }
}

debug();
