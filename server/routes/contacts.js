const express = require('express');
const router = express.Router();
const { dbPromise } = require('../config/database');

router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const db = await dbPromise;

        // Save message
        await db.run(`
            INSERT INTO contact_messages (name, email, message)
            VALUES (?, ?, ?)
        `, [name, email, message]);

        res.status(201).json({ 
            success: true,
            message: 'Message sent successfully'
        });
    } catch (error) {
        console.error('Contact error:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

router.get('/', async (req, res) => {
    try {
        const db = await dbPromise;
        const messages = await db.all('SELECT * FROM contact_messages ORDER BY created_at DESC');
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/:id/read', async (req, res) => {
    try {
        const db = await dbPromise;
        await db.run('UPDATE contact_messages SET read = 1 WHERE id = ?', req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;