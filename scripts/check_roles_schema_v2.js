const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "..", "samypay.db");
const db = new Database(dbPath);

console.log("--- Roles Table Schema ---");
try {
    const schema = db.prepare("PRAGMA table_info(roles)").all();
    console.table(schema);
} catch (e) {
    console.log(e);
}
