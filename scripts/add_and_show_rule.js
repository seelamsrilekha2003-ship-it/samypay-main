const db = require("../config/db");

const addAndShow = async () => {
    console.log("=================================================");
    console.log("       ➕ ADDING NEW RULE & DISPLAYING LIST       ");
    console.log("=================================================\n");

    const query = (sql, params = []) => {
        return new Promise((resolve, reject) => {
            db.query(sql, params, (err, res) => {
                if (err) reject(err);
                resolve(res || []);
            });
        });
    };

    try {
        // 1. FIND IDs
        const jio = (await query("SELECT id FROM mobile_operators WHERE operator_name LIKE '%Jio%' LIMIT 1"))[0];
        const pay2all = (await query("SELECT id FROM api_providers WHERE provider_name LIKE '%Pay2All%' LIMIT 1"))[0];

        if (!jio || !pay2all) {
            console.error("❌ Setup Error: Jio or Pay2All not found in DB.");
            process.exit(1);
        }

        console.log(`1️⃣  Target Details found:`);
        console.log(`    - Operator: Jio (ID: ${jio.id})`);
        console.log(`    - API: Pay2All (ID: ${pay2all.id})`);

        // 2. ADD RULE
        console.log("\n2️⃣  Executing INSERT for New Rule (Range: ₹199 - ₹299)...");
        await query(
            "INSERT INTO planwise_api (operator_id, circle_id, service_type, min_amount, max_amount, api_id, status) VALUES (?, 0, 'PREPAID', 199, 299, ?, 'Active')",
            [jio.id, pay2all.id]
        );
        console.log("    ✅ Success! Rule Inserted.");

        // 3. SHOW ALL RULES
        console.log("\n3️⃣  FETCHING UPDATED RULES TABLE...");
        const sql = `
            SELECT p.id, 
                   p.min_amount, p.max_amount, 
                   COALESCE(m.operator_name, 'Unknown') as op_name,
                   ap.provider_name as api_name
            FROM planwise_api p
            LEFT JOIN mobile_operators m ON p.operator_id = m.id
            LEFT JOIN api_providers ap ON p.api_id = ap.id
            ORDER BY p.id DESC
        `;
        const rules = await query(sql);

        console.log("\n----------------------------------------------------------------");
        console.log(" ID | Operator | Range           | Routed To");
        console.log("----------------------------------------------------------------");
        rules.forEach(r => {
            const range = `₹${r.min_amount} - ₹${r.max_amount}`;
            console.log(` ${r.id.toString().padEnd(3)}| ${r.op_name.padEnd(9)}| ${range.padEnd(16)}| ${r.api_name}`);
        });
        console.log("----------------------------------------------------------------\n");
        console.log("✅ The new rule is now live in the Dashboard!");
        process.exit(0);

    } catch (err) {
        console.error("❌ Error:", err);
        process.exit(1);
    }
};

addAndShow();
