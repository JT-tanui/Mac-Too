const express = require('express');
const router = express.Router();
const { dbPromise } = require('../config/database');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// Get all settings
router.get('/', async (req, res) => {
    try {
        const db = await dbPromise;
        const settings = await db.all('SELECT * FROM settings');
        
        // Transform array to structured object
        const structured = settings.reduce((acc, curr) => {
            const [category, key] = curr.key.split('.');
            if (!acc[category]) acc[category] = {};
            acc[category][key] = curr.value;
            return acc;
        }, {});
        
        res.json(structured);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update settings
router.put('/', async (req, res) => {
    try {
        const db = await dbPromise;
        const { theme, notifications, email } = req.body;

        // Flatten object for database storage
        const updates = [
            ...Object.entries(theme).map(([key, value]) => ({
                key: `theme.${key}`,
                value: String(value),
                category: 'theme'
            })),
            ...Object.entries(notifications).map(([key, value]) => ({
                key: `notifications.${key}`,
                value: String(value),
                category: 'notifications'
            })),
            ...Object.entries(email).map(([key, value]) => ({
                key: `email.${key}`,
                value: String(value),
                category: 'email'
            }))
        ];

        await db.run('BEGIN TRANSACTION');

        for (const setting of updates) {
            await db.run(`
                INSERT INTO settings (key, value, category, updated_by)
                VALUES (?, ?, ?, ?)
                ON CONFLICT(key) DO UPDATE SET 
                value = excluded.value,
                updated_at = CURRENT_TIMESTAMP,
                updated_by = excluded.updated_by
            `, [setting.key, setting.value, setting.category, req.user.id]);
        }

        await db.run('COMMIT');
        res.json({ success: true });
    } catch (error) {
        await db.run('ROLLBACK');
        res.status(500).json({ error: error.message });
    }
});

// Test email configuration
router.post('/test-email', async (req, res) => {
    try {
        const { to } = req.body;
        const db = await dbPromise;
        const emailSettings = await db.all("SELECT * FROM settings WHERE category = 'email'");
        
        // Configure email service with settings
        const emailConfig = emailSettings.reduce((acc, curr) => {
            const key = curr.key.split('.')[1];
            acc[key] = curr.value;
            return acc;
        }, {});

        // Send test email
        await sendTestEmail(to, emailConfig);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;