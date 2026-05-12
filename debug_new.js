// debug_new.js
const gasService = require("./gas/gas.service");
const landlineService = require("./landline/landline.service");
const fastagService = require("./fastag/fastag.service");
const waterService = require("./water/water.service");

// Mock console.log to verify outputs
const originalLog = console.log;
/*
console.log = (...args) => {
    if (args[0] && typeof args[0] === 'string' && args[0].includes('👉')) {
        originalLog("\x1b[36m%s\x1b[0m", ...args); // Cyan for API TRY logs
    } else {
        originalLog(...args); 
    }
};
*/

async function run() {
    console.log("\n==================== GAS TEST ====================");
    try {
        // Operator 203 (Bharat Gas), Custom Num
        await gasService.fetchDetails("203", "1234567890");
    } catch (e) { console.log("Gas Error:", e.message); }

    console.log("\n==================== LANDLINE TEST ====================");
    try {
        // User requested: "api/Mobile/LandlineFetch" with { ConsumerNo, operator_code }
        await landlineService.fetchDetails("BSNL", "04499887766");
    } catch (e) { console.log("Landline Error:", e.message); }

    console.log("\n==================== FASTAG TEST ====================");
    try {
        // User requested: "api/Mobile/FastagInfoFetch" with { VehicleNo, operator_code }
        await fastagService.fetchDetails("PAYTM", "TN01AB1234");
    } catch (e) { console.log("Fastag Error:", e.message); }

    console.log("\n==================== WATER TEST ====================");
    try {
        // User requested: "api/Mobile/WaterInfoFetch" with { ConsumerNo, operator_code }
        await waterService.fetchDetails("BWSSB", "567890");
    } catch (e) { console.log("Water Error:", e.message); }
}

run();
