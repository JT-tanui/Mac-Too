const bcrypt = require('bcrypt');
const { dbPromise } = require('../../config/database');
const path = require('path');

async function createSuperAdmin() {
    try {
        const db = await dbPromise;
        
        // Verify table exists
        await db.exec(`
            CREATE TABLE IF NOT EXISTS admin_users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                is_super_admin INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create hashed password
        const hashedPassword = await bcrypt.hash('MacToo@2024', 10);
        console.log('Generated hash:', hashedPassword);

        // Insert or update super admin
        const result = await db.run(`
            INSERT OR REPLACE INTO admin_users (username, password, is_super_admin)
            VALUES (?, ?, 1)
        `, ['superadmin', hashedPassword]);

        console.log('Insert result:', result);

        // Verify user was created
        const user = await db.get('SELECT * FROM admin_users WHERE username = ?', ['superadmin']);
        console.log('Created user:', user);

    } catch (error) {
        console.error('Error creating super admin:', error);
        throw error;
    }
}

// Run migration
createSuperAdmin()
    .then(() => console.log('Super admin created successfully'))
    .catch(error => console.error('Failed to create super admin:', error));