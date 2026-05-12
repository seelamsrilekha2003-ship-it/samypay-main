const axios = require("axios");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const ENV = {
    PLAN_API_ID: process.env.PLAN_API_ID,
    PLAN_API_PASSWORD: process.env.PLAN_API_PASSWORD
};

const LOG_FILE = path.join(__dirname, "out.txt");
fs.writeFileSync(LOG_FILE, "Starting Debug...\n");

function log(msg) {
    console.log(msg);
    fs.appendFileSync(LOG_FILE, msg + "\n");
}

async function callApi(endpoint, params) {
    const url = `https://planapi.in/api/Mobile/${endpoint}`;
    log(`\n👉 Testing: ${endpoint}`);
    log(`   Params: ${JSON.stringify(params)}`);

    const config = {
        method: 'GET',
        url: url,
        timeout: 10000,
        params: {
            apimember_id: ENV.PLAN_API_ID,
            api_password: ENV.PLAN_API_PASSWORD,
            ...params
        }
    };

    try {
        const res = await axios(config);
        log(`   ✅ Status: ${res.data.STATUS}`);
        log(`   Message: ${res.data.MESSAGE}`);
        if (res.data.STATUS === 'SUCCESS' || res.data.STATUS === '1') {
            log(`   🎉 SUCCESS DATA: ${JSON.stringify(res.data)}`);
        }
    } catch (e) {
        if (e.response) {
            log(`   ❌ Failed: ${e.response.status} ${e.response.statusText}`);
            if (e.response.status !== 404) log(`   Resp: ${JSON.stringify(e.response.data)}`);
        } else {
            log(`   ❌ Error: ${e.message}`);
        }
    }
}

async function runDebug() {
    log("🔍 Debugging APSPDCL (150) for 100116944...");

    // 1. Try 'customer_number' (from web search)
    await callApi("ElectricityBillFetch", { customer_number: "100116944", operator_code: "150" });
    await callApi("BillFetch", { customer_number: "100116944", operator_code: "150" });

    // 2. Try sending Operator String instead of ID
    await callApi("ElectricityBillFetch", { consumer_number: "100116944", operator_code: "APSPDCL" });
    await callApi("ElectricityBillFetch", { consumer_number: "100116944", operator: "APSPDCL" });

    // 3. Try "account" param
    await callApi("ElectricityBillFetch", { account: "100116944", operator_code: "150" });

    // 4. Try 474 again just in case (TSSPDCL)
    await callApi("ElectricityBillFetch", { consumer_number: "100116944", operator_code: "474" });
}

runDebug();
