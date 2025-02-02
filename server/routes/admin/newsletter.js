const express = require('express');
const router = express.Router();
const { dbPromise } = require('../../config/database');
const { sendNewsletter } = require('../../services/emailService');
const authMiddleware = require('../../middleware/auth');
const roleAuth = require('../../middleware/roleAuth');

router.get('/', async (req, res) => {
    const db = await dbPromise;
    const newsletters = await db.all('SELECT * FROM newsletters ORDER BY created_at DESC');
    res.json(newsletters);
});

router.post('/', async (req, res) => {
    const { title, subject, content } = req.body;
    const db = await dbPromise;
    
    try {
        const result = await db.run(`
            INSERT INTO newsletters (title, subject, content, created_by)
            VALUES (?, ?, ?, ?)
        `, [title, subject, content, req.user.id]);
        
        res.status(201).json({ id: result.lastID });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:id/send', async (req, res) => {
    const { id } = req.params;
    const db = await dbPromise;
    
    try {
        const newsletter = await db.get('SELECT * FROM newsletters WHERE id = ?', id);
        const subscribers = await db.all('SELECT * FROM newsletter_subscribers WHERE status = "active"');
        
        await sendNewsletter(subscribers, newsletter);
        
        await db.run(`
            UPDATE newsletters 
            SET status = 'sent', sent_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        `, id);
        
        res.json({ message: 'Newsletter sent successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;