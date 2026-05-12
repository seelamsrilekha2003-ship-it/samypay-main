const bankService = require("./bank.service");

/**
 * Get all bank accounts for logged-in user
 * GET /api/bank
 */
exports.getBankAccounts = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : 1; // Default to user 1 for testing
        const accounts = await bankService.getBankAccounts(userId);

        res.json({
            success: true,
            data: accounts,
            count: accounts.length
        });
    } catch (err) {
        console.error("Error in getBankAccounts:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch bank accounts",
            error: err.message
        });
    }
};

/**
 * Get bank account by ID
 * GET /api/bank/:id
 */
exports.getBankAccountById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user ? req.user.id : 1;
        const account = await bankService.getBankAccountById(id, userId);

        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Bank account not found"
            });
        }

        res.json({
            success: true,
            data: account
        });
    } catch (err) {
        console.error("Error in getBankAccountById:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch bank account",
            error: err.message
        });
    }
};

/**
 * Create new bank account
 * POST /api/bank
 */
exports.createBankAccount = async (req, res) => {
    try {
        const data = {
            user_id: req.user ? req.user.id : 1,
            bank_name: req.body.bank_name,
            account_number: req.body.account_number,
            ifsc_code: req.body.ifsc || req.body.ifsc_code,
            account_holder_name: req.body.account_holder_name || req.body.holder_name,
            account_type: req.body.account_type || 'SAVINGS',
            branch_name: req.body.branch_name,
            is_primary: req.body.is_primary || 0
        };

        // Validate required fields
        if (!data.bank_name || !data.account_number || !data.ifsc_code || !data.account_holder_name) {
            return res.status(400).json({
                success: false,
                message: "Bank name, account number, IFSC code, and account holder name are required"
            });
        }

        const newAccount = await bankService.createBankAccount(data);

        res.status(201).json({
            success: true,
            message: "Bank account added successfully",
            data: newAccount
        });
    } catch (err) {
        console.error("Error in createBankAccount:", err);

        if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({
                success: false,
                message: "This account number is already linked"
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to add bank account",
            error: err.message
        });
    }
};

/**
 * Update bank account
 * PUT /api/bank/:id
 */
exports.updateBankAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user ? req.user.id : 1;

        const data = {
            bank_name: req.body.bank_name,
            account_number: req.body.account_number,
            ifsc_code: req.body.ifsc_code,
            account_holder_name: req.body.account_holder_name,
            account_type: req.body.account_type,
            branch_name: req.body.branch_name,
            is_primary: req.body.is_primary
        };

        await bankService.updateBankAccount(id, userId, data);

        res.json({
            success: true,
            message: "Bank account updated successfully"
        });
    } catch (err) {
        console.error("Error in updateBankAccount:", err);
        res.status(500).json({
            success: false,
            message: "Failed to update bank account",
            error: err.message
        });
    }
};

/**
 * Set primary account
 * PUT /api/bank/:id/primary
 */
exports.setPrimaryAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user ? req.user.id : 1;

        await bankService.setPrimaryAccount(id, userId);

        res.json({
            success: true,
            message: "Primary account updated successfully"
        });
    } catch (err) {
        console.error("Error in setPrimaryAccount:", err);
        res.status(500).json({
            success: false,
            message: "Failed to set primary account",
            error: err.message
        });
    }
};

/**
 * Update account status
 * PUT /api/bank/:id/status
 */
exports.updateAccountStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const userId = req.user ? req.user.id : 1;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status is required"
            });
        }

        await bankService.updateAccountStatus(id, userId, status);

        res.json({
            success: true,
            message: "Account status updated successfully"
        });
    } catch (err) {
        console.error("Error in updateAccountStatus:", err);
        res.status(500).json({
            success: false,
            message: "Failed to update account status",
            error: err.message
        });
    }
};

/**
 * Verify account (Admin only)
 * PUT /api/bank/:id/verify
 */
exports.verifyAccount = async (req, res) => {
    try {
        const { id } = req.params;

        await bankService.verifyAccount(id);

        res.json({
            success: true,
            message: "Account verified successfully"
        });
    } catch (err) {
        console.error("Error in verifyAccount:", err);
        res.status(500).json({
            success: false,
            message: "Failed to verify account",
            error: err.message
        });
    }
};

/**
 * Delete bank account
 * DELETE /api/bank/:id
 */
exports.deleteBankAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user ? req.user.id : 1;

        await bankService.deleteBankAccount(id, userId);

        res.json({
            success: true,
            message: "Bank account deleted successfully"
        });
    } catch (err) {
        console.error("Error in deleteBankAccount:", err);
        res.status(500).json({
            success: false,
            message: "Failed to delete bank account",
            error: err.message
        });
    }
};

/**
 * Get statistics
 * GET /api/bank/stats
 */
exports.getBankStats = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : 1;
        const stats = await bankService.getBankStats(userId);

        res.json({
            success: true,
            data: stats
        });
    } catch (err) {
        console.error("Error in getBankStats:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch statistics",
            error: err.message
        });
    }
};
