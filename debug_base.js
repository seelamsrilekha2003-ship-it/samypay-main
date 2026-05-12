
const axios = require('axios');
require('dotenv').config();

const USER_ID = process.env.PLAN_API_ID;
const PASSWORD = process.env.PLAN_API_PASSWORD;

const bases = [
    'https://planapi.in',
    'http://planapi.in',
    'https://www.planapi.in',
    'http://www.planapi.in',
    'https://api.planapi.in',
    'http://api.planapi.in'
];

async function run() {
    for (const base of bases) {
        console.log(`Testing Base: ${base}`);
        try {
            const res = await axios.post(`${base}/api/Mobile/DthOperatorFetch`, {
                ApiUserID: USER_ID,
                ApiPassword: PASSWORD,
                DTHNumber: '1012345678'
            }, { timeout: 3000 });
            console.log(`  MATCH FOUND: ${base} -> ${res.status}`);
        } catch (err) {
            console.log(`  ${base}: ${err.response?.status || err.message}`);
        }
    }
}

run();
