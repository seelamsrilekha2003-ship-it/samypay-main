const axios = require('axios');
const fs = require('fs');
const env = require('./config/env');

const resultsFile = 'results.txt';
fs.writeFileSync(resultsFile, 'STARTING PROBE\n');

async function check(url, method = 'GET', data = {}) {
    try {
        const config = { method, url, timeout: 5000 };
        if (method === 'GET') config.params = data;
        else config.data = data;

        const res = await axios(config);
        const msg = `[SUCCESS] ${res.status} ${url}\n`;
        console.log(msg);
        fs.appendFileSync(resultsFile, msg);
    } catch (e) {
        const status = e.response?.status || 'ERR';
        const msg = `[FAIL] ${status} ${url} - ${e.message}\n`;
        console.log(msg);
        fs.appendFileSync(resultsFile, msg);
    }
}

async function run() {
    const mobile = '9999999999'; // Dummy
    const op = 'APSPDCL'; // Valid Code

    // standard auth
    const auth = { apimember_id: env.PLAN_API_ID, api_password: env.PLAN_API_PASSWORD };

    // 1. Case Sensitivity Check
    await check('https://planapi.in/api/mobile/BillFetch', 'GET', { ...auth, consumer_number: mobile, operator_code: op });
    await check('https://planapi.in/api/Mobile/BillFetch', 'GET', { ...auth, consumer_number: mobile, operator_code: op });

    // 2. Different Base
    await check('https://planapi.in/api/recharge/electricity', 'POST', { mobile, operator: op, amount: 10, ...auth });
    await check('https://planapi.in/api/electricity/fetch', 'POST', { ...auth, consumer_number: mobile, operator: op });

    // 3. Known Patterns
    await check('https://planapi.in/api/Mobile/ElectricityBillFetch', 'GET', { ...auth, consumer_no: mobile, operatorcode: op });
    await check('https://planapi.in/api/Mobile/FetchBill', 'GET', { ...auth, bill_number: mobile, operator: op });

    fs.appendFileSync(resultsFile, 'DONE\n');
}

run();
