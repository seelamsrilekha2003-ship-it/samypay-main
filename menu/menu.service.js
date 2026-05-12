const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "..", "samypay.db");

// Get menu for user based on role
exports.getUserMenu = async (userId) => {
    const db = new Database(dbPath);

    try {
        // Get user's role
        const userStmt = db.prepare(`SELECT role_id FROM users WHERE id = ?`);
        const user = userStmt.get(userId);

        if (!user || !user.role_id) {
            return [];
        }

        // Get accessible menus for this role
        const menuStmt = db.prepare(`
      SELECT DISTINCT m.*, rma.can_view, rma.can_create, rma.can_edit, rma.can_delete
      FROM menu_items m
      INNER JOIN role_menu_access rma ON m.id = rma.menu_id
      WHERE rma.role_id = ? AND m.is_active = 1 AND rma.can_view = 1
      ORDER BY m.display_order ASC
    `);

        const menus = menuStmt.all(user.role_id);

        // Organize into parent-child structure
        const menuTree = [];
        const menuMap = {};

        menus.forEach(menu => {
            menuMap[menu.id] = { ...menu, children: [] };
        });

        menus.forEach(menu => {
            if (menu.parent_id === null) {
                menuTree.push(menuMap[menu.id]);
            } else if (menuMap[menu.parent_id]) {
                menuMap[menu.parent_id].children.push(menuMap[menu.id]);
            }
        });

        return menuTree;
    } catch (error) {
        console.error("Error fetching user menu:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Get all menu items
exports.getAllMenuItems = async () => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
      SELECT * FROM menu_items 
      ORDER BY parent_id NULLS FIRST, display_order ASC
    `);
        return stmt.all();
    } catch (error) {
        console.error("Error fetching menu items:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Get role menu access
exports.getRoleMenuAccess = async (roleId) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
      SELECT m.*, rma.can_view, rma.can_create, rma.can_edit, rma.can_delete
      FROM menu_items m
      LEFT JOIN role_menu_access rma ON m.id = rma.menu_id AND rma.role_id = ?
      ORDER BY m.parent_id NULLS FIRST, m.display_order ASC
    `);
        return stmt.all(roleId);
    } catch (error) {
        console.error("Error fetching role menu access:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Update role menu access
exports.updateRoleMenuAccess = async (roleId, menuId, permissions) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
      INSERT OR REPLACE INTO role_menu_access 
      (role_id, menu_id, can_view, can_create, can_edit, can_delete)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

        stmt.run(
            roleId,
            menuId,
            permissions.can_view !== undefined ? permissions.can_view : 1,
            permissions.can_create !== undefined ? permissions.can_create : 0,
            permissions.can_edit !== undefined ? permissions.can_edit : 0,
            permissions.can_delete !== undefined ? permissions.can_delete : 0
        );

        return true;
    } catch (error) {
        console.error("Error updating role menu access:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Check user permission for specific menu
exports.checkUserPermission = async (userId, menuCode, action = 'view') => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
      SELECT rma.*
      FROM users u
      INNER JOIN role_menu_access rma ON u.role_id = rma.role_id
      INNER JOIN menu_items m ON rma.menu_id = m.id
      WHERE u.id = ? AND m.menu_code = ?
    `);

        const access = stmt.get(userId, menuCode);

        if (!access) return false;

        switch (action) {
            case 'view': return access.can_view === 1;
            case 'create': return access.can_create === 1;
            case 'edit': return access.can_edit === 1;
            case 'delete': return access.can_delete === 1;
            default: return false;
        }
    } catch (error) {
        console.error("Error checking user permission:", error);
        return false;
    } finally {
        db.close();
    }
};
