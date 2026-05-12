const express = require("express");
const router = express.Router();
const { getMyCommissions } = require("./commissions.controller");



const {
    getAllCommissions,
    getCommissionById,
    createCommission,
    updateCommission,
    toggleCommissionStatus,
    deleteCommission,
    getCommissionStats,
    calculateCommission
} = require("./commissions.controller");

router.get("/", getAllCommissions);
router.get("/stats", getCommissionStats);
router.post("/calculate", calculateCommission);
router.get("/my-commissions", getMyCommissions);
router.get("/:id", getCommissionById);
router.post("/", createCommission);
router.put("/:id", updateCommission);
router.put("/:id/toggle", toggleCommissionStatus);
router.delete("/:id", deleteCommission);


module.exports = router;
