CREATE DATABASE IF NOT EXISTS api_data;
USE api_data;

CREATE TABLE IF NOT EXISTS api_data (
    id VARCHAR(255) PRIMARY KEY,
    icon_url TEXT,
    url TEXT,
    value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 