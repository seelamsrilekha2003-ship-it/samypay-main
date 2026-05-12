const https = require('https');

const ID = '6324';
const PASS = 'Ajay@0987';

function check(path, method, headers = {}) {
    return new Promise(resolve => {
        const options = {
            hostname: 'planapi.in',
            port: 443,
            path: path,
            method: method,
            headers: headers,
            timeout: 5000
        };

        const req = https.request(options, res => {
            console.log(`[${res.statusCode}] ${method} ${path}`);
            resolve();
        });

        req.on('error', e => {
            console.log(`[ERR] ${method} ${path}: ${e.message}`);
            resolve();
        });

        req.end();
    });
}

async function run() {
    console.log("--- PROBE START ---");

    // 1. Try lowercase 'mobile'
    await check(`/api/mobile/OperatorCheck?apimember_id=${ID}&api_password=${PASS}&number=1234567890&type=ELECTRICITY`, 'GET');

    // 2. Try 'recharge' base (New API?)
    await check(`/api/recharge/electricity`, 'POST', { 'apikey': ID, 'Content-Type': 'application/json' });

    // 3. Try 'bill' base
    await check(`/api/bill/fetch?apimember_id=${ID}&api_password=${PASS}`, 'GET');

    // 4. Try standard BillFetch with lowercase
    await check(`/api/mobile/BillFetch?apimember_id=${ID}&api_password=${PASS}&consumer_number=123&operator_code=APSPDCL`, 'GET');

    console.log("--- PROBE END ---");
}

run();
