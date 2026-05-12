const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "samypay.db");
const db = new Database(dbPath);

console.log("🚀 Starting Database Migration...");

try {
    // 0. Create users table if not exists (Critical Base Table)
    db.exec(`
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
        );
    `);
    console.log("✅ Users table ensured");

    // 1. Ensure users table has all required columns
    const userColumns = db.prepare("PRAGMA table_info(users)").all();
    const columnNames = userColumns.map(c => c.name);

    const requiredUserCols = [
        { name: 'role', type: "VARCHAR(20) DEFAULT 'Retailer'" },
        { name: 'status', type: "VARCHAR(20) DEFAULT 'Active'" },
        { name: 'wallet_balance', type: "DECIMAL(10, 2) DEFAULT 0.00" },
        { name: 'company_name', type: 'VARCHAR(100)' },
        { name: 'address', type: 'TEXT' },
        { name: 'city', type: 'VARCHAR(50)' },
        { name: 'state', type: 'VARCHAR(50)' },
        { name: 'pincode', type: 'VARCHAR(10)' },
        { name: 'gst_no', type: 'VARCHAR(20)' },
        { name: 'preferences', type: 'TEXT' },
        { name: 'otp', type: 'VARCHAR(10)' }
    ];

    requiredUserCols.forEach(col => {
        if (!columnNames.includes(col.name)) {
            console.log(`➕ Adding column ${col.name} to users table...`);
            db.exec(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type}`);
        }
    });

    // 2. Create planwise_api table if it doesn't exist
    db.exec(`
        CREATE TABLE IF NOT EXISTS planwise_api (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            operator_id INTEGER,
            circle_id INTEGER DEFAULT 0,
            service_type VARCHAR(20) DEFAULT 'PREPAID',
            min_amount DECIMAL(10, 2),
            max_amount DECIMAL(10, 2),
            api_id INTEGER,
            status VARCHAR(20) DEFAULT 'Active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
    console.log("✅ planwise_api table verified");

    // 3. Ensure other essential tables exist (if missed in basic setup)
    db.exec(`
        CREATE TABLE IF NOT EXISTS api_providers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            provider_name VARCHAR(100) NOT NULL,
            api_link TEXT,
            api_username VARCHAR(100),
            api_password VARCHAR(100),
            status VARCHAR(20) DEFAULT 'Active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

    db.exec(`
        CREATE TABLE IF NOT EXISTS services (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            service_name VARCHAR(100) NOT NULL,
            service_code VARCHAR(50),
            service_type VARCHAR(50),
            icon VARCHAR(50),
            tn_api INTEGER DEFAULT 0,
            kl_api INTEGER DEFAULT 0,
            other_api INTEGER DEFAULT 0,
            status VARCHAR(20) DEFAULT 'Active',
            orderno INTEGER DEFAULT 0
        );
    `);

    const operatorTables = ['mobile_operators', 'dth_operators', 'datacard_operators', 'landline_operators'];
    operatorTables.forEach(table => {
        try {
            const cols = db.prepare(`PRAGMA table_info(${table})`).all();
            if (!cols.map(c => c.name).includes('status')) {
                console.log(`➕ Adding status column to ${table}...`);
                db.exec(`ALTER TABLE ${table} ADD COLUMN status VARCHAR(20) DEFAULT 'Active'`);
            }
        } catch (e) {
            console.log(`⚠️ Table ${table} not found, skipping status column addition.`);
        }
    });

    // 4. Ensure transactions table has all required columns for Reports
    try {
        db.exec(`
            CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                transaction_type VARCHAR(50),
                service_type VARCHAR(50),
                operator_name VARCHAR(100),
                account_number VARCHAR(100),
                amount DECIMAL(10, 2) NOT NULL,
                status VARCHAR(20) DEFAULT 'PENDING',
                reference_id VARCHAR(100) UNIQUE,
                description TEXT,
                opening_balance DECIMAL(10, 2),
                closing_balance DECIMAL(10, 2),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        const txnCols = db.prepare("PRAGMA table_info(transactions)").all();
        const txnColumnNames = txnCols.map(c => c.name);

        const requiredTxnCols = [
            { name: 'transaction_type', type: 'VARCHAR(50)' },
            { name: 'service_type', type: 'VARCHAR(50)' },
            { name: 'operator_name', type: 'VARCHAR(100)' },
            { name: 'account_number', type: 'VARCHAR(100)' },
            { name: 'operator_ref_id', type: 'VARCHAR(100)' },
            { name: 'commission_amount', type: 'DECIMAL(10, 2) DEFAULT 0' }
        ];

        requiredTxnCols.forEach(col => {
            if (!txnColumnNames.includes(col.name)) {
                console.log(`➕ Adding column ${col.name} to transactions table...`);
                db.exec(`ALTER TABLE transactions ADD COLUMN ${col.name} ${col.type}`);
            }
        });
        console.log("✅ Transactions table verified");
    } catch (e) {
        console.log(`⚠️ Error verified transactions table: ${e.message}`);
    }

    // 5. Run User Roles Migration (Critical for Auth)
    try {
        console.log("🔄 Running User Roles Migration...");
        require("./scripts/migrate_user_roles");
    } catch (e) {
        console.error("⚠️ User Roles Migration Warning:", e.message);
    }

    console.log("🎉 Migration completed successfully!");

} catch (err) {
    console.error("❌ Migration failed:", err.message);
} finally {
    db.close();
}
