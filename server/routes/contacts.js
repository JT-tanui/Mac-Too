const express = require('express');
const router = express.Router();
const { dbPromise } = require('../config/database');
const nodemailer = require('nodemailer');

router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const db = await dbPromise;
        
        // Save to database
        await db.run(
            'INSERT INTO contacts (name, email, message, created_at) VALUES (?, ?, ?, datetime("now"))',
            [name, email, message]
        );

        // Setup email transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        // Send confirmation to user
        await transporter.sendMail({
            from: '"Mac Too Agency" <noreply@mactoo.com>',
            to: email,
            subject: 'Thanks for contacting us!',
            html: `<p>Hi ${name},</p><p>We received your message and will get back to you soon.</p>`
        });

        // Notify admin
        await transporter.sendMail({
            from: '"Mac Too Website" <noreply@mactoo.com>',
            to: process.env.ADMIN_EMAIL,
            subject: 'New Contact Form Submission',
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong> ${message}</p>
            `
        });

        res.status(201).json({ message: 'Contact saved and notifications sent' });
    } catch (error) {
        console.error('Contact error:', error);
        res.status(500).json({ error: 'Failed to process contact' });
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