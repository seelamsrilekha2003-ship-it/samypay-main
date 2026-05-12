const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "..", "samypay.db");
const db = new Database(dbPath);

console.log("🔧 Adding Postpaid Plans...");

try {
    const insertPlan = db.prepare(`
    INSERT INTO plans 
    (operator_id, operator_name, circle, amount, validity, description, type, data, voice, sms, category, is_popular) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

    // Airtel Postpaid
    insertPlan.run(1, 'Airtel', 'All India', 399, 'Monthly', '40GB Data + Unlimited Calls + 100 SMS/day', 'postpaid', '40GB', 'Unlimited', '100/day', 'Postpaid', 1);
    insertPlan.run(1, 'Airtel', 'All India', 499, 'Monthly', '75GB Data + Unlimited Calls + Amazon Prime', 'postpaid', '75GB', 'Unlimited', '100/day', 'Postpaid', 1);
    insertPlan.run(1, 'Airtel', 'All India', 999, 'Monthly', '150GB Data + Unlimited Calls + Disney+ Hotstar', 'postpaid', '150GB', 'Unlimited', '100/day', 'Postpaid', 0);

    // Jio Postpaid
    insertPlan.run(2, 'Jio', 'All India', 299, 'Monthly', '30GB Data + Unlimited Calls', 'postpaid', '30GB', 'Unlimited', '100/day', 'Postpaid', 1);
    insertPlan.run(2, 'Jio', 'All India', 599, 'Monthly', 'Unlimited Data + Calls + Netflix Mobile', 'postpaid', 'Unlimited', 'Unlimited', '100/day', 'Postpaid', 1);

    // Vi Postpaid
    insertPlan.run(3, 'Vi', 'All India', 401, 'Monthly', '50GB Data + Unlimited Calls + SunNXT', 'postpaid', '50GB', 'Unlimited', '100/day', 'Postpaid', 1);

    // BSNL Postpaid
    insertPlan.run(4, 'BSNL', 'All India', 199, 'Monthly', '25GB Data + Unlimited Calls', 'postpaid', '25GB', 'Unlimited', '100/day', 'Postpaid', 1);

    console.log("✅ Postpaid plans inserted successfully");

} catch (err) {
    console.error("❌ Error adding Postpaid plans:", err);
} finally {
    db.close();
}
