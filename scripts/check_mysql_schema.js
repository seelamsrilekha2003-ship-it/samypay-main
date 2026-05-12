const mysql = require("mysql2/promise");

async function checkSchema() {
    try {
        const connection = await mysql.createConnection({
            host: "127.0.0.1",
            user: "root",
            password: "sai@123",
            database: "samypay_rc"
        });

        console.log("✅ Connected to MySQL database: samypay_rc");

        const [tables] = await connection.query("SHOW TABLES");
        console.log("📋 Tables in samypay_rc:");

        for (let row of tables) {
            const tableName = Object.values(row)[0];
            console.log(`- ${tableName}`);

            // Optional: Get Column Info for critical tables
            if (['users', 'recharges', 'transactions', 'wallet', 'wallets'].includes(tableName)) {
                const [cols] = await connection.query(`DESCRIBE ${tableName}`);
                console.log(`  Columns: ${cols.map(c => c.Field).join(', ')}`);
            }
        }

        await connection.end();

    } catch (err) {
        console.error("❌ Failed to connect to MySQL samypay_rc:", err.message);
    }
}

checkSchema();
