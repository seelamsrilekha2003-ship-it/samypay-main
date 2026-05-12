const service = require('./electricity/electricity.service');

async function test() {
    console.log("🚀 Starting Bill Fetch Verification...");
    const start = Date.now();

    try {
        // Use a dummy number. 
        // We expect this to fail, but FAST. Not timeout.
        const res = await service.fetchBillDetails("1234567890", "APSPDCL");

        const duration = (Date.now() - start) / 1000;
        console.log(`\n✅ Finished in ${duration} seconds`);
        console.log("Result:", JSON.stringify(res, null, 2));

        if (duration < 25) {
            console.log("✅ TEST PASSED: Response returned within acceptable time limit.");
        } else {
            console.log("❌ TEST FAILED: Response took too long.");
        }

    } catch (e) {
        console.log("❌ Error:", e.message);
    }
}

test();
