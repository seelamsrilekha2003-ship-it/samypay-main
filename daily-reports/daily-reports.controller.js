const dailyReportsService = require("./daily-reports.service");

exports.getDayRechargeReport = async (req, res) => {
    try {
        const report = await dailyReportsService.getDayRechargeReport(req.query.date);
        res.json({ success: true, data: report });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getDayCollectionReport = async (req, res) => {
    try {
        const report = await dailyReportsService.getDayCollectionReport(req.query.date);
        res.json({ success: true, data: report });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getRetailerSalesReport = async (req, res) => {
    try {
        const report = await dailyReportsService.getSalesReport(req.query.date, 'Retailer');
        res.json({ success: true, data: report });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getDistributorSalesReport = async (req, res) => {
    try {
        const report = await dailyReportsService.getSalesReport(req.query.date, 'Distributor');
        res.json({ success: true, data: report });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};
