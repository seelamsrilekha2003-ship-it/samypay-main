const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "..", "samypay.db");

// Get all outstanding records
exports.getOutstandingRecords = async (userId, filters = {}) => {
    const db = new Database(dbPath);

    try {
        let query = `SELECT * FROM outstanding_records WHERE user_id = ?`;
        const params = [userId];

        if (filters.status) {
            query += ` AND status = ?`;
            params.push(filters.status);
        }

        if (filters.start_date) {
            query += ` AND DATE(created_at) >= ?`;
            params.push(filters.start_date);
        }

        if (filters.end_date) {
            query += ` AND DATE(created_at) <= ?`;
            params.push(filters.end_date);
        }

        if (filters.search) {
            query += ` AND (description LIKE ? OR reference_id LIKE ?)`;
            const searchTerm = `%${filters.search}%`;
            params.push(searchTerm, searchTerm);
        }

        // Sort by Due Date (Overdue first)
        query += ` ORDER BY 
      CASE WHEN status = 'OVERDUE' THEN 1 
           WHEN status = 'PENDING' THEN 2 
           ELSE 3 
      END, due_date ASC`;

        const stmt = db.prepare(query);
        return stmt.all(...params);
    } catch (error) {
        console.error("Error fetching outstanding records:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Get stats
exports.getOutstandingStats = async (userId) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
      SELECT 
        COUNT(*) as total_records,
        SUM(CASE WHEN status = 'PENDING' THEN amount ELSE 0 END) as total_pending_amount,
        SUM(CASE WHEN status = 'OVERDUE' THEN amount ELSE 0 END) as total_overdue_amount,
        COUNT(CASE WHEN status = 'OVERDUE' THEN 1 END) as overdue_count
      FROM outstanding_records
      WHERE user_id = ?
    `);

        return stmt.get(userId);
    } catch (error) {
        console.error("Error fetching outstanding stats:", error);
        throw error;
    } finally {
        db.close();
    }
};
