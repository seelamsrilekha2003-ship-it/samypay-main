const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "..", "samypay.db");

// Get all banners with filters
exports.getAllBanners = async (filters = {}) => {
    const db = new Database(dbPath);

    try {
        let query = `SELECT * FROM banners WHERE 1=1`;
        const params = [];

        if (filters.position) {
            query += ` AND position = ?`;
            params.push(filters.position);
        }

        if (filters.is_active !== undefined) {
            query += ` AND is_active = ?`;
            params.push(filters.is_active);
        }

        if (filters.search) {
            query += ` AND (title LIKE ? OR description LIKE ?)`;
            const searchTerm = `%${filters.search}%`;
            params.push(searchTerm, searchTerm);
        }

        query += ` ORDER BY display_order ASC, created_at DESC`;

        const stmt = db.prepare(query);
        const banners = stmt.all(...params);

        return banners;
    } catch (error) {
        console.error("Error fetching banners:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Get banner by ID
exports.getBannerById = async (id) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`SELECT * FROM banners WHERE id = ?`);
        return stmt.get(id);
    } catch (error) {
        console.error("Error fetching banner:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Create banner
exports.createBanner = async (data) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
      INSERT INTO banners 
      (title, description, image_url, link_url, position, display_order, is_active, start_date, end_date, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        const result = stmt.run(
            data.title,
            data.description || null,
            data.image_url,
            data.link_url || null,
            data.position || 'HOME',
            data.display_order || 0,
            data.is_active !== undefined ? data.is_active : 1,
            data.start_date || null,
            data.end_date || null,
            data.created_by || null
        );

        return { id: result.lastInsertRowid, ...data };
    } catch (error) {
        console.error("Error creating banner:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Update banner
exports.updateBanner = async (id, data) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
      UPDATE banners
      SET title = ?, description = ?, image_url = ?, link_url = ?, position = ?, 
          display_order = ?, is_active = ?, start_date = ?, end_date = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

        stmt.run(
            data.title,
            data.description,
            data.image_url,
            data.link_url,
            data.position,
            data.display_order,
            data.is_active,
            data.start_date,
            data.end_date,
            id
        );

        return true;
    } catch (error) {
        console.error("Error updating banner:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Toggle banner status
exports.toggleBannerStatus = async (id) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
      UPDATE banners
      SET is_active = NOT is_active, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

        stmt.run(id);
        return true;
    } catch (error) {
        console.error("Error toggling banner status:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Delete banner
exports.deleteBanner = async (id) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`DELETE FROM banners WHERE id = ?`);
        stmt.run(id);
        return true;
    } catch (error) {
        console.error("Error deleting banner:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Get statistics
exports.getBannerStats = async () => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) as inactive
      FROM banners
    `);

        return stmt.get();
    } catch (error) {
        console.error("Error fetching banner stats:", error);
        throw error;
    } finally {
        db.close();
    }
};
