const db = require("./config/db");

const sql = `
CREATE TABLE IF NOT EXISTS service_routing (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  service_id INTEGER,
  circle TEXT,
  api_id INTEGER,
  priority INTEGER,
  status TEXT DEFAULT 'Active'
);
`;

db.query(sql, (err) => {
  if (err) {
    console.error("❌ Error creating service_routing table:", err.message);
  } else {
    console.log("✅ service_routing table created successfully");
  }
});
