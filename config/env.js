const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

module.exports = {
  PLAN_API_BASE_URL: process.env.PLAN_API_BASE_URL || "https://planapi.in",
  PLAN_API_ID: process.env.PLAN_API_ID,
  PLAN_API_PASSWORD: process.env.PLAN_API_PASSWORD,
  PORT: process.env.PORT || 5000,
  USE_DUMMY_API: process.env.USE_DUMMY_API === "true"
};
