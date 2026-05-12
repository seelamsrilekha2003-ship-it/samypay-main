const axios = require('axios');

/**
 * Simulates sending an OTP via a dummy API.
 * In a real application, you would integrate with providers like Fast2SMS, Twilio, etc.
 */
exports.sendOtp = async (mobile, otp) => {
    console.log(`[OTP SERVICE] Preparing to send OTP ${otp} to ${mobile}...`);

    // SIMULATION: mocking an external API call
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`[OTP SERVICE] 🚀 SUCCESS: OTP ${otp} sent to ${mobile} (Simulated)`);
            resolve({ success: true, message: "OTP Sent Successfully (Simulated)" });
        }, 500); // Simulate network delay
    });

    /* 
    // EXAMPLE: Real integration with Fast2SMS (Uncomment and add API Key to use)
    try {
        const response = await axios.get('https://www.fast2sms.com/dev/bulkV2', {
            params: {
                authorization: process.env.FAST2SMS_API_KEY,
                variables_values: otp,
                route: 'otp',
                numbers: mobile
            }
        });
        return response.data;
    } catch (error) {
        console.error("OTP API Error:", error);
        return { success: false, message: "Failed to send OTP via API" };
    }
    */
};
