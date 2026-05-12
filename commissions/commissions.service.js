const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "..", "samypay.db");

// Get all commissions with filters
exports.getAllCommissions = async (filters = {}) => {
    const db = new Database(dbPath);

    try {
        let query = `SELECT * FROM commissions WHERE 1=1`;
        const params = [];

        if (filters.service_type) {
            query += ` AND service_type = ?`;
            params.push(filters.service_type);
        }

        if (filters.operator_name) {
            query += ` AND operator_name = ?`;
            params.push(filters.operator_name);
        }

        if (filters.user_role) {
            query += ` AND user_role = ?`;
            params.push(filters.user_role);
        }

        if (filters.is_active !== undefined) {
            query += ` AND is_active = ?`;
            params.push(filters.is_active);
        }

        query += ` ORDER BY service_type, operator_name, min_amount`;

        const stmt = db.prepare(query);
        return stmt.all(...params);
    } catch (error) {
        console.error("Error fetching commissions:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Get commission by ID
exports.getCommissionById = async (id) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`SELECT * FROM commissions WHERE id = ?`);
        return stmt.get(id);
    } catch (error) {
        console.error("Error fetching commission:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Create commission
exports.createCommission = async (data) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
      INSERT INTO commissions 
      (service_type, operator_name, plan_type, min_amount, max_amount, commission_type, commission_value, user_role, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        const result = stmt.run(
            data.service_type,
            data.operator_name || null,
            data.plan_type || null,
            data.min_amount || 0,
            data.max_amount || null,
            data.commission_type || 'PERCENTAGE',
            data.commission_value,
            data.user_role || 'RETAILER',
            data.is_active !== undefined ? data.is_active : 1
        );

        return { id: result.lastInsertRowid, ...data };
    } catch (error) {
        console.error("Error creating commission:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Update commission
exports.updateCommission = async (id, data) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
      UPDATE commissions
      SET service_type = ?, operator_name = ?, plan_type = ?, min_amount = ?, max_amount = ?, 
          commission_type = ?, commission_value = ?, user_role = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

        stmt.run(
            data.service_type,
            data.operator_name,
            data.plan_type,
            data.min_amount,
            data.max_amount,
            data.commission_type,
            data.commission_value,
            data.user_role,
            data.is_active,
            id
        );

        return true;
    } catch (error) {
        console.error("Error updating commission:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Toggle commission status
exports.toggleCommissionStatus = async (id) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
      UPDATE commissions
      SET is_active = NOT is_active, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

        stmt.run(id);
        return true;
    } catch (error) {
        console.error("Error toggling commission status:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Delete commission
exports.deleteCommission = async (id) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`DELETE FROM commissions WHERE id = ?`);
        stmt.run(id);
        return true;
    } catch (error) {
        console.error("Error deleting commission:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Get statistics
exports.getCommissionStats = async () => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN commission_type = 'PERCENTAGE' THEN 1 ELSE 0 END) as percentage_based,
        SUM(CASE WHEN commission_type = 'FLAT' THEN 1 ELSE 0 END) as flat_based
      FROM commissions
    `);

        return stmt.get();
    } catch (error) {
        console.error("Error fetching commission stats:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Calculate commission for a transaction
exports.calculateCommission = async (serviceType, operatorName, amount, userRole = 'RETAILER') => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
            SELECT *
            FROM commissions
            WHERE service_type = ?
              AND operator_name = ?
              AND user_role = ?
              AND is_active = 1
            ORDER BY min_amount DESC
            LIMIT 1
        `);

        const commission = stmt.get(serviceType, operatorName, userRole);

        if (!commission) {
            return { commission: 0, rate: 0, type: null };
        }

        let commissionAmount = 0;
        if (commission.commission_type === 'PERCENTAGE') {
            commissionAmount = (amount * commission.commission_value) / 100;
        } else {
            commissionAmount = commission.commission_value;
        }

        return {
            commission: commissionAmount,
            rate: commission.commission_value,
            type: commission.commission_type,
            provider_key: commission.provider_key
        };
    } finally {
        db.close();
    }
};

exports.getMyCommissions = async ({ user_role, search }) => {
    const db = new Database(dbPath);

    try {
        let query = `
            SELECT
              c.id,
              c.service_type,
              c.operator_name AS service_provider,
              c.provider_key,
              c.commission_value AS margin,
              CASE
                WHEN c.is_active = 1 THEN 'Active'
                ELSE 'Inactive'
              END AS status
            FROM commissions c
            WHERE c.user_role = ?
              AND c.is_active = 1
        `;

        const params = [user_role];

        if (search) {
            query += ` AND (
                c.operator_name LIKE ? OR
                c.service_type LIKE ? OR
                c.provider_key LIKE ?
            )`;
            params.push('%' + search + '%', '%' + search + '%', '%' + search + '%');
        }

        query += ` ORDER BY c.service_type, c.operator_name`;

        return db.prepare(query).all(...params);
    } catch (error) {
        console.error('Error fetching my commissions:', error);
        throw error;
    } finally {
        db.close();
    }
};
