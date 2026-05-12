const axios = require("axios");
require("dotenv").config();

const BASE_URL = process.env.PLAN_API_BASE_URL || "https://planapi.in";
const API_ID = process.env.PLAN_API_ID;
const API_PASS = process.env.PLAN_API_PASSWORD;
const CONSUMER_NUMBER = process.argv[2] || "9391829309";

const commonCodes = [
    "5", "10", "12", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "33", "34", "35", // Common Electricity/Gas
    "203", "204", "205" // The ones user provided
];

const fs = require('fs');

const probe = async () => {
    const msg = `\n🔥 BRUTE FORCE PROBING GAS OPERATOR CODES for ${CONSUMER_NUMBER}\n`;
    fs.writeFileSync('brute_log.txt', msg);
    console.log(msg);

    for (const code of commonCodes) {
        const url = `${BASE_URL}/api/Mobile/GasInfoFetch`;
        const params = {
            apimember_id: API_ID,
            api_password: API_PASS,
            ConsumerNo: CONSUMER_NUMBER,
            operator_code: code
        };

        try {
            const res = await axios.get(url, { params, timeout: 5000 });
            const log = `[CODE ${code}] STATUS: ${res.data.STATUS}, MSG: ${res.data.MESSAGE}\n`;
            fs.appendFileSync('brute_log.txt', log);
            console.log(log.trim());
        } catch (err) {
            const log = `[CODE ${code}] ERR: ${err.message}\n`;
            fs.appendFileSync('brute_log.txt', log);
        }
    }
    fs.appendFileSync('brute_log.txt', "Done.\n");
};

probe();
