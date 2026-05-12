const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "..", "samypay.db");

/**
 * Get all complaints with filters
 */
exports.getAllComplaints = async (filters = {}) => {
    const db = new Database(dbPath);

    try {
        let query = `
      SELECT 
        c.*,
        u.name as user_name,
        u.mobile as user_mobile,
        a.name as assigned_to_name
      FROM complaints c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN users a ON c.assigned_to = a.id
      WHERE 1=1
    `;

        const params = [];

        if (filters.status) {
            query += ` AND c.status = ?`;
            params.push(filters.status);
        }

        if (filters.priority) {
            query += ` AND c.priority = ?`;
            params.push(filters.priority);
        }

        if (filters.complaint_type) {
            query += ` AND c.complaint_type = ?`;
            params.push(filters.complaint_type);
        }

        if (filters.user_id) {
            query += ` AND c.user_id = ?`;
            params.push(filters.user_id);
        }

        if (filters.search) {
            query += ` AND (c.subject LIKE ? OR c.description LIKE ? OR c.transaction_id LIKE ?)`;
            const searchTerm = `%${filters.search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        query += ` ORDER BY c.created_at DESC`;

        if (filters.limit) {
            query += ` LIMIT ?`;
            params.push(filters.limit);
        }

        const stmt = db.prepare(query);
        const complaints = stmt.all(...params);

        return complaints;
    } catch (error) {
        console.error("Error fetching complaints:", error);
        throw error;
    } finally {
        db.close();
    }
};

/**
 * Get complaint by ID with comments
 */
exports.getComplaintById = async (id) => {
    const db = new Database(dbPath);

    try {
        const complaintStmt = db.prepare(`
      SELECT 
        c.*,
        u.name as user_name,
        u.mobile as user_mobile,
        u.email as user_email,
        a.name as assigned_to_name
      FROM complaints c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN users a ON c.assigned_to = a.id
      WHERE c.id = ?
    `);
        const complaint = complaintStmt.get(id);

        if (!complaint) {
            return null;
        }

        // Get comments
        const commentsStmt = db.prepare(`
      SELECT 
        cc.*,
        u.name as user_name
      FROM complaint_comments cc
      LEFT JOIN users u ON cc.user_id = u.id
      WHERE cc.complaint_id = ?
      ORDER BY cc.created_at ASC
    `);
        const comments = commentsStmt.all(id);

        return { ...complaint, comments };
    } catch (error) {
        console.error("Error fetching complaint by ID:", error);
        throw error;
    } finally {
        db.close();
    }
};

/**
 * Create new complaint
 */
exports.createComplaint = async (complaintData) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
      INSERT INTO complaints 
      (user_id, complaint_type, subject, description, transaction_id, amount, priority)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

        const result = stmt.run(
            complaintData.user_id,
            complaintData.complaint_type,
            complaintData.subject,
            complaintData.description,
            complaintData.transaction_id || null,
            complaintData.amount || null,
            complaintData.priority || 'MEDIUM'
        );

        return { id: result.lastInsertRowid, ...complaintData };
    } catch (error) {
        console.error("Error creating complaint:", error);
        throw error;
    } finally {
        db.close();
    }
};

/**
 * Update complaint status
 */
exports.updateComplaintStatus = async (id, status, resolution = null) => {
    const db = new Database(dbPath);

    try {
        let query = `
      UPDATE complaints
      SET status = ?, updated_at = CURRENT_TIMESTAMP
    `;
        const params = [status];

        if (status === 'RESOLVED' && resolution) {
            query += `, resolution = ?, resolved_at = CURRENT_TIMESTAMP`;
            params.push(resolution);
        }

        query += ` WHERE id = ?`;
        params.push(id);

        const stmt = db.prepare(query);
        stmt.run(...params);

        return true;
    } catch (error) {
        console.error("Error updating complaint status:", error);
        throw error;
    } finally {
        db.close();
    }
};

/**
 * Assign complaint to user
 */
exports.assignComplaint = async (id, assignedTo) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
      UPDATE complaints
      SET assigned_to = ?, status = 'IN_PROGRESS', updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

        stmt.run(assignedTo, id);
        return true;
    } catch (error) {
        console.error("Error assigning complaint:", error);
        throw error;
    } finally {
        db.close();
    }
};

/**
 * Add comment to complaint
 */
exports.addComment = async (complaintId, userId, comment, isInternal = false) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
      INSERT INTO complaint_comments 
      (complaint_id, user_id, comment, is_internal)
      VALUES (?, ?, ?, ?)
    `);

        const result = stmt.run(complaintId, userId, comment, isInternal ? 1 : 0);

        // Update complaint updated_at
        const updateStmt = db.prepare(`
      UPDATE complaints SET updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `);
        updateStmt.run(complaintId);

        return { id: result.lastInsertRowid, complaintId, userId, comment, isInternal };
    } catch (error) {
        console.error("Error adding comment:", error);
        throw error;
    } finally {
        db.close();
    }
};

