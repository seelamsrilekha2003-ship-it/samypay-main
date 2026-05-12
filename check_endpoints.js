const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

const checkEndpoint = async () => {
    console.log("🔍 Checking Backend Health...");

    try {
        // 1. Check Root/Auth (Should be there)
        try {
            await axios.get('http://localhost:5000/');
            console.log("✅ Server Root: Reachable (404 is normal for root, but connection established)");
        } catch (e) {
            if (e.code === 'ECONNREFUSED') {
                console.error("❌ SERVER IS DOWN (Connection Refused on port 5000)");
                process.exit(1);
            }
            console.log(`✅ Server Reachable (Response: ${e.response ? e.response.status : e.message})`);
        }

        // 2. Check Electricity Route
        console.log("🔍 Testing POST /api/electricity/fetch-details...");
        try {
            const res = await axios.post(`${BASE_URL}/electricity/fetch-details`, {
                consumerNo: "123",
                operatorCode: "TEST"
            });
            console.log(`✅ Electricity Route Exists! Status: ${res.status}`);
            console.log("Response:", res.data);
        } catch (err) {
            if (err.response) {
                console.log(`❌ Route responded with Status: ${err.response.status}`);
                console.log("Data:", err.response.data);
            } else {
                console.log("❌ Network Error:", err.message);
            }
        }

    } catch (err) {
        console.error("Unexpected Error:", err.message);
    }
};

checkEndpoint();
