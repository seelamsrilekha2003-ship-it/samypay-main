const express = require("express");
const router = express.Router();
const {
    getBankAccounts,
    getBankAccountById,
    createBankAccount,
    updateBankAccount,
    setPrimaryAccount,
    updateAccountStatus,
    verifyAccount,
    deleteBankAccount,
    getBankStats
} = require("./bank.controller");

// User routes
router.get("/", getBankAccounts);
router.get("/stats", getBankStats);
router.get("/:id", getBankAccountById);
router.post("/", createBankAccount);
router.put("/:id", updateBankAccount);
router.put("/:id/primary", setPrimaryAccount);
router.put("/:id/status", updateAccountStatus);
router.delete("/:id", deleteBankAccount);

// Admin routes
router.put("/:id/verify", verifyAccount);

module.exports = router;
