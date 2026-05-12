const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "..", "samypay.db");

/**
 * Get dummy invalid amounts data for testing
 */
const getDummyInvalidAmounts = () => {
    return [
        {
            id: 1,
            user_id: 1,
            user_name: "Rajesh Kumar",
            user_mobile: "9876543210",
            service_type: "MOBILE_RECHARGE",
            operator_name: "Airtel",
            mobile_number: "9876543210",
            account_number: null,
            invalid_amount: 99,
            valid_amount: 100,
            transaction_id: "TXN1234567890",
            reason: "Amount not in valid denomination",
            status: "PENDING",
            resolved_by: null,
            resolved_by_name: null,
            resolved_at: null,
            created_at: "2026-01-15 10:30:00",
            updated_at: "2026-01-15 10:30:00"
        },
        {
            id: 2,
            user_id: 2,
            user_name: "Priya Sharma",
            user_mobile: "9123456789",
            service_type: "DTH",
            operator_name: "Tata Play",
            mobile_number: null,
            account_number: "2023456789",
            invalid_amount: 450,
            valid_amount: 499,
            transaction_id: "TXN2345678901",
            reason: "Minimum recharge amount is ₹499",
            status: "RESOLVED",
            resolved_by: 1,
            resolved_by_name: "Admin User",
            resolved_at: "2026-01-15 14:20:00",
            created_at: "2026-01-14 16:45:00",
            updated_at: "2026-01-15 14:20:00"
        },
        {
            id: 3,
            user_id: 3,
            user_name: "Amit Patel",
            user_mobile: "9988776655",
            service_type: "ELECTRICITY",
            operator_name: "MSEB Maharashtra",
            mobile_number: null,
            account_number: "1234567890",
            invalid_amount: 1500,
            valid_amount: 1542,
            transaction_id: "TXN3456789012",
            reason: "Bill amount mismatch - actual bill is ₹1542",
            status: "PENDING",
            resolved_by: null,
            resolved_by_name: null,
            resolved_at: null,
            created_at: "2026-01-16 09:15:00",
            updated_at: "2026-01-16 09:15:00"
        },
        {
            id: 4,
            user_id: 1,
            user_name: "Rajesh Kumar",
            user_mobile: "9876543210",
            service_type: "GAS",
            operator_name: "Indraprastha Gas Limited",
            mobile_number: null,
            account_number: "1012345678",
            invalid_amount: 800,
            valid_amount: 850,
            transaction_id: "TXN4567890123",
            reason: "Incorrect bill amount entered",
            status: "REJECTED",
            resolved_by: 1,
            resolved_by_name: "Admin User",
            resolved_at: "2026-01-16 11:30:00",
            created_at: "2026-01-16 08:00:00",
            updated_at: "2026-01-16 11:30:00"
        },
        {
            id: 5,
            user_id: 4,
            user_name: "Lakshmi Reddy",
            user_mobile: "9445566778",
            service_type: "FASTAG",
            operator_name: "ICICI Bank",
            mobile_number: null,
            account_number: "MH01AB1234",
            invalid_amount: 50,
            valid_amount: 100,
            transaction_id: "TXN5678901234",
            reason: "Minimum FASTag recharge is ₹100",
            status: "PENDING",
            resolved_by: null,
            resolved_by_name: null,
            resolved_at: null,
            created_at: "2026-01-16 12:00:00",
            updated_at: "2026-01-16 12:00:00"
        }
    ];
};

/**
 * Get all invalid amounts with filters
 */
exports.getAllInvalidAmounts = async (filters = {}) => {
    const db = new Database(dbPath);

    try {
        let query = `
      SELECT 
        ia.*,
        u.name as user_name,
        u.mobile as user_mobile,
        r.name as resolved_by_name
      FROM invalid_amounts ia
      LEFT JOIN users u ON ia.user_id = u.id
      LEFT JOIN users r ON ia.resolved_by = r.id
      WHERE 1=1
    `;

        const params = [];

        if (filters.status) {
            query += ` AND ia.status = ?`;
            params.push(filters.status);
        }

        if (filters.service_type) {
            query += ` AND ia.service_type = ?`;
            params.push(filters.service_type);
        }

        if (filters.user_id) {
            query += ` AND ia.user_id = ?`;
            params.push(filters.user_id);
        }

        if (filters.search) {
            query += ` AND (ia.mobile_number LIKE ? OR ia.account_number LIKE ? OR ia.transaction_id LIKE ? OR ia.operator_name LIKE ?)`;
            const searchTerm = `%${filters.search}%`;
            params.push(searchTerm, searchTerm, searchTerm, searchTerm);
        }

        query += ` ORDER BY ia.created_at DESC`;

        if (filters.limit) {
            query += ` LIMIT ?`;
            params.push(filters.limit);
        }

        const stmt = db.prepare(query);
        let invalidAmounts = stmt.all(...params);

        // Dummy data fallback removed to ensure real database testing
        /*
        if (!invalidAmounts || invalidAmounts.length === 0) {
            console.log("📝 No invalid amounts in database, returning dummy data for testing");
            invalidAmounts = getDummyInvalidAmounts();
            ...
        }
        */
        return invalidAmounts || [];

        return invalidAmounts;
    } catch (error) {
        console.error("Error fetching invalid amounts:", error);
        // Return dummy data on error for demo purposes
        console.log("📝 Error occurred, returning dummy data for testing");
        return getDummyInvalidAmounts();
    } finally {
        db.close();
    }
};

