const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "..", "samypay.db");
const db = new Database(dbPath);

console.log("🔧 Migrating Electricity Bills...");

try {
    // Create table
    db.prepare(`
    CREATE TABLE IF NOT EXISTS electricity_bills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      consumer_number TEXT NOT NULL,
      biller_id TEXT, 
      consumer_name TEXT,
      amount DECIMAL(10,2),
      bill_date DATE,
      due_date DATE,
      status TEXT DEFAULT 'Unpaid',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

    // Insert Mock Data
    const insertBill = db.prepare(`
    INSERT INTO electricity_bills (consumer_number, biller_id, consumer_name, amount, bill_date, due_date, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

    const today = new Date().toISOString().split('T')[0];
    const dueDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // TNEB Bills
    insertBill.run('1234567890', 'TNEB', 'SAMPATH KUMAR', 450.50, today, dueDate, 'Unpaid');
    insertBill.run('1234567891', 'TNEB', 'ARUN KUMAR', 1250.00, today, dueDate, 'Unpaid');
    insertBill.run('1234567892', 'TNEB', 'PRIYA RAMESH', 890.75, today, dueDate, 'Unpaid');

    // BESCOM Bills
    insertBill.run('9876543210', 'BESCOM', 'VIJAY REDDY', 3400.00, today, dueDate, 'Unpaid');

    console.log("✅ Electricity bills migrated successfully");

} catch (err) {
    console.error("❌ Error migrating bills:", err);
} finally {
    db.close();
}
