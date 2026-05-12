const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "samypay.db"));

db.exec(`
INSERT OR IGNORE INTO commissions
(service_type, operator_name, provider_key, commission_type, commission_value, user_role, is_active)
VALUES
('DTH', 'Airtel Digital TV', 'ATV', 'PERCENTAGE', 4, 'RETAILER', 1),
('DTH', 'Dish TV', 'DTV', 'PERCENTAGE', 3.8, 'RETAILER', 1),
('DTH', 'Sun Direct', 'STV', 'PERCENTAGE', 3, 'RETAILER', 1),
('DTH', 'Tata Sky', 'TTV', 'PERCENTAGE', 3.2, 'RETAILER', 1),
('DTH', 'Videocon d2h', 'VTV', 'PERCENTAGE', 3.8, 'RETAILER', 1),
('MOBILE', 'Airtel', 'AIR', 'PERCENTAGE', 2.5, 'RETAILER', 1),
('MOBILE', 'Jio', 'JIO', 'PERCENTAGE', 2, 'RETAILER', 1),
('ELECTRICITY', 'Electricity Bill', 'EB', 'FLAT', 10, 'RETAILER', 1),
('WATER', 'Water Bill', 'WB', 'PERCENTAGE', 1, 'RETAILER', 1),
('GAS', 'Gas Bill', 'GB', 'FLAT', 15, 'RETAILER', 1);
`);

console.log("✅ Commissions seeded");
