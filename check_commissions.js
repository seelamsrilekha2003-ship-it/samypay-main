const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'samypay.db'));

// Check full column list
const cols = db.prepare("PRAGMA table_info(commissions)").all();
console.log('All columns:', cols.map(c => c.name).join(', '));

// Sample rows
const rows = db.prepare("SELECT * FROM commissions LIMIT 5").all();
console.log('Sample rows:');
rows.forEach(r => console.log(JSON.stringify(r)));

db.close();
