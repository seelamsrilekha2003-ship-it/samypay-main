const walletReportsService = require("./wallet-reports.service");

exports.getWalletTransactions = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : 1; // Default to user 1 for testing

        const filters = {
            transaction_type: req.query.transaction_type,
            payment_method: req.query.payment_method,
            start_date: req.query.start_date,
            end_date: req.query.end_date,
            search: req.query.search,
            limit: req.query.limit ? parseInt(req.query.limit) : null
        };

        const transactions = await walletReportsService.getWalletTransactions(userId, filters);

        res.json({
            success: true,
            data: transactions,
            count: transactions.length
        });
    } catch (err) {
        console.error("Error in getWalletTransactions:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch wallet transactions",
            error: err.message
        });
    }
};

exports.getWalletStats = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : 1;

        const filters = {
            start_date: req.query.start_date,
            end_date: req.query.end_date
        };

        const stats = await walletReportsService.getWalletStats(userId, filters);

        res.json({
            success: true,
            data: stats
        });
    } catch (err) {
        console.error("Error in getWalletStats:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch wallet statistics",
            error: err.message
        });
    }
};

exports.getCurrentBalance = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : 1;
        const balance = await walletReportsService.getCurrentBalance(userId);

        res.json({
            success: true,
            data: { balance }
        });
    } catch (err) {
        console.error("Error in getCurrentBalance:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch current balance",
            error: err.message
        });
    }
};

exports.getBalanceHistory = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : 1;
        const days = req.query.days ? parseInt(req.query.days) : 30;

        const history = await walletReportsService.getBalanceHistory(userId, days);

        res.json({
            success: true,
            data: history
        });
    } catch (err) {
        console.error("Error in getBalanceHistory:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch balance history",
            error: err.message
        });
    }
};

exports.getPaymentMethodBreakdown = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : 1;

        const filters = {
            start_date: req.query.start_date,
            end_date: req.query.end_date
        };

        const breakdown = await walletReportsService.getPaymentMethodBreakdown(userId, filters);

        res.json({
            success: true,
            data: breakdown
        });
    } catch (err) {
        console.error("Error in getPaymentMethodBreakdown:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch payment method breakdown",
            error: err.message
        });
    }
};
