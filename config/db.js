// Switched from MySQL to SQLite for easier setup (no separate server needed)
// Original MySQL config commented out below:
// const mysql = require("mysql2");
// const db = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "sai@123",
//   database: "samypay"
// });

// SQLite configuration
const db = require("./db.sqlite");

module.exports = db;
