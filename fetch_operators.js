const axios = require('axios');
const env = require('./config/env');

async function fetchOperators() {
    console.log("🔍 Fetching Electricity Operators...");

    // Auth Params
    const params = {
        apimember_id: env.PLAN_API_ID,
        api_password: env.PLAN_API_PASSWORD,
        // type: 'GAS' // Try with and without type
    };

    const endpoints = [
        "https://planapi.in/api/Mobile/ElectricityOperatorFetch",
        "https://planapi.in/api/Mobile/OperatorFetch", // Generic
        "https://planapi.in/api/Mobile/ElectricityOperator",
        "https://planapi.in/api/Mobile/OperatorCheck"
    ];

    for (const url of endpoints) {
        try {
            console.log(`\n👉 Trying: ${url}`);
            const res = await axios.get(url, { params, timeout: 10000 });
            console.log(`✅ STATUS: ${res.status}`);

            // Log first 3 items to check structure
            if (res.data && Array.isArray(res.data)) {
                console.log("DATA SAMPLE:", JSON.stringify(res.data.slice(0, 3), null, 2));

                // Look for APSPDCL specifically
                const found = res.data.find(op =>
                    JSON.stringify(op).toLowerCase().includes('apspdcl') ||
                    JSON.stringify(op).toLowerCase().includes('southern')
                );
                if (found) {
                    console.log("🎯 FOUND APSPDCL MATCH:", found);
                }
            } else {
                console.log("DATA:", JSON.stringify(res.data).substring(0, 200));
            }

        } catch (e) {
            console.log(`❌ FAILED: ${e.message}`, e.response?.data || "");
        }
    }
}

fetchOperators();
