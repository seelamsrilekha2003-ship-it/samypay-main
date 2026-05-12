// test_detect.js
const operatorsService = require("./operators/operators.service");

async function run() {
    console.log("Testing Mobile Operator Detection...");
    try {
        // Test with a known mobile number (e.g. valid Indian mobile)
        const result = await operatorsService.detectOperator("9391829309");
        console.log("Result:", result);
    } catch (e) {
        console.error("Error:", e.message);
    }
}

run();
