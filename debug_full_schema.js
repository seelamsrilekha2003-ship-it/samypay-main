const db = require('./config/db');

async function debugSchema() {
    try {
        const [tables] = await db.promise().query("SELECT name FROM sqlite_master WHERE type='table'");
        console.log("Tables in database:", tables.map(t => t.name).join(", "));

        for (const table of tables) {
            console.log(`\n--- Schema for table: ${table.name} ---`);
            const [columns] = await db.promise().query(`PRAGMA table_info(${table.name})`);
            console.log(columns.map(c => `${c.name} (${c.type})`).join(", "));
        }
        process.exit(0);
    } catch (e) {
        console.error("Error:", e);
        process.exit(1);
    }
}

debugSchema();
