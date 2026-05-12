const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "..", "samypay.db");
const db = new Database(dbPath);

console.log("🔧 Adding DTH Plans...");

try {
    // Ensure operators table exists and has entries to satisfy FK
    // We use IDs 101-105 for DTH operators
    const checkTable = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='operators'");
    if (checkTable.get()) {
        const insertOperator = db.prepare("INSERT OR IGNORE INTO operators (id, name, type) VALUES (?, ?, ?)");
        insertOperator.run(101, 'Dish TV', 'DTH');
        insertOperator.run(102, 'Tata Play', 'DTH');
        insertOperator.run(103, 'Airtel Digital TV', 'DTH');
        insertOperator.run(104, 'Videocon D2H', 'DTH');
        insertOperator.run(105, 'Sun Direct', 'DTH');
        console.log("✅ DTH Operators ensured in main operators table");
    }

    const insertPlan = db.prepare(`
    INSERT INTO plans 
    (operator_id, operator_name, circle, amount, validity, description, type, data, voice, sms, category, is_popular) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

    // Dish TV (Code: DISH_TV)
    insertPlan.run(101, 'DISH_TV', 'All India', 350, 'Monthly', 'Super Family Pack', 'DTH', 'NA', 'NA', 'NA', 'DTH', 1);
    insertPlan.run(101, 'DISH_TV', 'All India', 450, 'Monthly', 'Super Sports Pack', 'DTH', 'NA', 'NA', 'NA', 'DTH', 1);

    // Tata Play (Code: TATA_PLAY)
    insertPlan.run(102, 'TATA_PLAY', 'All India', 300, 'Monthly', 'Hindi Dhamaal', 'DTH', 'NA', 'NA', 'NA', 'DTH', 1);
    insertPlan.run(102, 'TATA_PLAY', 'All India', 500, 'Monthly', 'Premium Sports', 'DTH', 'NA', 'NA', 'NA', 'DTH', 1);

    // Airtel Digital TV (Code: AIRTEL_DTH)
    insertPlan.run(103, 'AIRTEL_DTH', 'All India', 285, 'Monthly', 'Value Prime Pack', 'DTH', 'NA', 'NA', 'NA', 'DTH', 1);
    insertPlan.run(103, 'AIRTEL_DTH', 'All India', 460, 'Monthly', 'Mega Pack', 'DTH', 'NA', 'NA', 'NA', 'DTH', 1);

    // Videocon D2H (Code: VIDEOCON_D2H)
    insertPlan.run(104, 'VIDEOCON_D2H', 'All India', 200, 'Monthly', 'Gold Pack', 'DTH', 'NA', 'NA', 'NA', 'DTH', 1);

    // Sun Direct (Code: SUN_DIRECT)
    insertPlan.run(105, 'SUN_DIRECT', 'All India', 230, 'Monthly', 'Tamil Value Pack', 'DTH', 'NA', 'NA', 'NA', 'DTH', 1);

    console.log("✅ DTH plans inserted successfully");

} catch (err) {
    console.error("❌ Error adding DTH plans:", err);
} finally {
    db.close();
}
