const axios = require('axios');
require('dotenv').config({ path: './backend/.env' });

const env = {
    PLAN_API_ID: process.env.PLAN_API_ID,
    PLAN_API_PASSWORD: process.env.PLAN_API_PASSWORD
};

async function probe() {
    console.log("Using API ID:", env.PLAN_API_ID);

    const endpoints = [
        { url: "https://planapi.in/api/Electricity/BillFetch", method: "POST" },
        { url: "https://planapi.in/api/Electricity/BillFetch", method: "GET" },
        { url: "https://planapi.in/api/Mobile/BillFetch", method: "GET" },
        { url: "https://planapi.in/api/Mobile/ElectricityBillFetch", method: "GET" }
    ];

    for (const ep of endpoints) {
        console.log(`\nTesting ${ep.method} ${ep.url}...`);
        try {
            const config = {
                method: ep.method,
                url: ep.url,
                timeout: 10000,
            };

            const params = {
                apimember_id: env.PLAN_API_ID,
                api_password: env.PLAN_API_PASSWORD,
                consumer_number: "100116944",
                operator_code: "474"
            };

            if (ep.method === "GET") {
                config.params = params;
            } else {
                config.data = params;
            }

            const res = await axios(config);
            console.log("✅ SUCCESS:", JSON.stringify(res.data));
        } catch (e) {
            console.log(`❌ FAILED: ${e.message}`);
            if (e.response) {
                console.log(`   Status: ${e.response.status}`);
                console.log(`   Data: ${JSON.stringify(e.response.data)}`);
            }
        }
    }
}

probe();
