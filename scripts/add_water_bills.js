const db = require('../config/db');

// Create water_bills table
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS water_bills (
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
  INSERT INTO water_bills (consumer_number, operator, amount, consumer_name, bill_date, due_date)
  VALUES 
  ('1234567890', 'Delhi Jal Board', 350.50, 'VIKRAM SINGH', '2025-01-02', '2025-01-18'),
  ('0987654321', 'Bangalore Water Supply (BWSSB)', 590.00, 'ANJALI RAO', '2025-01-05', '2025-01-20'),
  ('1122112233', 'Chennai Metro Water', 210.00, 'KARTHIK SUBBARAJ', '2025-01-08', '2025-01-23')
`;

(async () => {
    try {
        await db.promise().query(createTableQuery);
        console.log("Details: water_bills table created.");

        const [rows] = await db.promise().query("SELECT count(*) as count FROM water_bills");
        if (rows[0].count === 0) {
            await db.promise().query(insertDataQuery);
            console.log("Details: Dummy water bills inserted.");
        } else {
            console.log("Details: Water bills already exist.");
        }

    } catch (err) {
        console.error("Error setup water bills:", err);
    }
})();
