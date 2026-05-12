const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "..", "samypay.db");

// Get all commissions for a user
exports.getUserCommissions = async (userId, filters = {}) => {
    const db = new Database(dbPath);

    try {
        let query = `SELECT * FROM user_commissions WHERE user_id = ?`;
        const params = [userId];

        if (filters.service_type) {
            query += ` AND service_type = ?`;
            params.push(filters.service_type);
        }

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

        query += ` ORDER BY created_at DESC`;

        if (filters.limit) {
            query += ` LIMIT ?`;
            params.push(filters.limit);
        }

        const stmt = db.prepare(query);
        return stmt.all(...params);
    } catch (error) {
        console.error("Error fetching user commissions:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Get commission statistics for a user
exports.getUserCommissionStats = async (userId) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
      SELECT 
        COUNT(*) as total_transactions,
        SUM(commission_amount) as total_earned,
        SUM(CASE WHEN status = 'SETTLED' THEN commission_amount ELSE 0 END) as settled_amount,
        SUM(CASE WHEN status = 'PENDING' THEN commission_amount ELSE 0 END) as pending_amount,
        SUM(CASE WHEN service_type = 'MOBILE_RECHARGE' THEN commission_amount ELSE 0 END) as mobile_earnings,
        SUM(CASE WHEN service_type = 'DTH_RECHARGE' THEN commission_amount ELSE 0 END) as dth_earnings,
        SUM(CASE WHEN service_type IN ('ELECTRICITY', 'GAS', 'WATER') THEN commission_amount ELSE 0 END) as bill_earnings
      FROM user_commissions
      WHERE user_id = ?
    `);

        return stmt.get(userId);
    } catch (error) {
        console.error("Error fetching commission stats:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Get commission by service type
exports.getCommissionsByService = async (userId, serviceType) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
      SELECT * FROM user_commissions
      WHERE user_id = ? AND service_type = ?
      ORDER BY created_at DESC
    `);

        return stmt.all(userId, serviceType);
    } catch (error) {
        console.error("Error fetching commissions by service:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Get monthly commission summary
exports.getMonthlyCommissionSummary = async (userId, year, month) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as transactions,
        SUM(commission_amount) as daily_earnings
      FROM user_commissions
      WHERE user_id = ? 
        AND strftime('%Y', created_at) = ? 
        AND strftime('%m', created_at) = ?
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);

        return stmt.all(userId, year.toString(), month.toString().padStart(2, '0'));
    } catch (error) {
        console.error("Error fetching monthly summary:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Record commission for a transaction
exports.recordCommission = async (data) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
      INSERT INTO user_commissions 
      (user_id, transaction_id, service_type, operator_name, transaction_amount, commission_rate, commission_type, commission_amount, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        const result = stmt.run(
            data.user_id,
            data.transaction_id || null,
            data.service_type,
            data.operator_name || null,
            data.transaction_amount,
            data.commission_rate,
            data.commission_type,
            data.commission_amount,
            data.status || 'PENDING'
        );

        return { id: result.lastInsertRowid, ...data };
    } catch (error) {
        console.error("Error recording commission:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Update commission status (for admin settlement)
exports.updateCommissionStatus = async (id, status) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
      UPDATE user_commissions
      SET status = ?, settled_at = CASE WHEN ? = 'SETTLED' THEN CURRENT_TIMESTAMP ELSE NULL END
      WHERE id = ?
    `);

        stmt.run(status, status, id);
        return true;
    } catch (error) {
        console.error("Error updating commission status:", error);
        throw error;
    } finally {
        db.close();
    }
};
