const userCommissionsService = require("./user-commissions.service");

exports.getUserCommissions = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : 1; // Default to user 1 for testing

        const filters = {
            service_type: req.query.service_type,
            status: req.query.status,
            start_date: req.query.start_date,
            end_date: req.query.end_date,
            limit: req.query.limit ? parseInt(req.query.limit) : null
        };

        const commissions = await userCommissionsService.getUserCommissions(userId, filters);

        res.json({
            success: true,
            data: commissions,
            count: commissions.length
        });
    } catch (err) {
        console.error("Error in getUserCommissions:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch commissions",
            error: err.message
        });
    }
};

exports.getUserCommissionStats = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : 1;
        const stats = await userCommissionsService.getUserCommissionStats(userId);

        res.json({
            success: true,
            data: stats
        });
    } catch (err) {
        console.error("Error in getUserCommissionStats:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch statistics",
            error: err.message
        });
    }
};

exports.getCommissionsByService = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : 1;
        const { serviceType } = req.params;

        const commissions = await userCommissionsService.getCommissionsByService(userId, serviceType);

        res.json({
            success: true,
            data: commissions,
            count: commissions.length
        });
    } catch (err) {
        console.error("Error in getCommissionsByService:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch commissions by service",
            error: err.message
        });
    }
};

exports.getMonthlyCommissionSummary = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : 1;
        const { year, month } = req.query;

        if (!year || !month) {
            return res.status(400).json({
                success: false,
                message: "Year and month are required"
            });
        }

        const summary = await userCommissionsService.getMonthlyCommissionSummary(
            userId,
            parseInt(year),
            parseInt(month)
        );

        res.json({
            success: true,
            data: summary
        });
    } catch (err) {
        console.error("Error in getMonthlyCommissionSummary:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch monthly summary",
            error: err.message
        });
    }
};
