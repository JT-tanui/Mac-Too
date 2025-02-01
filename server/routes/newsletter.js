const express = require('express');
const router = express.Router();
const { dbPromise } = require('../config/database');

router.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;
        
        // Validate email
        if (!email || typeof email !== 'string') {
            return res.status(400).json({ 
                error: 'Valid email is required' 
            });
        }

        const db = await dbPromise;
        
        // Add subscriber
        const result = await db.run(
            'INSERT INTO newsletter_subscribers (email) VALUES (?)',
            [email]
        );

        console.log('Newsletter subscription success:', { email });
        
        res.json({ 
            success: true,
            message: 'Successfully subscribed' 
        });
    } catch (error) {
        console.error('Newsletter error:', error);
        res.status(500).json({ 
            error: 'Subscription failed',
            details: error.message 
        });
    }
});

module.exports = router;