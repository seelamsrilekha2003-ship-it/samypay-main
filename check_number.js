
const axios = require('axios');
const env = require('./config/env');

async function check() {
    try {
        const res = await axios.get("https://planapi.in/api/Mobile/DthOperatorFetch", {
            params: {
                apimember_id: env.PLAN_API_ID,
                api_password: env.PLAN_API_PASSWORD,
                dth_number: '7052160063'
            }
        });
        console.log("RAW API RESPONSE:", JSON.stringify(res.data, null, 2));
    } catch (e) {
        console.log("FAILED:", e.message);
    }
}
check();
