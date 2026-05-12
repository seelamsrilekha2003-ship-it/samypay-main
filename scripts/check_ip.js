const axios = require('axios');

async function checkIp() {
    console.log("🔍 Checking Public IP Address...");
    try {
        const res = await axios.get('https://api.ipify.org?format=json');
        console.log(`\n🌍 YOUR PUBLIC IP: ${res.data.ip}\n`);
        console.log("⚠️ Please ensure this IP is whitelisted in your PlanAPI Dashboard.");
    } catch (e) {
        console.log("❌ Failed to check IP:", e.message);
    }
}

checkIp();
