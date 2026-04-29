-- KaChing MySQL Schema for phpMyAdmin
-- Run this in phpMyAdmin to create the database and tables

CREATE DATABASE IF NOT EXISTS kaching CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE kaching;

CREATE TABLE IF NOT EXISTS usage_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  record_id VARCHAR(20) NOT NULL UNIQUE,
  pocket_name VARCHAR(100) NOT NULL,
  amount DECIMAL(18, 7) NOT NULL,
  asset VARCHAR(20) NOT NULL DEFAULT 'XLM',
  purpose VARCHAR(255) NOT NULL,
  recipient TEXT DEFAULT NULL,
  evidence LONGTEXT DEFAULT NULL,
  evidence_name VARCHAR(255) DEFAULT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  wallet_address VARCHAR(255) DEFAULT NULL,
  INDEX idx_wallet (wallet_address),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
