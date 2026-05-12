const db = require("../config/db");

const createTableQuery = `
CREATE TABLE IF NOT EXISTS fund_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    bank_name TEXT NOT NULL,
    payment_mode TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TEXT NOT NULL,
    reference_no TEXT,
    remarks TEXT,
    proof_image TEXT,
    status TEXT DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
)
`;

console.log("Creating 'fund_requests' table...");

db.query(createTableQuery, (err, result) => {
    if (err) {
        console.error("❌ Error creating table:", err);
    } else {
        console.log("✅ 'fund_requests' table created successfully (or already exists).");
    }
});
