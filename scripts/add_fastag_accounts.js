const db = require('../config/db');

// Create fastag_accounts table
// Note: FASTag is usually wallet topup, but we can store "Balance" or just Valid Vehicle numbers.
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS fastag_accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_number TEXT NOT NULL,
    bank_name TEXT NOT NULL,
    customer_name TEXT,
    min_amount Decimal(10,2) DEFAULT 100.00,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

// Insert dummy data
const insertDataQuery = `
  INSERT INTO fastag_accounts (vehicle_number, bank_name, customer_name)
  VALUES 
  ('MH02AB1234', 'Paytm Payments Bank FASTag', 'ROHIT SHARMA'),
  ('KA05XY9876', 'ICICI Bank FASTag', 'VIRAT KOHLI'),
  ('TN01ZZ1111', 'HDFC Bank FASTag', 'MS DHONI')
`;

(async () => {
    try {
        await db.promise().query(createTableQuery);
        console.log("Details: fastag_accounts table created.");

        const [rows] = await db.promise().query("SELECT count(*) as count FROM fastag_accounts");
        if (rows[0].count === 0) {
            await db.promise().query(insertDataQuery);
            console.log("Details: Dummy fastag accounts inserted.");
        } else {
            console.log("Details: Fastag accounts already exist.");
        }

    } catch (err) {
        console.error("Error setup fastag accounts:", err);
    }
})();
