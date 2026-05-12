const db = require("./config/db");

async function checkUsers() {
    try {
        const rows = await db.promise().query("PRAGMA table_info(users)");
        console.log("Users Table Info:", rows[0]);
    } catch (err) {
        console.error("Error:", err);
    }
}

checkUsers();
