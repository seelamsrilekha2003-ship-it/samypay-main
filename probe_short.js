const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const ID = process.env.PLAN_API_ID;
const PASS = process.env.PLAN_API_PASSWORD;

console.log(`STARTING PROBE. ID: ${ID ? 'OK' : 'MISSING'}`);

const endpoints = [
    "api/Mobile/ElectricityBillFetch",
    "api/Mobile/BillFetch",
    "api/Mobile/FetchBill",
    "api/electricity/fetch"
];

const params = { apimember_id: ID, api_password: PASS, bill_number: "3482100012", operator_code: "153" };

async function probe() {
    const baseUrl = "https://planapi.in";

    for (const endpoint of endpoints) {
        const url = `${baseUrl}/${endpoint}`;
        console.log(`TESTING: ${url}`);

        try {
            const res = await axios.get(url, { params, timeout: 5000 });
            console.log(`STATUS: ${res.status}`);
            console.log(`DATA: ${JSON.stringify(res.data).substring(0, 100)}`);
        } catch (e) {
            console.log(`ERROR: ${e.response?.status || e.message}`);
            if (e.response?.data) console.log(`ERR DATA: ${JSON.stringify(e.response.data).substring(0, 100)}`);
        }
    }
}

probe();
