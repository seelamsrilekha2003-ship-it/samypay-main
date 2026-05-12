const db = require("./config/db.sqlite");

async function verifyRoles() {
    try {
        const [rows] = await db.promise().query("SELECT role_name, role_code, role_approval_required FROM roles");
        console.log("Current Roles and Approval Status:");
        rows.forEach(row => {
            console.log(`- ${row.role_name} (${row.role_code}): Approval Required = ${row.role_approval_required}`);
        });
    } catch (err) {
        console.error("Error verifying roles:", err);
    }
}

verifyRoles();
