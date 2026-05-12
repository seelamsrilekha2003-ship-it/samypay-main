const axios = require("axios");

const ENV = {
    PLAN_API_ID: "5699",
    PLAN_API_PASSWORD: "36999"
};

async function callApi(endpoint, params) {
    const url = `https://planapi.in/api/Mobile/${endpoint}`;
    console.log(`\n👉 Testing: ${endpoint}`);
    console.log(`   Params:`, JSON.stringify(params));

    const config = {
        method: 'GET',
        url: url,
        timeout: 60000, // 60s timeout
        params: {
            apimember_id: ENV.PLAN_API_ID,
            api_password: ENV.PLAN_API_PASSWORD,
            ...params
        }
    };

    try {
        const start = Date.now();
        const res = await axios(config);
        const duration = (Date.now() - start) / 1000;
        console.log(`   ✅ Status: ${res.data.STATUS} (${duration}s)`);
        console.log(`   Message: ${res.data.MESSAGE}`);
        console.log(`   Data:`, JSON.stringify(res.data.DATA || res.data));
    } catch (e) {
        // const duration = (Date.now() - start) / 1000;
        console.log(`   ❌ Error:`, e.message);
        if (e.response) {
            console.log("   Resp Status:", e.response.status);
            console.log("   Resp Data:", JSON.stringify(e.response.data));
        }
    }
}

async function runDebug() {
    console.log("🔍 Debugging Bill Fetch for 100116944...");

    // Scenario A: TSSPDCL (474)
    await callApi("BillFetch", { bill_number: "100116944", operator_code: "474" });
    await callApi("ElectricityBillFetch", { consumer_number: "100116944", operator_code: "474" });

    // Scenario B: APSPDCL (150)
    console.log("\n--------- CROSS CHECK (APSPDCL - 150) ---------");
    await callApi("BillFetch", { bill_number: "100116944", operator_code: "150" });
}

runDebug();
