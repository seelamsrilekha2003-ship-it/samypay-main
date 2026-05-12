const db = require('../config/db');

// Create landline_bills table
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS landline_bills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    consumer_number TEXT NOT NULL,
    operator TEXT,
    amount DECIMAL(10,2) NOT NULL,
    consumer_name TEXT,
    bill_date DATETIME,
    due_date DATETIME,
    status TEXT DEFAULT 'UNPAID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

// Insert dummy data
const insertDataQuery = `
  INSERT INTO landline_bills (consumer_number, operator, amount, consumer_name, bill_date, due_date)
  VALUES 
  ('04412345678', 'Airtel Landline', 499.00, 'KISHORE KUMAR', '2025-01-05', '2025-01-20'),
  ('08087654321', 'BSNL Landline - Individual', 250.00, 'LAKSHMI MENON', '2025-01-08', '2025-01-23'),
  ('01122334455', 'MTNL Delhi', 750.00, 'RAJESH GUPTA', '2025-01-10', '2025-01-25')
`;

(async () => {
    try {
        await db.promise().query(createTableQuery);
        console.log("Details: landline_bills table created.");

        const [rows] = await db.promise().query("SELECT count(*) as count FROM landline_bills");
        if (rows && rows.length > 0 && rows[0].count === 0) {
            await db.promise().query(insertDataQuery);
            console.log("Details: Dummy landline bills inserted.");
        } else {
            console.log("Details: Landline bills already exist.");
        }

    } catch (err) {
        console.error("Error setup landline bills:", err);
    }
})();
