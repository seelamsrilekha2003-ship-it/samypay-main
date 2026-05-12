
const axios = require('axios');
const env = require('./config/env');

async function check() {
    const urls = [
        "https://planapi.in/api/Mobile/DthOperatorFetch",
        "https://planapi.in/api/Mobile/DthOperatorFetchNew",
        "https://planapi.in/api/Mobile/DTHBasicDetails",
        "https://planapi.in/api/Mobile/DTHINFOCheck",
        "https://planapi.in/api/Mobile/DthInfoWithLastRechargeDate",
        "https://planapi.in/api/Mobile/DthPlans"
    ];

    for (const url of urls) {
        try {
            const res = await axios.get(url, {
                params: {
                    apimember_id: env.PLAN_API_ID,
                    api_password: env.PLAN_API_PASSWORD,
                    dth_number: '7052160063',
                    mobile_no: '7052160063',
                    Opcode: '27',
                    operatorcode: '27'
                }
            });
            console.log(`SUCCESS ${url}:`, res.status);
        } catch (e) {
            console.log(`FAILED ${url}:`, e.response?.status || e.message);
        }
    }
}
check();
