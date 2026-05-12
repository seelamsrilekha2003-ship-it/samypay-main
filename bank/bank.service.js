const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "..", "samypay.db");

/**
 * Get all bank accounts for a user
 */
exports.getBankAccounts = async (userId) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
      SELECT * FROM bank_accounts
      WHERE user_id = ?
      ORDER BY is_primary DESC, created_at DESC
    `);
        const accounts = stmt.all(userId);

        return accounts;
    } catch (error) {
        console.error("Error fetching bank accounts:", error);
        throw error;
    } finally {
        db.close();
    }
};

/**
 * Get bank account by ID
 */
exports.getBankAccountById = async (id, userId) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
      SELECT * FROM bank_accounts
      WHERE id = ? AND user_id = ?
    `);
        const account = stmt.get(id, userId);

        return account;
    } catch (error) {
        console.error("Error fetching bank account by ID:", error);
        throw error;
    } finally {
        db.close();
    }
};

/**
 * Create new bank account
 */
exports.createBankAccount = async (data) => {
    const db = new Database(dbPath);

    try {
        // If this is set as primary, unset other primary accounts
        if (data.is_primary) {
            const updateStmt = db.prepare(`
        UPDATE bank_accounts
        SET is_primary = 0
        WHERE user_id = ?
      `);
            updateStmt.run(data.user_id);
        }

        const stmt = db.prepare(`
      INSERT INTO bank_accounts 
      (user_id, bank_name, account_number, ifsc_code, account_holder_name, account_type, branch_name, is_primary)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

        const result = stmt.run(
            data.user_id,
            data.bank_name,
            data.account_number,
            data.ifsc_code,
            data.account_holder_name,
            data.account_type || 'SAVINGS',
            data.branch_name || null,
            data.is_primary || 0
        );

        return { id: result.lastInsertRowid, ...data };
    } catch (error) {
        console.error("Error creating bank account:", error);
        throw error;
    } finally {
        db.close();
    }
};

/**
 * Update bank account
 */
exports.updateBankAccount = async (id, userId, data) => {
    const db = new Database(dbPath);

    try {
        // If setting as primary, unset other primary accounts
        if (data.is_primary) {
            const updateStmt = db.prepare(`
        UPDATE bank_accounts
        SET is_primary = 0
        WHERE user_id = ?
      `);
            updateStmt.run(userId);
        }

        const stmt = db.prepare(`
      UPDATE bank_accounts
      SET bank_name = ?, account_number = ?, ifsc_code = ?, account_holder_name = ?, 
          account_type = ?, branch_name = ?, is_primary = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `);

        stmt.run(
            data.bank_name,
            data.account_number,
            data.ifsc_code,
            data.account_holder_name,
            data.account_type,
            data.branch_name,
            data.is_primary,
            id,
            userId
        );

        return true;
    } catch (error) {
        console.error("Error updating bank account:", error);
        throw error;
    } finally {
        db.close();
    }
};

/**
 * Set primary bank account
 */
exports.setPrimaryAccount = async (id, userId) => {
    const db = new Database(dbPath);

    try {
        // Unset all primary accounts for this user
        const updateAllStmt = db.prepare(`
      UPDATE bank_accounts
      SET is_primary = 0
      WHERE user_id = ?
    `);
        updateAllStmt.run(userId);

        // Set this account as primary
        const updateStmt = db.prepare(`
      UPDATE bank_accounts
      SET is_primary = 1, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `);
        updateStmt.run(id, userId);

        return true;
    } catch (error) {
        console.error("Error setting primary account:", error);
        throw error;
    } finally {
        db.close();
    }
};

/**
 * Update account status
 */
exports.updateAccountStatus = async (id, userId, status) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
      UPDATE bank_accounts
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `);

        stmt.run(status, id, userId);
        return true;
    } catch (error) {
        console.error("Error updating account status:", error);
        throw error;
    } finally {
        db.close();
    }
};

/**
 * Verify account (Admin only)
 */
exports.verifyAccount = async (id) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
      UPDATE bank_accounts
      SET is_verified = 1, status = 'ACTIVE', updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

        stmt.run(id);
        return true;
    } catch (error) {
        console.error("Error verifying account:", error);
        throw error;
    } finally {
        db.close();
    }
};

/**
 * Delete bank account
 */
exports.deleteBankAccount = async (id, userId) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
      DELETE FROM bank_accounts 
      WHERE id = ? AND user_id = ?
    `);

        stmt.run(id, userId);
        return true;
    } catch (error) {
        console.error("Error deleting bank account:", error);
        throw error;
    } finally {
        db.close();
    }
};

/**
 * Get statistics
 */
exports.getBankStats = async (userId) => {
    const db = new Database(dbPath);

    try {
        const stats = {
            total: 0,
            verified: 0,
            pending: 0,
            active: 0
        };

        const stmt = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN is_verified = 1 THEN 1 ELSE 0 END) as verified,
        SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'ACTIVE' THEN 1 ELSE 0 END) as active
      FROM bank_accounts
      WHERE user_id = ?
    `);

        const result = stmt.get(userId);
        return result || stats;
    } catch (error) {
        console.error("Error fetching bank stats:", error);
        throw error;
    } finally {
        db.close();
    }
};
