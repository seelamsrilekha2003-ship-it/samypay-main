const db = require("../config/db");

const createTable = `
CREATE TABLE IF NOT EXISTS planwise_api (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    operator_id INTEGER NOT NULL,
    circle_id INTEGER DEFAULT 0,
    service_type TEXT DEFAULT 'PREPAID',
    min_amount REAL NOT NULL,
    max_amount REAL NOT NULL,
    api_id INTEGER NOT NULL,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

db.query(createTable, (err, result) => {
    if (err) {
        console.error("Error creating planwise_api table:", err);
    } else {
        console.log("planwise_api table ready.");
    }
    process.exit();
});
