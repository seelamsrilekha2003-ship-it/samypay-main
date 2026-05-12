const db = require('../config/db');
(async () => {
    try {
        const [rows] = await db.promise().query("SELECT * FROM billers WHERE category='GAS'");
        console.log("GAS BILLERS:", rows);
    } catch (e) {
        console.error(e);
    }
})();
