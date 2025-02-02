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

CREATE TABLE IF NOT EXISTS activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action TEXT NOT NULL,
    details TEXT,
    ip_address TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES team_members(id)
);

-- Trigger for logging team member actions
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
        json_object(
            'table', 'team_members',
            'id', COALESCE(NEW.id, OLD.id),
            'username', COALESCE(NEW.username, OLD.username)
        );
END;