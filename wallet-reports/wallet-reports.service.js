const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "..", "samypay.db");

// Get all wallet transactions for a user
exports.getWalletTransactions = async (userId, filters = {}) => {
    const db = new Database(dbPath);

    try {
        let query = `SELECT * FROM wallet_transactions WHERE user_id = ?`;
        const params = [userId];

        if (filters.transaction_type) {
            query += ` AND transaction_type = ?`;
            params.push(filters.transaction_type);
        }

        if (filters.payment_method) {
            query += ` AND payment_method = ?`;
            params.push(filters.payment_method);
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
            query += ` AND (description LIKE ? OR payment_reference LIKE ?)`;
            const searchTerm = `%${filters.search}%`;
            params.push(searchTerm, searchTerm);
        }

        query += ` ORDER BY created_at DESC`;

        if (filters.limit) {
            query += ` LIMIT ?`;
            params.push(filters.limit);
        }

        const stmt = db.prepare(query);
        return stmt.all(...params);
    } catch (error) {
        console.error("Error fetching wallet transactions:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Get wallet statistics
exports.getWalletStats = async (userId, filters = {}) => {
    const db = new Database(dbPath);

    try {
        let query = `
      SELECT 
        COUNT(*) as total_transactions,
        SUM(CASE WHEN transaction_type = 'CREDIT' THEN 1 ELSE 0 END) as total_credits,
        SUM(CASE WHEN transaction_type = 'DEBIT' THEN 1 ELSE 0 END) as total_debits,
        SUM(CASE WHEN transaction_type = 'CREDIT' THEN amount ELSE 0 END) as total_credit_amount,
        SUM(CASE WHEN transaction_type = 'DEBIT' THEN ABS(amount) ELSE 0 END) as total_debit_amount,
        SUM(CASE WHEN payment_method = 'COMMISSION' THEN amount ELSE 0 END) as total_commission,
        MAX(balance_after) as current_balance
      FROM wallet_transactions
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
        console.error("Error fetching wallet stats:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Get current wallet balance
exports.getCurrentBalance = async (userId) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
      SELECT balance_after as current_balance
      FROM wallet_transactions
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 1
    `);

        const result = stmt.get(userId);
        return result ? result.current_balance : 0;
    } catch (error) {
        console.error("Error fetching current balance:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Get balance history (daily)
exports.getBalanceHistory = async (userId, days = 30) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
      SELECT 
        DATE(created_at) as date,
        MAX(balance_after) as closing_balance,
        MIN(balance_before) as opening_balance,
        SUM(CASE WHEN transaction_type = 'CREDIT' THEN amount ELSE 0 END) as credits,
        SUM(CASE WHEN transaction_type = 'DEBIT' THEN ABS(amount) ELSE 0 END) as debits
      FROM wallet_transactions
      WHERE user_id = ? AND created_at >= datetime('now', '-' || ? || ' days')
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);

        return stmt.all(userId, days);
    } catch (error) {
        console.error("Error fetching balance history:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Get payment method breakdown
exports.getPaymentMethodBreakdown = async (userId, filters = {}) => {
    const db = new Database(dbPath);

    try {
        let query = `
      SELECT 
        payment_method,
        COUNT(*) as count,
        SUM(amount) as total_amount
      FROM wallet_transactions
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

        query += ` GROUP BY payment_method ORDER BY total_amount DESC`;

        const stmt = db.prepare(query);
        return stmt.all(...params);
    } catch (error) {
        console.error("Error fetching payment method breakdown:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Create wallet transaction
exports.createWalletTransaction = async (data) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
      INSERT INTO wallet_transactions 
      (user_id, transaction_type, amount, balance_before, balance_after, description, payment_method, payment_reference, status, related_transaction_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        const result = stmt.run(
            data.user_id,
            data.transaction_type,
            data.amount,
            data.balance_before,
            data.balance_after,
            data.description || null,
            data.payment_method || 'WALLET',
            data.payment_reference || null,
            data.status || 'SUCCESS',
            data.related_transaction_id || null
        );

        return { id: result.lastInsertRowid, ...data };
    } catch (error) {
        console.error("Error creating wallet transaction:", error);
        throw error;
    } finally {
        db.close();
    }
};
