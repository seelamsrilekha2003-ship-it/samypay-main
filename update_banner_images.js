const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'samypay.db'));

// Update existing sample banners to use public image paths
db.prepare("UPDATE banners SET image_url = '/images/banners/dashboard1.jpg' WHERE title = 'New Year Offer 2026'").run();
db.prepare("UPDATE banners SET image_url = '/images/banners/dashboard2.jpg' WHERE title = 'Refer & Earn'").run();
db.prepare("UPDATE banners SET image_url = '/images/banners/dashboard3.jpg' WHERE title = 'DTH Recharge Bonanza'").run();
db.prepare("UPDATE banners SET image_url = '/images/banners/dashboard1.jpg' WHERE title = 'Bill Payment Cashback'").run();

const all = db.prepare('SELECT id, title, image_url FROM banners').all();
console.log('Updated banners:', JSON.stringify(all, null, 2));
db.close();
console.log('Done!');
