const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '..', 'samypay.db');
const db = new Database(dbPath);

const tables = ['planwise_api', 'mobile_operators', 'dth_operators', 'datacard_operators', 'landline_operators', 'api_providers'];

tables.forEach(table => {
    try {
        const info = db.pragma(`table_info(${table})`);
        console.log(`\nTable: ${table}`);
        console.log(JSON.stringify(info, null, 2));
    } catch (e) {
        console.error(`Error reading table ${table}:`, e.message);
    }
});
