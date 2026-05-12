
const axios = require('axios');
const env = require('./config/env');

async function check() {
    const baseUrl = "https://planapi.in/api/Mobile";
    try {
        const res = await axios.get(`${baseUrl}/DthInfoWithLastRechargeDate`, {
            params: {
                apimember_id: env.PLAN_API_ID,
                api_password: env.PLAN_API_PASSWORD,
                mobile_no: '7052160063',
                Opcode: '29'
            }
        });
        console.log("DETAILS 29:", res.data);

        const res2 = await axios.get(`${baseUrl}/DthInfoWithLastRechargeDate`, {
            params: {
                apimember_id: env.PLAN_API_ID,
                api_password: env.PLAN_API_PASSWORD,
                mobile_no: '7052160063',
                Opcode: '27'
            }
        });
        console.log("DETAILS 27:", res2.data);
    } catch (e) {
        console.log("FAILED:", e.message);
    }
}
check();
