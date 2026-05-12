const outstandingService = require("./outstanding.service");

exports.getOutstandingRecords = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : 1; // Default to 1 for demo

        const filters = {
            status: req.query.status,
            start_date: req.query.start_date,
            end_date: req.query.end_date,
            search: req.query.search
        };

        const records = await outstandingService.getOutstandingRecords(userId, filters);

        res.json({
            success: true,
            data: records
        });
    } catch (err) {
        console.error("Error in getOutstandingRecords:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch outstanding records"
        });
    }
};

exports.getOutstandingStats = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : 1;
        const stats = await outstandingService.getOutstandingStats(userId);

        res.json({
            success: true,
            data: stats
        });
    } catch (err) {
        console.error("Error in getOutstandingStats:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch stats"
        });
    }
};
