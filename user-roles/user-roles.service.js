const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "..", "samypay.db");

// Get all roles
exports.getAllRoles = async (filters = {}) => {
    const db = new Database(dbPath);

    try {
        let query = `
            SELECT r.*, (SELECT COUNT(*) FROM users WHERE users.role_id = r.id) as user_count 
            FROM roles r 
            WHERE 1=1
        `;
        const params = [];

        if (filters.is_active !== undefined) {
            query += ` AND r.is_active = ?`;
            params.push(filters.is_active);
        }

        query += ` ORDER BY r.commission_multiplier DESC`;

        const stmt = db.prepare(query);
        return stmt.all(...params);
    } catch (error) {
        console.error("Error fetching roles:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Get role by ID
exports.getRoleById = async (id) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`SELECT * FROM roles WHERE id = ?`);
        return stmt.get(id);
    } catch (error) {
        console.error("Error fetching role:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Get role by code
exports.getRoleByCode = async (code) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`SELECT * FROM roles WHERE role_code = ?`);
        return stmt.get(code);
    } catch (error) {
        console.error("Error fetching role by code:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Get role permissions
exports.getRolePermissions = async (roleId) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
      SELECT permission_name, permission_value 
      FROM user_role_permissions 
      WHERE role_id = ?
    `);
        return stmt.all(roleId);
    } catch (error) {
        console.error("Error fetching role permissions:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Create role
exports.createRole = async (data) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
      INSERT INTO roles 
      (role_name, role_code, description, commission_multiplier, can_add_users, can_manage_commissions, can_view_reports, can_manage_services, max_transaction_limit, daily_transaction_limit, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        const result = stmt.run(
            data.role_name,
            data.role_code,
            data.description || null,
            data.commission_multiplier || 1.0,
            data.can_add_users || 0,
            data.can_manage_commissions || 0,
            data.can_view_reports !== undefined ? data.can_view_reports : 1,
            data.can_manage_services || 0,
            data.max_transaction_limit || null,
            data.daily_transaction_limit || null,
            data.is_active !== undefined ? data.is_active : 1
        );

        return { id: result.lastInsertRowid, ...data };
    } catch (error) {
        console.error("Error creating role:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Update role
exports.updateRole = async (id, data) => {
    const db = new Database(dbPath);

    try {
        // Brute-force ensure columns exist before update
        // (SQLite allows ADD COLUMN IF NOT EXISTS in newer versions, but we use try-catch for safety on older ones)
        const colsToAdd = [
            "ALTER TABLE roles ADD COLUMN role_code VARCHAR(20) DEFAULT 'USER'",
            "ALTER TABLE roles ADD COLUMN description TEXT",
            "ALTER TABLE roles ADD COLUMN commission_multiplier DECIMAL(5, 2) DEFAULT 1.0",
            "ALTER TABLE roles ADD COLUMN can_add_users BOOLEAN DEFAULT 0",
            "ALTER TABLE roles ADD COLUMN can_manage_commissions BOOLEAN DEFAULT 0",
            "ALTER TABLE roles ADD COLUMN can_view_reports BOOLEAN DEFAULT 1",
            "ALTER TABLE roles ADD COLUMN can_manage_services BOOLEAN DEFAULT 0",
            "ALTER TABLE roles ADD COLUMN max_transaction_limit DECIMAL(10, 2)",
            "ALTER TABLE roles ADD COLUMN daily_transaction_limit DECIMAL(10, 2)",
            "ALTER TABLE roles ADD COLUMN is_active BOOLEAN DEFAULT 1",
            "ALTER TABLE roles ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
            "ALTER TABLE roles ADD COLUMN updated_at TIMESTAMP"
        ];

        for (const sql of colsToAdd) {
            try {
                db.exec(sql);
            } catch (e) {
                // Ignore "duplicate column name" errors
            }
        }

        const stmt = db.prepare(`
                UPDATE roles
                SET role_name = ?, description = ?, commission_multiplier = ?, 
                    can_add_users = ?, can_manage_commissions = ?, can_view_reports = ?, 
                    can_manage_services = ?, max_transaction_limit = ?, daily_transaction_limit = ?, 
                    is_active = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `);


        stmt.run(
            data.role_name,
            data.description,
            data.commission_multiplier,
            data.can_add_users,
            data.can_manage_commissions,
            data.can_view_reports,
            data.can_manage_services,
            data.max_transaction_limit,
            data.daily_transaction_limit,
            data.is_active,
            id
        );

        return true;
    } catch (error) {
        console.error("Error updating role:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Delete role
exports.deleteRole = async (id) => {
    const db = new Database(dbPath);

    try {
        // Check if any users have this role
        const checkStmt = db.prepare(`SELECT COUNT(*) as count FROM users WHERE role_id = ?`);
        const result = checkStmt.get(id);

        if (result.count > 0) {
            throw new Error(`Cannot delete role: ${result.count} users are assigned to this role`);
        }

        // Delete permissions first
        const deletePermsStmt = db.prepare(`DELETE FROM user_role_permissions WHERE role_id = ?`);
        deletePermsStmt.run(id);

        // Delete role
        const deleteRoleStmt = db.prepare(`DELETE FROM roles WHERE id = ?`);
        deleteRoleStmt.run(id);

        return true;
    } catch (error) {
        console.error("Error deleting role:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Add permission to role
exports.addPermission = async (roleId, permissionName, permissionValue = 1) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
      INSERT OR REPLACE INTO user_role_permissions (role_id, permission_name, permission_value)
      VALUES (?, ?, ?)
    `);

        stmt.run(roleId, permissionName, permissionValue);
        return true;
    } catch (error) {
        console.error("Error adding permission:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Remove permission from role
exports.removePermission = async (roleId, permissionName) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
      DELETE FROM user_role_permissions 
      WHERE role_id = ? AND permission_name = ?
    `);

        stmt.run(roleId, permissionName);
        return true;
    } catch (error) {
        console.error("Error removing permission:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Get users by role
exports.getUsersByRole = async (roleId) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
      SELECT id, name, mobile, email, created_at 
      FROM users 
      WHERE role_id = ?
      ORDER BY created_at DESC
    `);

        return stmt.all(roleId);
    } catch (error) {
        console.error("Error fetching users by role:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Get role statistics
exports.getRoleStats = async () => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
      SELECT 
        r.id,
        r.role_name,
        r.role_code,
        r.commission_multiplier,
        COUNT(u.id) as user_count
      FROM roles r
      LEFT JOIN users u ON u.role_id = r.id
      WHERE r.is_active = 1
      GROUP BY r.id
      ORDER BY r.commission_multiplier DESC
    `);

        return stmt.all();
    } catch (error) {
        console.error("Error fetching role stats:", error);
        throw error;
    } finally {
        db.close();
    }
};
