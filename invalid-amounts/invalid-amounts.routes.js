const express = require("express");
const router = express.Router();
const {
    getAllInvalidAmounts,
    getInvalidAmountById,
    createInvalidAmount,
    updateInvalidAmountStatus,
    updateValidAmount,
    getInvalidAmountStats,
    deleteInvalidAmount
} = require("./invalid-amounts.controller");
const auth = require("../middlewares/auth");

// Public/User routes
router.get("/", auth, getAllInvalidAmounts);
router.get("/stats", auth, getInvalidAmountStats);
router.get("/:id", auth, getInvalidAmountById);
router.post("/", auth, createInvalidAmount);

// Admin routes
router.put("/:id/status", auth, updateInvalidAmountStatus);
router.put("/:id/valid-amount", auth, updateValidAmount);
router.delete("/:id", auth, deleteInvalidAmount);

module.exports = router;
