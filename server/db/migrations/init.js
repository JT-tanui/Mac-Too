const { dbPromise } = require('../../config/database');

async function initDatabase() {
    const db = await dbPromise;
    
    await db.exec(`
        CREATE TABLE IF NOT EXISTS admin_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            is_super_admin INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS blog_posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            category TEXT,
            image_url TEXT,
            visible BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- Insert dummy blog posts
        INSERT INTO blog_posts (title, content, category, image_url, visible)
        VALUES 
        ('First Blog Post', 'This is the content of our first blog post', 'Technology', 'https://picsum.photos/800/400', 1),
        ('Marketing Strategy', 'Learn about effective marketing strategies', 'Marketing', 'https://picsum.photos/800/401', 1);

        -- Insert dummy portfolio items
        INSERT INTO portfolio (title, description, client, category, image_url, link, visible)
        VALUES 
        ('Web Design Project', 'Modern website design for tech company', 'Tech Corp', 'Web Design', 'https://picsum.photos/800/402', 'https://example.com', 1),
        ('Brand Identity', 'Complete brand redesign', 'Brand Co', 'Branding', 'https://picsum.photos/800/403', 'https://example.com', 1);

        -- Insert dummy services
        INSERT INTO services (title, description, icon, price, visible)
        VALUES 
        ('Web Development', 'Custom website development', 'code', '$999', 1),
        ('Digital Marketing', 'Comprehensive marketing solutions', 'chart-line', '$799', 1);
    `);
    
    console.log('Database schema and dummy data created');
}

initDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error('Database initialization failed:', err);
        process.exit(1);
    });