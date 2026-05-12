const db = require("./config/db");

async function setupUsersTable() {
    try {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                mobile VARCHAR(15) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(20) DEFAULT 'Retailer',
                status VARCHAR(20) DEFAULT 'Active',
                wallet_balance DECIMAL(10, 2) DEFAULT 0.00,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        await db.promise().query(createTableQuery);
        console.log("✅ Users table ensured.");

    } catch (error) {
        console.error("❌ Error setting up users table:", error);
    }
}

setupUsersTable();
