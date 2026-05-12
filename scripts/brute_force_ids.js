const axios = require('axios');
const env = require('../config/env');

// Range to probe
const START = 1;
const END = 200;

async function probe() {
    console.log(`🚀 Probing IDs ${START} to ${END} to find active Operators...`);

    const url = "https://planapi.in/api/Mobile/Electricitybillfetch";
    const requests = [];

    for (let i = START; i <= END; i++) {
        const params = {
            apimember_id: env.PLAN_API_ID,
            api_password: env.PLAN_API_PASSWORD,
            bill_number: '1234567890', // Dummy
            operator_code: i
        };

        // Push promise
        requests.push(
            axios.get(url, { params, timeout: 3000 })
                .then(res => ({ id: i, status: res.data.STATUS, msg: res.data.MESSAGE }))
                .catch(e => ({ id: i, status: 'ERR', msg: e.message }))
        );

        // Batch of 20 to avoid rate limit
        if (requests.length >= 20 || i === END) {
            const results = await Promise.all(requests);
            results.forEach(r => {
                // If message is NOT "Invalid Operator" or "404", it might be a hit
                // "Consumer Not Found" means ID is VALID.
                if (r.msg && !r.msg.includes("404") && !r.msg.includes("resource was not found")) {
                    console.log(`[ID: ${r.id}] -> ${r.msg}`);
                }
            });
            requests.length = 0; // Clear
        }
    }
}

probe();