/**
 * Get complaint statistics
 */
exports.getComplaintStats = async () => {
    const db = new Database(dbPath);

    try {
        const stats = {
            total: 0,
            pending: 0,
            in_progress: 0,
            resolved: 0,
            by_type: {},
            by_priority: {}
        };

        // Total and by status
        const statusStmt = db.prepare(`
      SELECT status, COUNT(*) as count
      FROM complaints
      GROUP BY status
    `);
        const statusResults = statusStmt.all();

        statusResults.forEach(row => {
            stats.total += row.count;
            if (row.status === 'PENDING') stats.pending = row.count;
            if (row.status === 'IN_PROGRESS') stats.in_progress = row.count;
            if (row.status === 'RESOLVED') stats.resolved = row.count;
        });

        // By type
        const typeStmt = db.prepare(`
      SELECT complaint_type, COUNT(*) as count
      FROM complaints
      GROUP BY complaint_type
    `);
        const typeResults = typeStmt.all();
        typeResults.forEach(row => {
            stats.by_type[row.complaint_type] = row.count;
        });

        // By priority
        const priorityStmt = db.prepare(`
      SELECT priority, COUNT(*) as count
      FROM complaints
      GROUP BY priority
    `);
        const priorityResults = priorityStmt.all();
        priorityResults.forEach(row => {
            stats.by_priority[row.priority] = row.count;
        });

        return stats;
    } catch (error) {
        console.error("Error fetching complaint stats:", error);
        throw error;
    } finally {
        db.close();
    }
};

/**
 * Delete complaint (Admin only)
 */
exports.deleteComplaint = async (id) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`DELETE FROM complaints WHERE id = ?`);
        stmt.run(id);

        return true;
    } catch (error) {
        console.error("Error deleting complaint:", error);
        throw error;
    } finally {
        db.close();
    }
};
/**
 * Create Invalid Amount Report
 */
exports.createInvalidAmountReport = async (data) => {
    const db = new Database(dbPath);
    try {
        // Ensure table exists
        db.exec(`
            CREATE TABLE IF NOT EXISTS invalid_amount_reports (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                service_type TEXT,
                operator_name TEXT,
                mobile_number TEXT,
                account_number TEXT,
                invalid_amount REAL,
                valid_amount REAL,
                transaction_id TEXT,
                reason TEXT,
                status TEXT DEFAULT 'PENDING',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        const stmt = db.prepare(`
            INSERT INTO invalid_amount_reports (
                user_id, service_type, operator_name, mobile_number, 
                account_number, invalid_amount, valid_amount, 
                transaction_id, reason
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const info = stmt.run(
            data.user_id, data.service_type, data.operator_name,
            data.mobile_number, data.account_number, data.invalid_amount,
            data.valid_amount, data.transaction_id, data.reason
        );

        return { id: info.lastInsertRowid, ...data };
    } finally {
        db.close();
    }
};
