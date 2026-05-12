const userRolesService = require("./user-roles.service");

exports.getAllRoles = async (req, res) => {
    try {
        const filters = {
            is_active: req.query.is_active !== undefined ? parseInt(req.query.is_active) : undefined
        };

        const roles = await userRolesService.getAllRoles(filters);

        res.json({
            success: true,
            data: roles,
            count: roles.length
        });
    } catch (err) {
        console.error("Error in getAllRoles:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch roles",
            error: err.message
        });
    }
};

exports.getRoleById = async (req, res) => {
    try {
        const role = await userRolesService.getRoleById(req.params.id);

        if (!role) {
            return res.status(404).json({
                success: false,
                message: "Role not found"
            });
        }

        res.json({
            success: true,
            data: role
        });
    } catch (err) {
        console.error("Error in getRoleById:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch role",
            error: err.message
        });
    }
};

exports.getRolePermissions = async (req, res) => {
    try {
        const permissions = await userRolesService.getRolePermissions(req.params.id);

        res.json({
            success: true,
            data: permissions
        });
    } catch (err) {
        console.error("Error in getRolePermissions:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch permissions",
            error: err.message
        });
    }
};

exports.createRole = async (req, res) => {
    try {
        const data = {
            role_name: req.body.role_name,
            role_code: req.body.role_code,
            description: req.body.description,
            commission_multiplier: req.body.commission_multiplier,
            can_add_users: req.body.can_add_users,
            can_manage_commissions: req.body.can_manage_commissions,
            can_view_reports: req.body.can_view_reports,
            can_manage_services: req.body.can_manage_services,
            max_transaction_limit: req.body.max_transaction_limit,
            daily_transaction_limit: req.body.daily_transaction_limit,
            is_active: req.body.is_active
        };

        if (!data.role_name || !data.role_code) {
            return res.status(400).json({
                success: false,
                message: "Role name and code are required"
            });
        }

        const newRole = await userRolesService.createRole(data);

        res.status(201).json({
            success: true,
            message: "Role created successfully",
            data: newRole
        });
    } catch (err) {
        console.error("Error in createRole:", err);
        res.status(500).json({
            success: false,
            message: "Failed to create role",
            error: err.message
        });
    }
};

exports.updateRole = async (req, res) => {
    try {
        const roleId = req.params.id;
        console.log(`Update request for role ID: ${roleId}`, req.body);

        // Get existing role first
        const existingRole = await userRolesService.getRoleById(roleId);
        if (!existingRole) {
            return res.status(404).json({
                success: false,
                message: "Role not found"
            });
        }

        // Helper to get value or default
        const val = (newVal, oldVal) => newVal !== undefined ? newVal : oldVal;
        const numVal = (val, def) => {
            const parsed = Number(val);
            return isNaN(parsed) ? def : parsed;
        };

        // Merge existing data with new data (only update provided fields)
        const data = {
            role_name: val(req.body.role_name, existingRole.role_name),
            description: val(req.body.description, existingRole.description),
            commission_multiplier: numVal(val(req.body.commission_multiplier, existingRole.commission_multiplier), 1.0),
            can_add_users: numVal(val(req.body.can_add_users, existingRole.can_add_users), 0),
            can_manage_commissions: numVal(val(req.body.can_manage_commissions, existingRole.can_manage_commissions), 0),
            can_view_reports: numVal(val(req.body.can_view_reports, existingRole.can_view_reports), 1),
            can_manage_services: numVal(val(req.body.can_manage_services, existingRole.can_manage_services), 0),
            max_transaction_limit: val(req.body.max_transaction_limit, existingRole.max_transaction_limit),
            daily_transaction_limit: val(req.body.daily_transaction_limit, existingRole.daily_transaction_limit),
            is_active: numVal(val(req.body.is_active, existingRole.is_active), 1)
        };

        console.log("Updating role with sanitized data:", data);

        await userRolesService.updateRole(roleId, data);

        res.json({
            success: true,
            message: "Role updated successfully"
        });
    } catch (err) {
        console.error("Error in updateRole:", err);
        // Return the specific error message to the frontend for better debugging
        res.status(500).json({
            success: false,
            message: `Update Failed: ${err.message}`,
            error: err.message
        });
    }
};

exports.deleteRole = async (req, res) => {
    try {
        await userRolesService.deleteRole(req.params.id);

        res.json({
            success: true,
            message: "Role deleted successfully"
        });
    } catch (err) {
        console.error("Error in deleteRole:", err);
        res.status(500).json({
            success: false,
            message: "Failed to delete role",
            error: err.message
        });
    }
};

exports.addPermission = async (req, res) => {
    try {
        const { permission_name, permission_value } = req.body;

        if (!permission_name) {
            return res.status(400).json({
                success: false,
                message: "Permission name is required"
            });
        }

        await userRolesService.addPermission(
            req.params.id,
            permission_name,
            permission_value !== undefined ? permission_value : 1
        );

        res.json({
            success: true,
            message: "Permission added successfully"
        });
    } catch (err) {
        console.error("Error in addPermission:", err);
        res.status(500).json({
            success: false,
            message: "Failed to add permission",
            error: err.message
        });
    }
};

exports.removePermission = async (req, res) => {
    try {
        const { permission_name } = req.body;

        if (!permission_name) {
            return res.status(400).json({
                success: false,
                message: "Permission name is required"
            });
        }

        await userRolesService.removePermission(req.params.id, permission_name);

        res.json({
            success: true,
            message: "Permission removed successfully"
        });
    } catch (err) {
        console.error("Error in removePermission:", err);
        res.status(500).json({
            success: false,
            message: "Failed to remove permission",
            error: err.message
        });
    }
};

exports.getUsersByRole = async (req, res) => {
    try {
        const users = await userRolesService.getUsersByRole(req.params.id);

        res.json({
            success: true,
            data: users,
            count: users.length
        });
    } catch (err) {
        console.error("Error in getUsersByRole:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            error: err.message
        });
    }
};

exports.getRoleStats = async (req, res) => {
    try {
        const stats = await userRolesService.getRoleStats();

        res.json({
            success: true,
            data: stats
        });
    } catch (err) {
        console.error("Error in getRoleStats:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch statistics",
            error: err.message
        });
    }
};
