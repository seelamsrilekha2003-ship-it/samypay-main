const fs = require('fs');
const path = require('path');

let content = fs.readFileSync(path.join(__dirname, 'commissions/commissions.service.js'), 'utf8');

const startIdx = content.indexOf('exports.getMyCommissions');
const newFn = [
    'exports.getMyCommissions = async ({ user_role, search }) => {',
    '    const db = new Database(dbPath);',
    '',
    '    try {',
    '        let query = `',
    '            SELECT',
    '              c.id,',
    '              c.service_type,',
    '              c.operator_name AS service_provider,',
    '              c.provider_key,',
    '              c.commission_value AS margin,',
    '              CASE',
    "                WHEN c.is_active = 1 THEN 'Active'",
    "                ELSE 'Inactive'",
    '              END AS status',
    '            FROM commissions c',
    '            WHERE c.user_role = ?',
    '              AND c.is_active = 1',
    '        `;',
    '',
    '        const params = [user_role];',
    '',
    '        if (search) {',
    '            query += ` AND (',
    '                c.operator_name LIKE ? OR',
    '                c.service_type LIKE ? OR',
    '                c.provider_key LIKE ?',
    '            )`;',
    "            params.push('%' + search + '%', '%' + search + '%', '%' + search + '%');",
    '        }',
    '',
    '        query += ` ORDER BY c.service_type, c.operator_name`;',
    '',
    '        return db.prepare(query).all(...params);',
    '    } catch (error) {',
    "        console.error('Error fetching my commissions:', error);",
    '        throw error;',
    '    } finally {',
    '        db.close();',
    '    }',
    '};',
    ''
].join('\n');

content = content.substring(0, startIdx) + newFn;
fs.writeFileSync(path.join(__dirname, 'commissions/commissions.service.js'), content);
console.log('Done! File updated successfully.');
