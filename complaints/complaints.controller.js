const complaintsService = require("./complaints.service");

/**
 * Get all complaints with filters
 * GET /api/complaints?status=PENDING&priority=HIGH&search=recharge
 */
exports.getAllComplaints = async (req, res) => {
    try {
        const filters = {
            status: req.query.status,
            priority: req.query.priority,
            complaint_type: req.query.type,
            search: req.query.search,
            limit: req.query.limit ? parseInt(req.query.limit) : null
        };

        // If user is not admin, show only their complaints
        if (req.user && req.user.role !== 'Admin') {
            filters.user_id = req.user.id;
        }

        const complaints = await complaintsService.getAllComplaints(filters);

        res.json({
            success: true,
            data: complaints,
            count: complaints.length
        });
    } catch (err) {
        console.error("Error in getAllComplaints:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch complaints",
            error: err.message
        });
    }
};

/**
 * Get complaint by ID
 * GET /api/complaints/:id
 */
exports.getComplaintById = async (req, res) => {
    try {
        const { id } = req.params;
        const complaint = await complaintsService.getComplaintById(id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }

        // Check if user has permission to view this complaint
        if (req.user && req.user.role !== 'Admin' && complaint.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        res.json({
            success: true,
            data: complaint
        });
    } catch (err) {
        console.error("Error in getComplaintById:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch complaint",
            error: err.message
        });
    }
};

/**
 * Create new complaint
 * POST /api/complaints
 */
exports.createComplaint = async (req, res) => {
    try {
        const complaintData = {
            user_id: req.user ? req.user.id : req.body.user_id,
            complaint_type: req.body.complaint_type,
            subject: req.body.subject,
            description: req.body.description,
            transaction_id: req.body.transaction_id,
            amount: req.body.amount,
            priority: req.body.priority || 'MEDIUM'
        };

        // Validate required fields
        if (!complaintData.complaint_type || !complaintData.subject || !complaintData.description) {
            return res.status(400).json({
                success: false,
                message: "Complaint type, subject, and description are required"
            });
        }

        const newComplaint = await complaintsService.createComplaint(complaintData);

        res.status(201).json({
            success: true,
            message: "Complaint created successfully",
            data: newComplaint
        });
    } catch (err) {
        console.error("Error in createComplaint:", err);
        res.status(500).json({
            success: false,
            message: "Failed to create complaint",
            error: err.message
        });
    }
};

/**
 * Update complaint status
 * PUT /api/complaints/:id/status
 */
exports.updateComplaintStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, resolution } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status is required"
            });
        }

        await complaintsService.updateComplaintStatus(id, status, resolution);

        res.json({
            success: true,
            message: "Complaint status updated successfully"
        });
    } catch (err) {
        console.error("Error in updateComplaintStatus:", err);
        res.status(500).json({
            success: false,
            message: "Failed to update complaint status",
            error: err.message
        });
    }
};

/**
 * Assign complaint to user
 * PUT /api/complaints/:id/assign
 */
exports.assignComplaint = async (req, res) => {
    try {
        const { id } = req.params;
        const { assigned_to } = req.body;

        if (!assigned_to) {
            return res.status(400).json({
                success: false,
                message: "Assigned user ID is required"
            });
        }

        await complaintsService.assignComplaint(id, assigned_to);

        res.json({
            success: true,
            message: "Complaint assigned successfully"
        });
    } catch (err) {
        console.error("Error in assignComplaint:", err);
        res.status(500).json({
            success: false,
            message: "Failed to assign complaint",
            error: err.message
        });
    }
};

/**
 * Add comment to complaint
 * POST /api/complaints/:id/comments
 */
exports.addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { comment, is_internal } = req.body;
        const userId = req.user ? req.user.id : req.body.user_id;

        if (!comment) {
            return res.status(400).json({
                success: false,
                message: "Comment is required"
            });
        }

        const newComment = await complaintsService.addComment(
            id,
            userId,
            comment,
            is_internal || false
        );

        res.status(201).json({
            success: true,
            message: "Comment added successfully",
            data: newComment
        });
    } catch (err) {
        console.error("Error in addComment:", err);
        res.status(500).json({
            success: false,
            message: "Failed to add comment",
            error: err.message
        });
    }
};

/**
 * Get complaint statistics
 * GET /api/complaints/stats
 */
exports.getComplaintStats = async (req, res) => {
    try {
        const stats = await complaintsService.getComplaintStats();

        res.json({
            success: true,
            data: stats
        });
    } catch (err) {
        console.error("Error in getComplaintStats:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch complaint statistics",
            error: err.message
        });
    }
};

/**
 * Delete complaint (Admin only)
 * DELETE /api/complaints/:id
 */
exports.deleteComplaint = async (req, res) => {
    try {
        const { id } = req.params;

        await complaintsService.deleteComplaint(id);

        res.json({
            success: true,
            message: "Complaint deleted successfully"
        });
    } catch (err) {
        console.error("Error in deleteComplaint:", err);
        res.status(500).json({
            success: false,
            message: "Failed to delete complaint",
            error: err.message
        });
    }
};
