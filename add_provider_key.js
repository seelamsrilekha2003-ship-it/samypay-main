const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'samypay.db'));

// Check if provider_key column exists
const cols = db.prepare("PRAGMA table_info(commissions)").all();
const hasProviderKey = cols.some(c => c.name === 'provider_key');

if (!hasProviderKey) {
    console.log('Adding provider_key column to commissions table...');
    db.exec("ALTER TABLE commissions ADD COLUMN provider_key VARCHAR(20)");
    console.log('Column added!');

    // Update provider_key based on operator_name (abbreviation)
    const rows = db.prepare("SELECT id, operator_name FROM commissions").all();
    const updateStmt = db.prepare("UPDATE commissions SET provider_key = ? WHERE id = ?");

    rows.forEach(row => {
        if (!row.operator_name) return;
        // Generate abbreviation from first letters of each word
        const words = row.operator_name.split(' ').filter(w => w.length > 0);
        let key = words.map(w => w[0]).join('').toUpperCase();
        if (key.length < 2) key = row.operator_name.substring(0, 3).toUpperCase();
        updateStmt.run(key + 'V', row.id);
    });

    console.log('Provider keys updated!');
} else {
    console.log('provider_key column already exists');
}

// Show result
const sample = db.prepare("SELECT id, service_type, operator_name, provider_key, commission_value FROM commissions LIMIT 5").all();
sample.forEach(r => console.log(r.id, r.service_type, r.operator_name, '->', r.provider_key, '@', r.commission_value + '%'));

db.close();
