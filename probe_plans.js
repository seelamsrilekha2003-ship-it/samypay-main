
const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend/.env') });

const PLAN_API_ID = process.env.PLAN_API_ID;
const PLAN_API_PASSWORD = process.env.PLAN_API_PASSWORD;

async function testPlans() {
    const variations = [
        { apimember_id: PLAN_API_ID, api_password: PLAN_API_PASSWORD },
        { ApiUserID: PLAN_API_ID, ApiPassword: PLAN_API_PASSWORD },
        { user_id: PLAN_API_ID, password: PLAN_API_PASSWORD },
        { apimember_id: PLAN_API_ID, password: PLAN_API_PASSWORD }
    ];

    const operator = "2"; // Airtel
    const circle = "49"; // AP

    for (const vars of variations) {
        console.log("\nTesting variations:", vars);
        try {
            const res = await axios.get("https://planapi.in/api/Mobile/Operatorplan", {
                params: {
                    ...vars,
                    operatorcode: operator,
                    cricle: circle
                },
                timeout: 10000
            });
            console.log("SUCCESS:", JSON.stringify(res.data).substring(0, 200));
        } catch (err) {
            console.log("FAILED:", err.message);
            if (err.response) console.log("Response data:", err.response.data);
        }
    }

    // Also try with 'circle' instead of 'cricle'
    console.log("\nTesting with 'circle' instead of 'cricle'");
    try {
        const res = await axios.get("https://planapi.in/api/Mobile/Operatorplan", {
            params: {
                apimember_id: PLAN_API_ID,
                api_password: PLAN_API_PASSWORD,
                operatorcode: operator,
                circle: circle
            },
            timeout: 10000
        });
        console.log("SUCCESS:", JSON.stringify(res.data).substring(0, 200));
    } catch (err) {
        console.log("FAILED:", err.message);
    }
}

testPlans();

