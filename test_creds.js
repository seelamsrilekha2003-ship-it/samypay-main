const axios = require('axios');
const env = {
    PLAN_API_ID: "69877",
    PLAN_API_PASSWORD: "5487899"
};

async function test() {
    console.log("Testing PlanAPI Credentials...");
    try {
        const res = await axios.get("https://planapi.in/api/Mobile/OperatorCheck", {
            params: {
                apimember_id: env.PLAN_API_ID,
                api_password: env.PLAN_API_PASSWORD,
                consumer_number: "100116944"
            }
        });
        console.log("RESULT:", JSON.stringify(res.data));
    } catch (e) {
        console.error("ERROR:", e.message);
    }
}

test();
