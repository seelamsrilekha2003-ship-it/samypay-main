const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "..", "samypay.db");

// Get all news with filters
exports.getAllNews = async (filters = {}) => {
    const db = new Database(dbPath);

    try {
        let query = `SELECT * FROM news WHERE 1=1`;
        const params = [];

        if (filters.category) {
            query += ` AND category = ?`;
            params.push(filters.category);
        }

        if (filters.is_featured !== undefined) {
            query += ` AND is_featured = ?`;
            params.push(filters.is_featured);
        }

        if (filters.is_published !== undefined) {
            query += ` AND is_published = ?`;
            params.push(filters.is_published);
        }

        if (filters.search) {
            query += ` AND (title LIKE ? OR content LIKE ? OR summary LIKE ?)`;
            const searchTerm = `%${filters.search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        query += ` ORDER BY is_featured DESC, publish_date DESC`;

        if (filters.limit) {
            query += ` LIMIT ?`;
            params.push(filters.limit);
        }

        const stmt = db.prepare(query);
        const news = stmt.all(...params);

        return news;
    } catch (error) {
        console.error("Error fetching news:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Get news by ID
exports.getNewsById = async (id) => {
    const db = new Database(dbPath);

    try {
        // Increment views
        const updateStmt = db.prepare(`
      UPDATE news SET views = views + 1 WHERE id = ?
    `);
        updateStmt.run(id);

        // Get news
        const stmt = db.prepare(`SELECT * FROM news WHERE id = ?`);
        return stmt.get(id);
    } catch (error) {
        console.error("Error fetching news:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Create news
exports.createNews = async (data) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
      INSERT INTO news 
      (title, content, summary, category, image_url, is_featured, is_published, publish_date, author_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        const result = stmt.run(
            data.title,
            data.content,
            data.summary || null,
            data.category || 'GENERAL',
            data.image_url || null,
            data.is_featured || 0,
            data.is_published !== undefined ? data.is_published : 1,
            data.publish_date || new Date().toISOString(),
            data.author_id || null
        );

        return { id: result.lastInsertRowid, ...data };
    } catch (error) {
        console.error("Error creating news:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Update news
exports.updateNews = async (id, data) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
      UPDATE news
      SET title = ?, content = ?, summary = ?, category = ?, image_url = ?, 
          is_featured = ?, is_published = ?, publish_date = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

        stmt.run(
            data.title,
            data.content,
            data.summary,
            data.category,
            data.image_url,
            data.is_featured,
            data.is_published,
            data.publish_date,
            id
        );

        return true;
    } catch (error) {
        console.error("Error updating news:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Toggle featured status
exports.toggleFeatured = async (id) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
      UPDATE news
      SET is_featured = NOT is_featured, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

        stmt.run(id);
        return true;
    } catch (error) {
        console.error("Error toggling featured status:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Toggle published status
exports.togglePublished = async (id) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
      UPDATE news
      SET is_published = NOT is_published, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

        stmt.run(id);
        return true;
    } catch (error) {
        console.error("Error toggling published status:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Delete news
exports.deleteNews = async (id) => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`DELETE FROM news WHERE id = ?`);
        stmt.run(id);
        return true;
    } catch (error) {
        console.error("Error deleting news:", error);
        throw error;
    } finally {
        db.close();
    }
};

// Get statistics
exports.getNewsStats = async () => {
    const db = new Database(dbPath);

    try {
        const stmt = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN is_published = 1 THEN 1 ELSE 0 END) as published,
        SUM(CASE WHEN is_featured = 1 THEN 1 ELSE 0 END) as featured,
        SUM(views) as total_views
      FROM news
    `);

        return stmt.get();
    } catch (error) {
        console.error("Error fetching news stats:", error);
        throw error;
    } finally {
        db.close();
    }
};
