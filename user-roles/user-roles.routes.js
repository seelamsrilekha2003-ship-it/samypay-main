const express = require("express");
const router = express.Router();
const {
    getAllRoles,
    getRoleById,
    getRolePermissions,
    createRole,
    updateRole,
    deleteRole,
    addPermission,
    removePermission,
    getUsersByRole,
    getRoleStats
} = require("./user-roles.controller");

router.get("/", getAllRoles);
router.get("/stats", getRoleStats);
router.get("/:id", getRoleById);
router.get("/:id/permissions", getRolePermissions);
router.get("/:id/users", getUsersByRole);
router.post("/", createRole);
router.put("/:id", updateRole);
router.delete("/:id", deleteRole);
router.post("/:id/permissions", addPermission);
router.delete("/:id/permissions", removePermission);

module.exports = router;
