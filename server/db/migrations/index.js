const { dbPromise } = require('../../config/database');
const fs = require('fs').promises;
const path = require('path');

const initializeDatabase = async () => {
    try {
        const db = await dbPromise;
        const sqlFile = await fs.readFile(
            path.join(__dirname, 'init.sql'),
            'utf8'
        );
        
        const statements = sqlFile
            .split(';')
            .filter(statement => statement.trim());
            
        for (const statement of statements) {
            await db.run(statement);
        }
        
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization failed:', error);
        throw error;
    }
};

module.exports = { initializeDatabase };