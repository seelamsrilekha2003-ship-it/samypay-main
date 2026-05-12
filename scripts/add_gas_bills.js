const db = require('../config/db');

// Create gas_bills table
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS gas_bills (
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
  INSERT INTO gas_bills (consumer_number, operator, amount, consumer_name, bill_date, due_date)
  VALUES 
  ('1122334455', 'Indane Gas', 950.00, 'RAHUL SHARMA', '2025-01-10', '2025-01-25'),
  ('5566778899', 'HP Gas', 1050.50, 'PRIYA VERMA', '2025-01-12', '2025-01-28'),
  ('9988776655', 'Bharat Gas', 875.00, 'AMIT PATEL', '2025-01-15', '2025-01-30')
`;

(async () => {
    try {
        // Execute creation
        await db.promise().query(createTableQuery);
        console.log("Details: gas_bills table created.");

        // Check if data exists
        const [rows] = await db.promise().query("SELECT count(*) as count FROM gas_bills");
        // dbWrapper returns [rows] array
        if (rows && rows.length > 0 && rows[0].count === 0) {
            await db.promise().query(insertDataQuery);
            console.log("Details: Dummy gas bills inserted.");
        } else {
            console.log("Details: Gas bills already exist or error checking.");
        }

    } catch (err) {
        console.error("Error setup gas bills:", err);
    }
})();