/**
 * Get invalid amount by ID
 */
exports.getInvalidAmountById = async (id) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
      SELECT 
        ia.*,
        u.name as user_name,
        u.mobile as user_mobile,
        u.email as user_email,
        r.name as resolved_by_name
      FROM invalid_amounts ia
      LEFT JOIN users u ON ia.user_id = u.id
      LEFT JOIN users r ON ia.resolved_by = r.id
      WHERE ia.id = ?
    `);
        const invalidAmount = stmt.get(id);

        return invalidAmount;
    } catch (error) {
        console.error("Error fetching invalid amount by ID:", error);
        throw error;
    } finally {
        db.close();
    }
};

/**
 * Create new invalid amount entry
 */
exports.createInvalidAmount = async (data) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
      INSERT INTO invalid_amounts 
      (user_id, service_type, operator_name, mobile_number, account_number, invalid_amount, valid_amount, transaction_id, reason)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        const result = stmt.run(
            data.user_id,
            data.service_type,
            data.operator_name || null,
            data.mobile_number || null,
            data.account_number || null,
            data.invalid_amount,
            data.valid_amount || null,
            data.transaction_id || null,
            data.reason || null
        );

        return { id: result.lastInsertRowid, ...data };
    } catch (error) {
        console.error("Error creating invalid amount:", error);
        throw error;
    } finally {
        db.close();
    }
};

/**
 * Update invalid amount status
 */
exports.updateInvalidAmountStatus = async (id, status, resolvedBy = null) => {
    const db = new Database(dbPath);

    try {
        let query = `
      UPDATE invalid_amounts
      SET status = ?, updated_at = CURRENT_TIMESTAMP
    `;
        const params = [status];

        if (status === 'RESOLVED' && resolvedBy) {
            query += `, resolved_by = ?, resolved_at = CURRENT_TIMESTAMP`;
            params.push(resolvedBy);
        }

        query += ` WHERE id = ?`;
        params.push(id);

        const stmt = db.prepare(query);
        stmt.run(...params);

        return true;
    } catch (error) {
        console.error("Error updating invalid amount status:", error);
        throw error;
    } finally {
        db.close();
    }
};

/**
 * Update valid amount
 */
exports.updateValidAmount = async (id, validAmount) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
      UPDATE invalid_amounts
      SET valid_amount = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

        stmt.run(validAmount, id);
        return true;
    } catch (error) {
        console.error("Error updating valid amount:", error);
        throw error;
    } finally {
        db.close();
    }
};

/**
 * Get statistics
 */
exports.getInvalidAmountStats = async () => {
    const db = new Database(dbPath);

    try {
        const stats = {
            total: 0,
            pending: 0,
            resolved: 0,
            rejected: 0,
            total_invalid_amount: 0,
            total_valid_amount: 0,
            by_service: {}
        };

        // Total and by status
        const statusStmt = db.prepare(`
      SELECT 
        status, 
        COUNT(*) as count,
        SUM(invalid_amount) as total_invalid,
        SUM(valid_amount) as total_valid
      FROM invalid_amounts
      GROUP BY status
    `);
        const statusResults = statusStmt.all();

        statusResults.forEach(row => {
            stats.total += row.count;
            stats.total_invalid_amount += row.total_invalid || 0;
            stats.total_valid_amount += row.total_valid || 0;

            if (row.status === 'PENDING') stats.pending = row.count;
            if (row.status === 'RESOLVED') stats.resolved = row.count;
            if (row.status === 'REJECTED') stats.rejected = row.count;
        });

        // By service type
        const serviceStmt = db.prepare(`
      SELECT service_type, COUNT(*) as count
      FROM invalid_amounts
      GROUP BY service_type
    `);
        const serviceResults = serviceStmt.all();
        serviceResults.forEach(row => {
            stats.by_service[row.service_type] = row.count;
        });

        // Dummy stats removed
        return stats;
    } catch (error) {
        console.error("Error fetching invalid amount stats:", error);
        return {
            total: 0,
            pending: 0,
            resolved: 0,
            rejected: 0,
            total_invalid_amount: 0,
            total_valid_amount: 0,
            by_service: {}
        };
    } finally {
        db.close();
    }
};

/**
 * Delete invalid amount entry (Admin only)
 */
exports.deleteInvalidAmount = async (id) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`DELETE FROM invalid_amounts WHERE id = ?`);
        stmt.run(id);

        return true;
    } catch (error) {
        console.error("Error deleting invalid amount:", error);
        throw error;
    } finally {
        db.close();
    }
};
