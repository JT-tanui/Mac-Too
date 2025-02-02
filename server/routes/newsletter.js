const express = require('express');
const router = express.Router();
const { dbPromise } = require('../config/database');
const authMiddleware = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const { sendEmails } = require('../services/emailService');

// Get all subscribers
router.get('/subscribers', authMiddleware, async (req, res) => {
    try {
        const db = await dbPromise;
        const subscribers = await db.all('SELECT * FROM newsletter_subscribers WHERE is_active = 1');
        res.json(subscribers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create and send newsletter
router.post('/send', [authMiddleware, roleAuth(['admin', 'editor'])], async (req, res) => {
    const { subject, content } = req.body;
    const db = await dbPromise;

    try {
        await db.run('BEGIN TRANSACTION');

        // Create newsletter record
        const result = await db.run(`
            INSERT INTO newsletters (subject, content, created_by)
            VALUES (?, ?, ?)
        `, [subject, content, req.user.id]);

        const newsletterId = result.lastID;

        // Get active subscribers
        const subscribers = await db.all('SELECT * FROM newsletter_subscribers WHERE is_active = 1');

        // Send emails in batches
        const batchSize = 50;
        for (let i = 0; i < subscribers.length; i += batchSize) {
            const batch = subscribers.slice(i, i + batchSize);
            await sendEmails({
                recipients: batch.map(s => s.email),
                subject,
                template: 'newsletter',
                data: { content }
            });

            // Log sends
            const logs = batch.map(subscriber => ({
                newsletter_id: newsletterId,
                subscriber_id: subscriber.id,
                status: 'sent',
                sent_at: new Date().toISOString()
            }));

            for (const log of logs) {
                await db.run(`
                    INSERT INTO newsletter_logs (newsletter_id, subscriber_id, status, sent_at)
                    VALUES (?, ?, ?, ?)
                `, [log.newsletter_id, log.subscriber_id, log.status, log.sent_at]);
            }
        }

        await db.run('UPDATE newsletters SET sent_at = CURRENT_TIMESTAMP WHERE id = ?', newsletterId);
        await db.run('COMMIT');

        res.json({ 
            message: 'Newsletter sent successfully', 
            recipientCount: subscribers.length 
        });
    } catch (error) {
        await db.run('ROLLBACK');
        res.status(500).json({ error: error.message });
    }
});

// Subscribe endpoint (public)
router.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;
        const db = await dbPromise;
        await db.run('INSERT INTO newsletter_subscribers (email) VALUES (?)', [email]);
        res.json({ message: 'Subscribed successfully' });
    } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
            res.status(400).json({ error: 'Email already subscribed' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

module.exports = router;