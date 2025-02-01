-- Drop existing tables if they exist
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS projects;

-- Services Table
CREATE TABLE services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price_range TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Projects Table
CREATE TABLE projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    client TEXT NOT NULL,
    service_id INTEGER,
    image_url TEXT,
    completion_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services(id)
);

-- Enhanced Contacts Table
CREATE TABLE contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    service_id INTEGER,
    budget TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    processed BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services(id)
);

-- Initial Services Data
INSERT INTO services (name, description, price_range) VALUES
    ('Branding', 'Complete brand identity development', '$5,000 - $10,000'),
    ('Digital Marketing', 'Comprehensive digital marketing campaigns', '$3,000 - $8,000'),
    ('Web Development', 'Custom website development', '$8,000 - $20,000'),
    ('Content Creation', 'Professional content creation services', '$2,000 - $5,000');