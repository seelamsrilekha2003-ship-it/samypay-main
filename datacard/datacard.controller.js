const datacardService = require("./datacard.service");

exports.recharge = async (req, res) => {
    try {
        const { account, operator, amount, paymentMode } = req.body;
        const userId = req.user.id; // From auth middleware

        const result = await datacardService.processRecharge({
            userId,
            account,
            operator,
            amount,
            service: "DATACARD",
            paymentMode
        });

        res.json({ success: true, ...result });

    } catch (error) {
        console.error("DataCard Recharge Error:", error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.fetchDetails = async (req, res) => {
    try {
        const { operator, datacardNumber, cardNumber } = req.body;
        const number = datacardNumber || cardNumber;

        if (!number) {
            return res.status(400).json({ success: false, message: "DataCard Number required" });
        }
        const result = await datacardService.fetchDetails(operator, number);
        if (!result.success) {
            return res.status(404).json(result);
        }
        res.json({ success: true, data: result });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

