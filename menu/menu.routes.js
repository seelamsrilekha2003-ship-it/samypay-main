const express = require("express");
const router = express.Router();
const {
    getUserMenu,
    getAllMenuItems,
    getRoleMenuAccess,
    updateRoleMenuAccess,
    checkUserPermission
} = require("./menu.controller");

router.get("/user-menu", getUserMenu);
router.get("/all", getAllMenuItems);
router.get("/role/:roleId", getRoleMenuAccess);
router.put("/role/:roleId/menu/:menuId", updateRoleMenuAccess);
router.get("/check-permission", checkUserPermission);

module.exports = router;
