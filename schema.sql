CREATE DATABASE IF NOT EXISTS evnt_organizer;
USE evnt_organizer;

-- 1. Products Table (Available passes & add-ons)
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_code VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image VARCHAR(255)
);

-- 2. Shopping Cart Table
CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    product_name VARCHAR(150) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- 3. Shipping Table (Finalization / Delivery details)
CREATE TABLE IF NOT EXISTS shipping (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    address VARCHAR(255) NOT NULL,
    delivery_method VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Billing Table
CREATE TABLE IF NOT EXISTS billing (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    address VARCHAR(255) NOT NULL,
    card_last4 VARCHAR(4) NOT NULL,
    expiration VARCHAR(10) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Returns Table
CREATE TABLE IF NOT EXISTS returns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    product_name VARCHAR(150) NOT NULL,
    product_condition VARCHAR(100) NOT NULL,
    return_reason VARCHAR(100) NOT NULL,
    additional_details TEXT,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial Products
INSERT INTO products (product_code, name, price, image) VALUES
('PASS-ALL', 'Full Access Conference Pass', 299.00, 'https://via.placeholder.com/80x60?text=VIP+Pass'),
('WORK-CLOUD', 'Cloud Native Architecture Workshop', 99.50, 'https://via.placeholder.com/80x60?text=Workshop'),
('SWAG-VIP', 'VIP Speaker Luncheon & Swag Pack', 39.99, 'https://via.placeholder.com/80x60?text=Swag+Pack');