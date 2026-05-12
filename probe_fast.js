const axios = require('axios');
const env = require('./config/env');

const candidates = [
    // Standard Mobile Path (Pascal)
    "https://planapi.in/api/Mobile/ElectricityBillFetch",
    "https://planapi.in/api/Mobile/ElectricityFetchBill",
    "https://planapi.in/api/Mobile/ElectricityBill",
    "https://planapi.in/api/Mobile/BillFetch",
    "https://planapi.in/api/Mobile/FetchBill",

    // Lowercase Suffix (proven interesting)
    "https://planapi.in/api/Mobile/Electricitybillfetch",
    "https://planapi.in/api/Mobile/Electricityfetchbill",
    "https://planapi.in/api/Mobile/Electricitybill",
    "https://planapi.in/api/Mobile/Billfetch",

    // Recharge Path
    "https://planapi.in/api/recharge/billfetch",
    "https://planapi.in/api/recharge/electricity",
    "https://planapi.in/api/recharge/electricitybill",

    // Base Path
    "https://planapi.in/api/Electricity/BillFetch",
    "https://planapi.in/api/Electricity/Fetch"
];

const params = {
    apimember_id: env.PLAN_API_ID,
    api_password: env.PLAN_API_PASSWORD,
    bill_number: '1234567890',
    operator_code: 'APSPDCL'
};

const check = async (url) => {
    try {
        console.log(`Checking: ${url}`);
        await axios.get(url, { params, timeout: 5000 });
        console.log(`✅ [200 OK] ${url}`);
        return true;
    } catch (e) {
        const status = e.response?.status;
        if (status === 404) {
            // console.log(`❌ [404] ${url}`);
        } else if (status === 500) {
            console.log(`⚠️ [500 CRASH] ${url} (Exists!)`);
        } else if (status) {
            console.log(`🔹 [${status}] ${url} (Alive)`);
        } else {
            console.log(`💀 [ERR] ${url}: ${e.message}`);
        }
        return false;
    }
};

async function run() {
    console.log("🚀 Starting Fast Probe...");
    await Promise.all(candidates.map(check));
    console.log("🏁 Probe Complete.");
}

run();
