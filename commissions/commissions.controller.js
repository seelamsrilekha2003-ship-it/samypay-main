const commissionsService = require("./commissions.service");

exports.getAllCommissions = async (req, res) => {
    try {
        const filters = {
            service_type: req.query.service_type,
            operator_name: req.query.operator_name,
            user_role: req.query.user_role,
            is_active: req.query.is_active !== undefined ? parseInt(req.query.is_active) : undefined
        };

        const commissions = await commissionsService.getAllCommissions(filters);

        res.json({
            success: true,
            data: commissions,
            count: commissions.length
        });
    } catch (err) {
        console.error("Error in getAllCommissions:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch commissions",
            error: err.message
        });
    }
};

exports.getCommissionById = async (req, res) => {
    try {
        const commission = await commissionsService.getCommissionById(req.params.id);

        if (!commission) {
            return res.status(404).json({
                success: false,
                message: "Commission not found"
            });
        }

        res.json({
            success: true,
            data: commission
        });
    } catch (err) {
        console.error("Error in getCommissionById:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch commission",
            error: err.message
        });
    }
};

exports.createCommission = async (req, res) => {
    try {
        const data = {
            service_type: req.body.service_type,
            operator_name: req.body.operator_name,
            plan_type: req.body.plan_type,
            min_amount: req.body.min_amount,
            max_amount: req.body.max_amount,
            commission_type: req.body.commission_type,
            commission_value: req.body.commission_value,
            user_role: req.body.user_role,
            is_active: req.body.is_active
        };

        if (!data.service_type || !data.commission_value) {
            return res.status(400).json({
                success: false,
                message: "Service type and commission value are required"
            });
        }

        const newCommission = await commissionsService.createCommission(data);

        res.status(201).json({
            success: true,
            message: "Commission created successfully",
            data: newCommission
        });
    } catch (err) {
        console.error("Error in createCommission:", err);
        res.status(500).json({
            success: false,
            message: "Failed to create commission",
            error: err.message
        });
    }
};

exports.updateCommission = async (req, res) => {
    try {
        const data = {
            service_type: req.body.service_type,
            operator_name: req.body.operator_name,
            plan_type: req.body.plan_type,
            min_amount: req.body.min_amount,
            max_amount: req.body.max_amount,
            commission_type: req.body.commission_type,
            commission_value: req.body.commission_value,
            user_role: req.body.user_role,
            is_active: req.body.is_active
        };

        await commissionsService.updateCommission(req.params.id, data);

        res.json({
            success: true,
            message: "Commission updated successfully"
        });
    } catch (err) {
        console.error("Error in updateCommission:", err);
        res.status(500).json({
            success: false,
            message: "Failed to update commission",
            error: err.message
        });
    }
};

exports.toggleCommissionStatus = async (req, res) => {
    try {
        await commissionsService.toggleCommissionStatus(req.params.id);

        res.json({
            success: true,
            message: "Commission status toggled successfully"
        });
    } catch (err) {
        console.error("Error in toggleCommissionStatus:", err);
        res.status(500).json({
            success: false,
            message: "Failed to toggle commission status",
            error: err.message
        });
    }
};

exports.deleteCommission = async (req, res) => {
    try {
        await commissionsService.deleteCommission(req.params.id);

        res.json({
            success: true,
            message: "Commission deleted successfully"
        });
    } catch (err) {
        console.error("Error in deleteCommission:", err);
        res.status(500).json({
            success: false,
            message: "Failed to delete commission",
            error: err.message
        });
    }
};

exports.getCommissionStats = async (req, res) => {
    try {
        const stats = await commissionsService.getCommissionStats();

        res.json({
            success: true,
            data: stats
        });
    } catch (err) {
        console.error("Error in getCommissionStats:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch statistics",
            error: err.message
        });
    }
};

exports.calculateCommission = async (req, res) => {
    try {
        const { service_type, operator_name, amount, user_role } = req.body;

        if (!service_type || !amount) {
            return res.status(400).json({
                success: false,
                message: "Service type and amount are required"
            });
        }

    const result = await commissionsService.calculateCommission(
    service_type,
    operator_name,
    amount,
    user_role || 'RETAILER'
);

res.json({
    success: true,
    data: result
});

    } catch (err) {
        console.error("Error in calculateCommission:", err);
        res.status(500).json({
            success: false,
            message: "Failed to calculate commission",
            error: err.message
        });
    }
};
exports.getMyCommissions = async (req, res) => {
    try {
        // Later replace with req.user.role (JWT)
        const user_role = req.query.user_role || "RETAILER";
        const search = req.query.search || "";

        const commissions = await commissionsService.getMyCommissions({
            user_role,
            search
        });

        res.json({
            success: true,
            data: commissions,
            count: commissions.length
        });
    } catch (err) {
        console.error("Error in getMyCommissions:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch my commissions"
        });
    }
};
