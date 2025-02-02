CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    is_super_admin INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS team_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('admin', 'editor', 'viewer')) DEFAULT 'editor',
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
);

CREATE TABLE IF NOT EXISTS blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT,
    image_url TEXT,
    visible BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    author_id INTEGER,
    FOREIGN KEY(author_id) REFERENCES team_members(id)
);

CREATE TABLE IF NOT EXISTS portfolio (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    client TEXT,
    category TEXT,
    image_url TEXT,
    link TEXT,
    visible BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    price TEXT,
    visible BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    created_by INTEGER,
    FOREIGN KEY(created_by) REFERENCES team_members(id)
);

CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author TEXT NOT NULL,
    role TEXT,
    company TEXT,
    content TEXT NOT NULL,
    rating INTEGER CHECK(rating BETWEEN 1 AND 5),
    image_url TEXT,
    visible BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    usage_location TEXT,
    size INTEGER,
    type TEXT,
    uploaded_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(uploaded_by) REFERENCES team_members(id)
);

CREATE TABLE IF NOT EXISTS activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action TEXT NOT NULL,
    details TEXT,
    ip_address TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES team_members(id)
);

CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    category TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER,
    FOREIGN KEY(updated_by) REFERENCES team_members(id)
);

-- Insert Sample Data
INSERT INTO team_members (username, email, password, role) VALUES
('admin', 'admin@example.com', '$2b$10$YourHashedPasswordHere', 'admin'),
('editor', 'editor@example.com', '$2b$10$YourHashedPasswordHere', 'editor');

INSERT INTO services (title, description, icon, price, created_by) VALUES
('Web Development', 'Custom website development', 'code', '$999', 1),
('UI/UX Design', 'User interface design', 'pen-tool', '$799', 1),
('Digital Marketing', 'SEO and marketing services', 'trending-up', '$599', 1);

INSERT INTO testimonials (author, role, company, content, rating) VALUES
('John Doe', 'CEO', 'Tech Corp', 'Great service!', 5),
('Jane Smith', 'Manager', 'Design Inc', 'Excellent work!', 5);

INSERT INTO settings (key, value, category, updated_by) VALUES
('theme.primaryColor', '#3B82F6', 'theme', 1),
('theme.darkMode', 'false', 'theme', 1),
('email.fromName', 'Your Company', 'email', 1);

-- Create Indices
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_images_uploaded_by ON images(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON contact_messages(read);
CREATE INDEX IF NOT EXISTS idx_testimonials_visible ON testimonials(visible);

-- Activity Logging Trigger
CREATE TRIGGER IF NOT EXISTS log_team_member_changes
AFTER INSERT OR UPDATE OR DELETE ON team_members
BEGIN
    INSERT INTO activity_logs (user_id, action, details)
    SELECT 
        CASE
            WHEN NEW.id IS NOT NULL THEN NEW.id
            ELSE OLD.id
        END,
        CASE
            WHEN NEW.id IS NOT NULL AND OLD.id IS NULL THEN 'CREATE'
            WHEN NEW.id IS NOT NULL AND OLD.id IS NOT NULL THEN 'UPDATE'
            ELSE 'DELETE'
        END,
        'Team member action performed';
END;