const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { dbPromise } = require('../config/database');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// Get all team members
router.get('/', async (req, res) => {
    try {
        const db = await dbPromise;
        const members = await db.all(`
            SELECT id, username, email, role, is_active, created_at, last_login 
            FROM team_members
        `);
        res.json(members);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Verify admin passcode
router.post('/verify-passcode', async (req, res) => {
    const { passcode } = req.body;
    if (passcode === process.env.ADMIN_PASSCODE) {
        res.json({ verified: true });
    } else {
        res.status(403).json({ error: 'Invalid passcode' });
    }
});

// Create team member
router.post('/', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const db = await dbPromise;
        const result = await db.run(`
            INSERT INTO team_members (username, email, password, role)
            VALUES (?, ?, ?, ?)
        `, [username, email, hashedPassword, role]);

        const member = await db.get('SELECT * FROM team_members WHERE id = ?', result.lastID);
        res.status(201).json(member);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update team member
router.put('/:id', async (req, res) => {
    try {
        const { username, email, role, is_active } = req.body;
        const db = await dbPromise;
        
        await db.run(`
            UPDATE team_members 
            SET username = ?, email = ?, role = ?, is_active = ?, 
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `, [username, email, role, is_active, req.params.id]);

        const member = await db.get('SELECT * FROM team_members WHERE id = ?', req.params.id);
        res.json(member);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete team member
router.delete('/:id', async (req, res) => {
    try {
        const db = await dbPromise;
        await db.run('DELETE FROM team_members WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get activity logs
router.get('/activity', async (req, res) => {
    try {
        const db = await dbPromise;
        const logs = await db.all(`
            SELECT 
                al.*,
                tm.username as user_name
            FROM activity_logs al
            LEFT JOIN team_members tm ON al.user_id = tm.id
            ORDER BY al.timestamp DESC
            LIMIT 100
        `);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get activity logs with filters
router.get('/activity-logs', async (req, res) => {
    try {
        const { user_id, action, start_date, end_date } = req.query;
        const db = await dbPromise;
        
        let query = `
            SELECT al.*, tm.username
            FROM activity_logs al
            LEFT JOIN team_members tm ON al.user_id = tm.id
            WHERE 1=1
        `;
        const params = [];

        if (user_id) {
            query += ' AND al.user_id = ?';
            params.push(user_id);
        }
        if (action) {
            query += ' AND al.action = ?';
            params.push(action);
        }
        if (start_date) {
            query += ' AND al.timestamp >= ?';
            params.push(start_date);
        }
        if (end_date) {
            query += ' AND al.timestamp <= ?';
            params.push(end_date);
        }

        query += ' ORDER BY al.timestamp DESC LIMIT 100';
        
        const logs = await db.all(query, params);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update password
router.put('/:id/password', async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const db = await dbPromise;
        
        const member = await db.get('SELECT * FROM team_members WHERE id = ?', req.params.id);
        
        const isValid = await bcrypt.compare(currentPassword, member.password);
        if (!isValid) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }
        
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.run(
            'UPDATE team_members SET password = ? WHERE id = ?',
            [hashedPassword, req.params.id]
        );
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;