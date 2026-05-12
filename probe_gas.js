const axios = require("axios");
require("dotenv").config();

// CONFIG
const BASE_URL = process.env.PLAN_API_BASE_URL || "https://planapi.in";
const API_ID = process.env.PLAN_API_ID;
const API_PASS = process.env.PLAN_API_PASSWORD;

if (!API_ID || !API_PASS) {
    console.error("❌ Missing PLAN_API_ID or PLAN_API_PASSWORD in .env");
    process.exit(1);
}

// ARGS
const CONSUMER_NUMBER = process.argv[2] || "1210000000"; // Default dummy
const OPERATOR_ID = process.argv[3] || "203"; // Default Bharat Gas

console.log(`\n🔍 PROBING GAS API for Number: ${CONSUMER_NUMBER}, Operator: ${OPERATOR_ID}`);

const probe = async () => {
    const endpoint = "api/Mobile/GasInfoFetch";
    const url = `${BASE_URL}/${endpoint}`;

    const params = {
        apimember_id: API_ID,
        api_password: API_PASS,
        ConsumerNo: CONSUMER_NUMBER,
        operator_code: OPERATOR_ID
    };

    console.log(`\n👉 Request: GET ${url}`);
    console.log(`   Params:`, JSON.stringify(params));

    try {
        const res = await axios.get(url, { params });
        console.log(`\n✅ RESPONSE STATUS: ${res.status}`);
        console.log(`✅ DATA:`, JSON.stringify(res.data, null, 2));
    } catch (err) {
        console.error(`\n❌ ERROR: ${err.message}`);
        if (err.response) {
            console.error(`   Status: ${err.response.status}`);
            console.error(`   Data:`, JSON.stringify(err.response.data, null, 2));
        }
    }
};

probe();
