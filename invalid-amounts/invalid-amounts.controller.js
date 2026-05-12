const invalidAmountsService = require("./invalid-amounts.service");

/**
 * Get all invalid amounts
 * GET /api/invalid-amounts?status=PENDING&service_type=MOBILE_RECHARGE&search=keyword
 */
exports.getAllInvalidAmounts = async (req, res) => {
    try {
        const filters = {
            status: req.query.status,
            service_type: req.query.service_type,
            search: req.query.search,
            limit: req.query.limit ? parseInt(req.query.limit) : null
        };

        // If user is not admin, show only their entries
        if (req.user && req.user.role !== 'Admin') {
            filters.user_id = req.user.id;
        }

        const invalidAmounts = await invalidAmountsService.getAllInvalidAmounts(filters);

        res.json({
            success: true,
            data: invalidAmounts,
            count: invalidAmounts.length
        });
    } catch (err) {
        console.error("Error in getAllInvalidAmounts:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch invalid amounts",
            error: err.message
        });
    }
};

/**
 * Get invalid amount by ID
 * GET /api/invalid-amounts/:id
 */
exports.getInvalidAmountById = async (req, res) => {
    try {
        const { id } = req.params;
        const invalidAmount = await invalidAmountsService.getInvalidAmountById(id);

        if (!invalidAmount) {
            return res.status(404).json({
                success: false,
                message: "Invalid amount entry not found"
            });
        }

        res.json({
            success: true,
            data: invalidAmount
        });
    } catch (err) {
        console.error("Error in getInvalidAmountById:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch invalid amount",
            error: err.message
        });
    }
};

/**
 * Create new invalid amount entry
 * POST /api/invalid-amounts
 */
exports.createInvalidAmount = async (req, res) => {
    try {
        const data = {
            user_id: req.user ? req.user.id : req.body.user_id,
            service_type: req.body.service_type,
            operator_name: req.body.operator_name,
            mobile_number: req.body.mobile_number,
            account_number: req.body.account_number,
            invalid_amount: req.body.invalid_amount,
            valid_amount: req.body.valid_amount,
            transaction_id: req.body.transaction_id,
            reason: req.body.reason
        };

        // Validate required fields
        if (!data.service_type || !data.invalid_amount) {
            return res.status(400).json({
                success: false,
                message: "Service type and invalid amount are required"
            });
        }

        const newEntry = await invalidAmountsService.createInvalidAmount(data);

        res.status(201).json({
            success: true,
            message: "Invalid amount entry created successfully",
            data: newEntry
        });
    } catch (err) {
        console.error("Error in createInvalidAmount:", err);
        res.status(500).json({
            success: false,
            message: "Failed to create invalid amount entry",
            error: err.message
        });
    }
};

/**
 * Update invalid amount status
 * PUT /api/invalid-amounts/:id/status
 */
exports.updateInvalidAmountStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const resolvedBy = req.user ? req.user.id : null;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status is required"
            });
        }

        await invalidAmountsService.updateInvalidAmountStatus(id, status, resolvedBy);

        res.json({
            success: true,
            message: "Status updated successfully"
        });
    } catch (err) {
        console.error("Error in updateInvalidAmountStatus:", err);
        res.status(500).json({
            success: false,
            message: "Failed to update status",
            error: err.message
        });
    }
};

/**
 * Update valid amount
 * PUT /api/invalid-amounts/:id/valid-amount
 */
exports.updateValidAmount = async (req, res) => {
    try {
        const { id } = req.params;
        const { valid_amount } = req.body;

        if (!valid_amount) {
            return res.status(400).json({
                success: false,
                message: "Valid amount is required"
            });
        }

        await invalidAmountsService.updateValidAmount(id, valid_amount);

        res.json({
            success: true,
            message: "Valid amount updated successfully"
        });
    } catch (err) {
        console.error("Error in updateValidAmount:", err);
        res.status(500).json({
            success: false,
            message: "Failed to update valid amount",
            error: err.message
        });
    }
};

/**
 * Get statistics
 * GET /api/invalid-amounts/stats
 */
exports.getInvalidAmountStats = async (req, res) => {
    try {
        const stats = await invalidAmountsService.getInvalidAmountStats();

        res.json({
            success: true,
            data: stats
        });
    } catch (err) {
        console.error("Error in getInvalidAmountStats:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch statistics",
            error: err.message
        });
    }
};

/**
 * Delete invalid amount entry (Admin only)
 * DELETE /api/invalid-amounts/:id
 */
exports.deleteInvalidAmount = async (req, res) => {
    try {
        const { id } = req.params;

        await invalidAmountsService.deleteInvalidAmount(id);

        res.json({
            success: true,
            message: "Invalid amount entry deleted successfully"
        });
    } catch (err) {
        console.error("Error in deleteInvalidAmount:", err);
        res.status(500).json({
            success: false,
            message: "Failed to delete entry",
            error: err.message
        });
    }
};
