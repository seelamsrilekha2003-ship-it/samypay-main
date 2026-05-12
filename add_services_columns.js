const db = require("./config/db");

const queries = [
  "ALTER TABLE services ADD COLUMN tn_allowed TEXT",
  "ALTER TABLE services ADD COLUMN kl_allowed TEXT",
  "ALTER TABLE services ADD COLUMN other_allowed TEXT",
  "ALTER TABLE services ADD COLUMN validate_api INTEGER DEFAULT 0",
  "ALTER TABLE services ADD COLUMN roffer_api INTEGER DEFAULT 0",
  "ALTER TABLE services ADD COLUMN plans_api INTEGER DEFAULT 0",
  "ALTER TABLE services ADD COLUMN bill_fetch TEXT DEFAULT 'Inactive'"
];

queries.forEach(sql => {
  db.query(sql, err => {
    if (err) {
      if (err.message.includes("duplicate")) {
        console.log("Column already exists, skipping");
      } else {
        console.error("Error:", err.message);
      }
    } else {
      console.log("Executed:", sql);
    }
  });
});
