const https = require('https');
const fs = require('fs');
require('dotenv').config();

const BASE_URL = process.env.PLAN_API_BASE_URL || "https://planapi.in";
const API_ID = process.env.PLAN_API_ID;
const API_PASS = process.env.PLAN_API_PASSWORD;

// User's details (or defaults)
const CONSUMER_NUMBER = process.argv[2] || "9391829309";
const OPERATOR_CODE = process.argv[3] || "203"; // Bharat Gas

console.log(`\n🔍 MANUAL PROBE for Gas Bill Fetch`);
console.log(`   Number: ${CONSUMER_NUMBER}`);
console.log(`   Operator: ${OPERATOR_CODE}`);

const params = new URLSearchParams({
    apimember_id: API_ID,
    api_password: API_PASS,
    bill_number: CONSUMER_NUMBER, // Start with bill_number
    operator_code: OPERATOR_CODE
});

const url = `${BASE_URL}/api/Mobile/GasBillFetch?${params.toString()}`;

console.log(`\n👉 Requesting: ${url}`);

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        console.log(`\n✅ STATUS: ${res.statusCode}`);
        console.log(`✅ BODY: ${data}`);
        console.log(`\n(If BODY is {"STATUS":"FAILED","MESSAGE":"404 Not Found"}, it means the NUMBER is incorrect for this operator).`);
    });
}).on('error', (err) => {
    console.error(`❌ Error: ${err.message}`);
});
