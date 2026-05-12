const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
    getAllComplaints,
    getComplaintById,
    createComplaint,
    updateComplaintStatus,
    assignComplaint,
    addComment,
    getComplaintStats,
    deleteComplaint
} = require("./complaints.controller");

// Public/User routes
router.get("/", auth, getAllComplaints);
router.get("/stats", auth, getComplaintStats);
router.get("/:id", auth, getComplaintById);
router.post("/", auth, createComplaint);
router.post("/:id/comments", auth, addComment);

// Admin routes
router.put("/:id/status", auth, updateComplaintStatus);
router.put("/:id/assign", auth, assignComplaint);
router.delete("/:id", auth, deleteComplaint);

module.exports = router;
