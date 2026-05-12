const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const ID = process.env.PLAN_API_ID;
const PASS = process.env.PLAN_API_PASSWORD;

console.log(`Loaded ID: ${ID ? 'YES' : 'NO'}, PASS: ${PASS ? 'YES' : 'NO'}`);

const baseUrls = [
    "https://planapi.in",
    "http://planapi.in"
];

const endpoints = [
    "api/Mobile/ElectricityBillFetch",
    "api/Mobile/BillFetch",
    "api/Mobile/FetchBill",
    "api/Mobile/ElectricityBill",
    "api/mobile/electricitybillfetch", // Lowercase
    "api/recharge/electricity", // POST only likely
    "api/electricity/fetch"
];

const paramsVariants = [
    { name: "Standard", payload: { apimember_id: ID, api_password: PASS, bill_number: "3482100012", operator_code: "153" } },
    { name: "AltKeys", payload: { ApiUserID: ID, ApiPassword: PASS, consumer_number: "3482100012", operator: "153" } }
];

async function probe() {
    for (const baseUrl of baseUrls) {
        for (const endpoint of endpoints) {
            const url = `${baseUrl}/${endpoint}`;

            // Test GET
            try {
                const p1 = paramsVariants[0].payload;
                console.log(`TEST GET ${url}`);
                const res = await axios.get(url, { params: p1, timeout: 5000 });
                console.log(`✅ [${res.status}] GET SUCCESS:`, JSON.stringify(res.data));
            } catch (e) {
                console.log(`❌ [${e.response?.status || 'ERR'}] GET FAILED: ${e.message}`);
            }

            // Test POST
            try {
                const p1 = paramsVariants[0].payload;
                console.log(`TEST POST ${url}`);
                const res = await axios.post(url, p1, { timeout: 5000 });
                console.log(`✅ [${res.status}] POST SUCCESS:`, JSON.stringify(res.data));
            } catch (e) {
                console.log(`❌ [${e.response?.status || 'ERR'}] POST FAILED: ${e.message}`);
            }
        }
    }
}

probe();
