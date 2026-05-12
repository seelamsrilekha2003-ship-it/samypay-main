const Database = require("better-sqlite3");
const path = require("path");
const bcrypt = require("bcryptjs");

const dbPath = path.join(__dirname, "samypay.db");
const db = new Database(dbPath);

async function verify() {
    try {
        console.log("--- Verifying User-Role Mapping ---");
        const user = db.prepare(`
            SELECT u.name, u.email, u.role_id, r.role_name, r.role_code 
            FROM users u 
            LEFT JOIN roles r ON u.role_id = r.id 
            WHERE u.email = 'demo@samypay.com'
        `).get();

        if (user) {
            console.log("User Found:", user);
        } else {
            console.log("Admin user 'demo@samypay.com' not found. Checking any user...");
            const anyUser = db.prepare(`
                SELECT u.name, u.email, u.role_id, r.role_name, r.role_code 
                FROM users u 
                LEFT JOIN roles r ON u.role_id = r.id 
                LIMIT 1
            `).get();
            console.log("Any User Found:", anyUser);
        }

        console.log("\n--- Verifying Roles Table ---");
        const roles = db.prepare("SELECT * FROM roles").all();
        console.table(roles);

    } catch (e) {
        console.error("Verification failed:", e);
    } finally {
        db.close();
    }
}

verify();
