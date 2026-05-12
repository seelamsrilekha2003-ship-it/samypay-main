
const axios = require('axios');
require('dotenv').config();

const BASE_URL = process.env.PLAN_API_BASE_URL || 'https://planapi.in';
const USER_ID = process.env.PLAN_API_ID;
const PASSWORD = process.env.PLAN_API_PASSWORD;

async function test(endpoint) {
    console.log(`--- Testing ${endpoint} ---`);

    // Test POST
    try {
        const res = await axios.post(`${BASE_URL}${endpoint}`, {
            ApiUserID: USER_ID,
            ApiPassword: PASSWORD,
            DTHNumber: '1012345678',
            DthNumber: '1012345678'
        }, { timeout: 5000 });
        console.log(`POST Success:`, res.status, res.data);
    } catch (err) {
        console.log(`POST Failed:`, err.response?.status || err.message);
    }

    // Test GET
    try {
        const res = await axios.get(`${BASE_URL}${endpoint}`, {
            params: {
                ApiUserID: USER_ID,
                ApiPassword: PASSWORD,
                DTHNumber: '1012345678',
                DthNumber: '1012345678',
                DthOpCode: '24'
            },
            timeout: 5000
        });
        console.log(`GET Success:`, res.status, res.data);
    } catch (err) {
        console.log(`GET Failed:`, err.response?.status || err.message);
    }
}

async function run() {
    await test("/api/Mobile/DthOperatorFetch");
    await test("/api/Mobile/DTHBasicDetails");
    await test("/api/Mobile/DTHINFOCheck");
}

run();
