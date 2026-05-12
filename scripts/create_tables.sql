USE samypay;

CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    mobile VARCHAR(15),
    email VARCHAR(100),
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS wallet (
    user_id INT PRIMARY KEY,
    balance DECIMAL(10, 2) DEFAULT 0.00,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS wallet_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    amount DECIMAL(10, 2),
    type VARCHAR(20),
    reference VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Seed Data
INSERT INTO roles (id, role_name) VALUES (1, 'User') ON DUPLICATE KEY UPDATE role_name='User';

INSERT INTO users (id, name, mobile, email, role_id) 
VALUES (1, 'Demo User', '1234567890', 'demo@samypay.com', 1)
ON DUPLICATE KEY UPDATE name='Demo User';

INSERT INTO wallet (user_id, balance) 
VALUES (1, 0.00)
ON DUPLICATE KEY UPDATE balance=balance;
