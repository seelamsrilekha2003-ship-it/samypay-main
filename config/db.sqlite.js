const Database = require("better-sqlite3");
const path = require("path");

// Create SQLite database file in backend directory
const dbPath = path.join(__dirname, "..", "samypay.db");
const db = new Database(dbPath);

// Enable foreign keys
db.pragma("foreign_keys = ON");

// Wrapper to provide promise-like interface similar to mysql2
const dbWrapper = {
    promise: () => ({
        query: (sql, params = []) => {
            console.log(`[DB QUERY]: ${sql.substring(0, 100)}${sql.length > 100 ? '...' : ''} | PARAMS: ${JSON.stringify(params)}`);
            return new Promise((resolve, reject) => {
                try {
                    if (sql.trim().toUpperCase().startsWith("SELECT") || sql.trim().toUpperCase().startsWith("PRAGMA")) {

                        const stmt = db.prepare(sql);
                        const rows = params.length > 0 ? stmt.all(...params) : stmt.all();
                        resolve([rows]);
                    } else {
                        const stmt = db.prepare(sql);
                        const result = params.length > 0 ? stmt.run(...params) : stmt.run();
                        console.log(`[DB SUCCESS]: Affected rows: ${result.changes}`);
                        resolve([result]);
                    }
                } catch (err) {
                    console.error(`[DB ERROR]:`, err.message);
                    reject(err);
                }
            });
        }
    }),

    query: (sql, params, callback) => {
        // console.log("SQL EXEC:", sql);
        if (typeof params === 'function') {
            callback = params;
            params = [];
        }

        try {
            if (sql.trim().toUpperCase().startsWith("SELECT")) {
                const stmt = db.prepare(sql);
                const rows = params.length > 0 ? stmt.all(...params) : stmt.all();
                if (callback) callback(null, rows);
            } else {
                const stmt = db.prepare(sql);
                const result = params.length > 0 ? stmt.run(...params) : stmt.run();
                const mysqlResult = {
                    affectedRows: result.changes,
                    insertId: result.lastInsertRowid,
                    ...result
                };
                if (callback) callback(null, mysqlResult);
            }
        } catch (err) {
            console.error("DB QUERY ERROR:", err);
            if (callback) callback(err);
        }
    }
};

module.exports = dbWrapper;
