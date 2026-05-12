const express = require("express");
const router = express.Router();
const {
    getOutstandingRecords,
    getOutstandingStats
} = require("./outstanding.controller");

router.get("/", getOutstandingRecords);
router.get("/stats", getOutstandingStats);

module.exports = router;
