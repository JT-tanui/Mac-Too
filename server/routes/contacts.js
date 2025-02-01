const express = require('express');
const router = express.Router();
const { dbPromise } = require('../config/database');
const { sendEmails } = require('../services/emailService');
const batchProcessor = require('../services/batchProcessor');

router.post('/', async (req, res) => {
    try {
        const db = await dbPromise;
        const contactData = {
            ...req.body,
            processed: 0,
            created_at: new Date().toISOString()
        };

        const result = await db.run(`
            INSERT INTO contacts (
                name, email, company, service, 
                message, budget, processed, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [contactData.name, contactData.email, contactData.company,
             contactData.service, contactData.message, contactData.budget,
             contactData.processed, contactData.created_at]
        );

        // Send immediate confirmation
        await sendEmails({
            type: 'confirmation',
            email: contactData.email,
            name: contactData.name
        });

        // Trigger batch processing
        await batchProcessor.processContacts();

        res.status(201).json({
            success: true,
            message: 'Message received successfully'
        });
    } catch (error) {
        console.error('Contact error:', error);
        res.status(500).json({
            error: 'Message received but processing failed'
        });
    }
});

router.get('/', async (req, res) => {
  try {
    const db = await dbPromise;
    const contacts = await db.all(`
      SELECT c.*, s.name as service_name 
      FROM contacts c 
      LEFT JOIN services s ON c.service_id = s.id
    `);
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;