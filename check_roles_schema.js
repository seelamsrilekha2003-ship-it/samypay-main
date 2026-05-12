const db = require("./config/db.sqlite");

async function checkSchema() {
    try {
        const [columns] = await db.promise().query("PRAGMA table_info(roles)");
        console.log("Roles table columns:");
        columns.forEach(col => console.log(`- ${col.name} (${col.type})`));
    } catch (err) {
        console.error("Error checking schema:", err);
    }
}

checkSchema();
