const menuService = require("./menu.service");

exports.getUserMenu = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : 1; // Default to user 1 for testing
        const menu = await menuService.getUserMenu(userId);

        res.json({
            success: true,
            data: menu
        });
    } catch (err) {
        console.error("Error in getUserMenu:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user menu",
            error: err.message
        });
    }
};

exports.getAllMenuItems = async (req, res) => {
    try {
        const menus = await menuService.getAllMenuItems();

        res.json({
            success: true,
            data: menus
        });
    } catch (err) {
        console.error("Error in getAllMenuItems:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch menu items",
            error: err.message
        });
    }
};

exports.getRoleMenuAccess = async (req, res) => {
    try {
        const { roleId } = req.params;
        const menus = await menuService.getRoleMenuAccess(roleId);

        res.json({
            success: true,
            data: menus
        });
    } catch (err) {
        console.error("Error in getRoleMenuAccess:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch role menu access",
            error: err.message
        });
    }
};

exports.updateRoleMenuAccess = async (req, res) => {
    try {
        const { roleId, menuId } = req.params;
        const permissions = {
            can_view: req.body.can_view,
            can_create: req.body.can_create,
            can_edit: req.body.can_edit,
            can_delete: req.body.can_delete
        };

        await menuService.updateRoleMenuAccess(roleId, menuId, permissions);

        res.json({
            success: true,
            message: "Menu access updated successfully"
        });
    } catch (err) {
        console.error("Error in updateRoleMenuAccess:", err);
        res.status(500).json({
            success: false,
            message: "Failed to update menu access",
            error: err.message
        });
    }
};

exports.checkUserPermission = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : 1;
        const { menuCode, action } = req.query;

        const hasPermission = await menuService.checkUserPermission(userId, menuCode, action);

        res.json({
            success: true,
            hasPermission
        });
    } catch (err) {
        console.error("Error in checkUserPermission:", err);
        res.status(500).json({
            success: false,
            message: "Failed to check permission",
            error: err.message
        });
    }
};
