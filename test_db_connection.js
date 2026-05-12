const fs = require('fs');
const db = require('./config/db');

async function test() {
    const logVal = (msg) => {
        console.log(msg);
        fs.appendFileSync('db_test_log.txt', msg + '\n');
    };

    try {
        logVal("Starting DB Test...");

        // 1. Check if table users exists
        const checkTable = await db.promise().query("SELECT name FROM sqlite_master WHERE type='table' AND name='users'");
        logVal("Table Check Result: " + JSON.stringify(checkTable));

        if (checkTable[0].length === 0) {
            logVal("❌ Users table does not exist!");
        } else {
            logVal("✅ Users table exists.");
        }

        // 2. Try simple select
        const users = await db.promise().query("SELECT count(*) as count FROM users");
        logVal("User count: " + JSON.stringify(users));

    } catch (e) {
        logVal("❌ Error: " + e.message);
    }
}

test();
