const db = require("./config/db");
const bcrypt = require("bcryptjs");

async function testRegister() {
    try {
        console.log("Testing Registration...");
        const name = "Test User";
        const email = "test@example.com";
        const mobile = "1234567890";
        const password = "password123";

        // Check fetch
        console.log("Checking if user exists...");
        const existingUser = await db.promise().query(
            "SELECT * FROM users WHERE email = ? OR mobile = ?",
            [email, mobile]
        );
        console.log("Existing user check result:", JSON.stringify(existingUser));

        if (existingUser[0].length > 0) {
            console.log("User already exists, deleting for test...");
            await db.promise().query("DELETE FROM users WHERE email = ?", [email]);
        }

        console.log("Hashing password...");
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log("Inserting user...");
        const result = await db.promise().query(
            "INSERT INTO users (name, email, mobile, password, role, status, created_at) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)",
            [name, email, mobile, hashedPassword, 'Retailer', 'Active']
        );
        console.log("Insert Result:", result);

        // Check ID retrieval
        const inserted = result[0];
        console.log("Inserted Object Keys:", Object.keys(inserted));
        console.log("lastID:", inserted.lastID);
        console.log("lastInsertRowid:", inserted.lastInsertRowid);
        console.log("changes:", inserted.changes);

    } catch (error) {
        console.error("❌ TEST FAILED:", error);
    }
}

testRegister();
