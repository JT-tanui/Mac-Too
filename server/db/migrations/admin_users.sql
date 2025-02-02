CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    is_super_admin BOOLEAN DEFAULT 0,
    email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Super admin credentials:
-- Username: superadmin
-- Password: MacToo@2024
INSERT INTO admin_users (username, password, is_super_admin, email) 
VALUES (
    'superadmin', 
    '$2b$10$YourGeneratedHashHere', 
    1, 
    'admin@mactoo.com'
);