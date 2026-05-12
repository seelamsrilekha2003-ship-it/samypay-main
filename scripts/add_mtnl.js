const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "..", "samypay.db");
const db = new Database(dbPath);

console.log("=== Adding MTNL operator ===");

// Check if MTNL already exists
const existing = db.prepare("SELECT * FROM mobile_operators WHERE operator_code = 'MTNL'").get();

if (existing) {
    console.log("✅ MTNL already exists");
    console.log(existing);
} else {
    const insertStmt = db.prepare(`
    INSERT INTO mobile_operators (operator_name, operator_code, text, status)
    VALUES (?, ?, ?, 'Active')
  `);

    insertStmt.run("MTNL", "MTNL", "MTNL");
    console.log("✅ MTNL operator added");
}

// Show all operators
console.log("\n=== All Mobile Operators ===");
const allOps = db.prepare("SELECT * FROM mobile_operators ORDER BY id ASC").all();
console.table(allOps);

db.close();
