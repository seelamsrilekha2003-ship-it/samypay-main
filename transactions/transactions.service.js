const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "..", "samypay.db");

// Get all transactions for a user
exports.getUserTransactions = async (userId, filters = {}) => {
    const db = new Database(dbPath);

    try {
        let query = `SELECT * FROM transactions WHERE user_id = ?`;
        const params = [userId];

        if (filters.transaction_type) {
            query += ` AND transaction_type = ?`;
            params.push(filters.transaction_type);
        }

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

        if (filters.search) {
            query += ` AND (account_number LIKE ? OR reference_id LIKE ? OR operator_name LIKE ?)`;
            const searchTerm = `%${filters.search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        query += ` ORDER BY created_at DESC`;

        if (filters.limit) {
            query += ` LIMIT ?`;
            params.push(filters.limit);
        }

        const stmt = db.prepare(query);
        return stmt.all(...params);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Get transaction statistics
exports.getTransactionStats = async (userId, filters = {}) => {
    const db = new Database(dbPath);

    try {
        let query = `
      SELECT 
        COUNT(*) as total_transactions,
        SUM(CASE WHEN status = 'SUCCESS' THEN 1 ELSE 0 END) as successful,
        SUM(CASE WHEN status = 'FAILED' THEN 1 ELSE 0 END) as failed,
        SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'SUCCESS' THEN amount ELSE 0 END) as total_amount,
        SUM(CASE WHEN status = 'SUCCESS' THEN commission_amount ELSE 0 END) as total_commission,
        SUM(CASE WHEN transaction_type = 'RECHARGE' AND status = 'SUCCESS' THEN amount ELSE 0 END) as recharge_amount,
        SUM(CASE WHEN transaction_type = 'BILL_PAYMENT' AND status = 'SUCCESS' THEN amount ELSE 0 END) as bill_amount,
        SUM(CASE WHEN transaction_type = 'WALLET_CREDIT' AND status = 'SUCCESS' THEN amount ELSE 0 END) as wallet_credit
      FROM transactions
      WHERE user_id = ?
    `;

        const params = [userId];

        if (filters.start_date) {
            query += ` AND DATE(created_at) >= ?`;
            params.push(filters.start_date);
        }

        if (filters.end_date) {
            query += ` AND DATE(created_at) <= ?`;
            params.push(filters.end_date);
        }

        const stmt = db.prepare(query);
        return stmt.get(...params);
    } catch (error) {
        console.error("Error fetching transaction stats:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Get transaction by ID
exports.getTransactionById = async (id, userId) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`SELECT * FROM transactions WHERE id = ? AND user_id = ?`);
        return stmt.get(id, userId);
    } catch (error) {
        console.error("Error fetching transaction:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Get daily transaction summary
exports.getDailySummary = async (userId, days = 7) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as transactions,
        SUM(CASE WHEN status = 'SUCCESS' THEN amount ELSE 0 END) as total_amount,
        SUM(CASE WHEN status = 'SUCCESS' THEN commission_amount ELSE 0 END) as total_commission
      FROM transactions
      WHERE user_id = ? AND created_at >= datetime('now', '-' || ? || ' days')
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);

        return stmt.all(userId, days);
    } catch (error) {
        console.error("Error fetching daily summary:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Get service-wise breakdown
exports.getServiceBreakdown = async (userId, filters = {}) => {
    const db = new Database(dbPath);

    try {
        let query = `
      SELECT 
        service_type,
        COUNT(*) as count,
        SUM(CASE WHEN status = 'SUCCESS' THEN amount ELSE 0 END) as total_amount,
        SUM(CASE WHEN status = 'SUCCESS' THEN commission_amount ELSE 0 END) as total_commission
      FROM transactions
      WHERE user_id = ?
    `;

        const params = [userId];

        if (filters.start_date) {
            query += ` AND DATE(created_at) >= ?`;
            params.push(filters.start_date);
        }

        if (filters.end_date) {
            query += ` AND DATE(created_at) <= ?`;
            params.push(filters.end_date);
        }

        query += ` GROUP BY service_type ORDER BY total_amount DESC`;

        const stmt = db.prepare(query);
        return stmt.all(...params);
    } catch (error) {
        console.error("Error fetching service breakdown:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Create transaction
exports.createTransaction = async (data) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
      INSERT INTO transactions 
      (user_id, transaction_type, service_type, operator_name, account_number, amount, commission_amount, status, payment_method, reference_id, operator_ref_id, description, opening_balance, closing_balance)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        const result = stmt.run(
            data.user_id,
            data.transaction_type,
            data.service_type,
            data.operator_name || null,
            data.account_number || null,
            data.amount,
            data.commission_amount || 0,
            data.status || 'PENDING',
            data.payment_method || 'WALLET',
            data.reference_id,
            data.operator_ref_id || null,
            data.description || null,
            data.opening_balance || 0,
            data.closing_balance || 0
        );

        return { id: result.lastInsertRowid, ...data };
    } catch (error) {
        console.error("Error creating transaction:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Update transaction status
exports.updateTransactionStatus = async (id, status, operatorRefId = null) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
      UPDATE transactions
      SET status = ?, operator_ref_id = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

        stmt.run(status, operatorRefId, id);
        return true;
    } catch (error) {
        console.error("Error updating transaction status:", error);
        throw error;
    } finally {
        db.close();
    }
};
