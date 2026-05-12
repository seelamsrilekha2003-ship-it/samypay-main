const db = require('../config/db');

// Create datacard_operators table
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS datacard_operators (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    value TEXT NOT NULL,
    status TEXT DEFAULT 'Active'
  )
`;

// Insert dummy data
const insertDataQuery = `
  INSERT INTO datacard_operators (text, value)
  VALUES 
  ('Airtel Data Card', 'AIRTEL_DC'),
  ('JioFi Result', 'JIO_DC'),
  ('Vi Data Card', 'VI_DC'),
  ('BSNL Data Card', 'BSNL_DC')
`;

(async () => {
    try {
        await db.promise().query(createTableQuery);
        console.log("Details: datacard_operators table created.");

        const [rows] = await db.promise().query("SELECT count(*) as count FROM datacard_operators");
        if (rows[0].count === 0) {
            await db.promise().query(insertDataQuery);
            console.log("Details: Dummy datacard operators inserted.");
        } else {
            console.log("Details: Datacard operators already exist.");
        }

    } catch (err) {
        console.error("Error setup datacard operators:", err);
    }
})();
