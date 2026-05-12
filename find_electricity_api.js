const axios = require('axios');
const env = require('./config/env');

async function findEndpoints() {
    console.log("🔍 Probing PlanAPI for Electricity Endpoints...");

    const candidates = [
        // Candidate 1: Generic Bill Fetch (Most likely)
        "https://planapi.in/api/Mobile/BillFetch",

        // Candidate 2: Legacy Fetch Bill
        "https://planapi.in/api/Mobile/FetchBill",

        // Candidate 3: Electricity Specific (PascalCase)
        "https://planapi.in/api/Mobile/ElectricityBillFetch",
        "https://planapi.in/api/Mobile/ElectricityDistrictCode", // User provided
        "https://planapi.in/api/Mobile/ElectricityBillCheck",
        "https://planapi.in/api/Mobile/ElectricityCheckBill",
        "https://planapi.in/api/Mobile/ElectricityFetchBill",

        // Candidate 3b: Mixed Case (from previous attempts)
        "https://planapi.in/api/Mobile/Electricitybillfetch",
        "https://planapi.in/api/Mobile/Billfetch",
    ];

    // Params to send (generic enough to trigger validation error instead of 404)
    const params = {
        apimember_id: env.PLAN_API_ID,
        api_password: env.PLAN_API_PASSWORD,
        consumer_number: '1234567890',
        operator_code: 'APSPDCL', // Valid code
        operator: 'APSPDCL',
        type: 'ELECTRICITY'
    };

    for (const url of candidates) {
        try {
            const res = await axios.get(url, { params, timeout: 5000 });
            console.log(`✅ FOUND [200 OK]: ${url}`);
            console.log("   Response:", JSON.stringify(res.data).substring(0, 100));
        } catch (e) {
            if (e.response) {
                if (e.response.status === 404) {
                    console.log(`❌ 404 Not Found: ${url}`);
                } else {
                    console.log(`⚠️ FOUND [${e.response.status}]: ${url} (Exists but params/auth likely wrong)`);
                    console.log("   Msg:", e.response.data?.MESSAGE || e.message);
                }
            } else {
                console.log(`❌ Request Error for ${url}: ${e.message}`);
            }
        }
    }
}

findEndpoints();
