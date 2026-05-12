const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const endpoints = [
    "api/Mobile/ElectricityBillFetch",
    "api/Mobile/ElectricityBill",
    "api/Mobile/BillFetch",
    "api/Mobile/FetchElectricityBill"
];

const methods = ["GET", "POST"];

const params = {
    apimember_id: process.env.PLAN_API_ID,
    api_password: process.env.PLAN_API_PASSWORD,
    bill_number: "3482100012", // Try without hyphen
    operator_code: "153",
    Optional1: "",
    Optional2: ""
};

async function probe() {
    console.log("Starting Probe...");

    if (!process.env.PLAN_API_ID) {
        console.error("❌ ENV VARIABLES MISSING");
        return;
    }

    for (const endpoint of endpoints) {
        for (const method of methods) {
            const url = `https://planapi.in/${endpoint}`;
            console.log(`\nTesting ${method} ${url}`);

            try {
                const config = {
                    method,
                    url,
                    timeout: 5000,
                    params: method === "GET" ? params : undefined,
                    data: method === "POST" ? params : undefined
                };

                const res = await axios(config);
                console.log(`✅ [${res.status}] Success! Response:`, JSON.stringify(res.data).substring(0, 100));

                if (res.data.STATUS === "SUCCESS" || res.data.STATUS === "1" || (res.data.MESSAGE && !res.data.MESSAGE.includes("404"))) {
                    console.log(">>> THIS ENDPOINT SEEMS VALID <<<");
                }

            } catch (err) {
                if (err.response) {
                    console.log(`❌ [${err.response.status}] Failed. Text: ${err.response.statusText}`);
                } else {
                    console.log(`❌ Error: ${err.message}`);
                }
            }
        }
    }
}

probe();
