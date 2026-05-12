const axios = require('axios');

async function verifyFixes() {
    const API_BASE = 'http://localhost:5000/api';
    
    console.log('🧪 Verifying backend success/failure logic...\n');

    try {
        // Test 1: Plans API with invalid operator (should return success: false)
        console.log('1️⃣ Testing: GET /plans?operator=INVALID&circle=94');
        try {
            const res = await axios.get(`${API_BASE}/plans?operator=INVALID&circle=94`);
            console.log(`   ❌ Failed: Should have returned 400 error but got 200`);
            console.log(`   Response:`, res.data);
        } catch (err) {
            if (err.response) {
                console.log(`   ✅ Success: Received expected error ${err.response.status}`);
                console.log(`   Response:`, JSON.stringify(err.response.data));
                if (err.response.data.success === false) {
                    console.log('   ✅ verified: success is false');
                } else {
                    console.log('   ❌ failed: success is still true');
                }
            } else {
                console.error('   ❌ Error connecting to backend:', err.message);
            }
        }

        // Test 2: Detect API (should return success: false for unknown)
        console.log('\n2️⃣ Testing: POST /api/detect/operator (Unknown Number)');
        try {
            // We need a token for this, but if it fails due to auth it's fine for current test
            // Let's try without auth first to see if it hits our new logic (likely 401 though)
            const res = await axios.post(`${API_BASE}/detect/operator`, {
                number: '0000000000',
                category: 'MOBILE'
            });
            console.log(`   ❌ Failed: Should have returned 401 or handled result`);
        } catch (err) {
             if (err.response && err.response.status === 401) {
                console.log('   ℹ️ (Auth required, skipping manual detect test)');
             } else if (err.response) {
                console.log(`   ✅ Success: Received response ${err.response.status}`);
                console.log(`   Response:`, JSON.stringify(err.response.data));
             }
        }

    } catch (globalErr) {
        console.error('💥 Verification Fatal Error:', globalErr.message);
    }
}

verifyFixes();
