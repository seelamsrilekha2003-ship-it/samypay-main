const db = require('../config/db');

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS samypay_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    site_name TEXT DEFAULT 'SamyPay',
    logo_url TEXT DEFAULT '',
    support_email TEXT DEFAULT 'support@samypay.com',
    support_phone TEXT DEFAULT '',
    address TEXT DEFAULT '',
    copyright_text TEXT DEFAULT '© 2024 SamyPay. All rights reserved.',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

const seedDataQuery = `
  INSERT INTO samypay_settings (site_name, support_email, copyright_text)
  SELECT 'SamyPay', 'support@samypay.com', '© 2024 SamyPay. All rights reserved.'
  WHERE NOT EXISTS (SELECT 1 FROM samypay_settings)
`;

console.log("Creating samypay_settings table...");

db.query(createTableQuery, (err, result) => {
    if (err) {
        console.error("Error creating table:", err.message);
        process.exit(1);
    } else {
        console.log("Table 'samypay_settings' created or already exists.");

        db.query(seedDataQuery, (err, result) => {
            if (err) {
                console.error("Error seeding data:", err.message);
                process.exit(1);
            } else {
                console.log("Default settings inserted if not present.");
                process.exit(0);
            }
        });
    }
});
