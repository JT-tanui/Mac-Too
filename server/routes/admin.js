const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { dbPromise } = require('../config/database');
const adminAuth = require('../middleware/adminAuth');
const superAdminAuth = require('../middleware/superAdminAuth');

// Login route (no auth required)
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const db = await dbPromise;
        
        const user = await db.get('SELECT * FROM admin_users WHERE username = ?', [username]);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, isSuperAdmin: user.is_super_admin },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, isSuperAdmin: user.is_super_admin });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Super admin routes
router.post('/users', superAdminAuth, async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const db = await dbPromise;
        
        await db.run(
            'INSERT INTO admin_users (username, password) VALUES (?, ?)',
            [username, hashedPassword]
        );
        
        res.status(201).json({ message: 'Admin user created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/users', superAdminAuth, async (req, res) => {
    try {
        const db = await dbPromise;
        const users = await db.all('SELECT id, username, is_super_admin, created_at FROM admin_users');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/users/:id', superAdminAuth, async (req, res) => {
    try {
        const db = await dbPromise;
        const user = await db.get('SELECT is_super_admin FROM admin_users WHERE id = ?', [req.params.id]);
        
        if (user.is_super_admin) {
            return res.status(403).json({ error: 'Cannot delete super admin' });
        }
        
        await db.run('DELETE FROM admin_users WHERE id = ?', [req.params.id]);
        res.json({ message: 'Admin user deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.use(adminAuth);

// Blog CRUD
router.get('/blog', async (req, res) => {
    try {
        const db = await dbPromise;
        const posts = await db.all('SELECT * FROM blog_posts ORDER BY created_at DESC');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/blog', async (req, res) => {
    try {
        const db = await dbPromise;
        const { title, content, category, imageUrl } = req.body;
        const result = await db.run(
            'INSERT INTO blog_posts (title, content, category, image_url) VALUES (?, ?, ?, ?)',
            [title, content, category, imageUrl]
        );
        res.json({ id: result.lastID });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/blog/:id', async (req, res) => {
    try {
        const db = await dbPromise;
        const { title, content, category, imageUrl } = req.body;
        await db.run(
            'UPDATE blog_posts SET title = ?, content = ?, category = ?, image_url = ? WHERE id = ?',
            [title, content, category, imageUrl, req.params.id]
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/blog/:id', async (req, res) => {
    try {
        const db = await dbPromise;
        await db.run('DELETE FROM blog_posts WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Services CRUD
router.get('/services', async (req, res) => {
    try {
        const db = await dbPromise;
        const services = await db.all('SELECT * FROM services ORDER BY created_at DESC');
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/services', async (req, res) => {
    try {
        const db = await dbPromise;
        const { title, description, icon, price } = req.body;
        const result = await db.run(
            'INSERT INTO services (title, description, icon, price) VALUES (?, ?, ?, ?)',
            [title, description, icon, price]
        );
        res.json({ id: result.lastID });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/services/:id', async (req, res) => {
    try {
        const db = await dbPromise;
        const { title, description, icon, price } = req.body;
        await db.run(
            'UPDATE services SET title = ?, description = ?, icon = ?, price = ? WHERE id = ?',
            [title, description, icon, price, req.params.id]
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/services/:id', async (req, res) => {
    try {
        const db = await dbPromise;
        await db.run('DELETE FROM services WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Portfolio CRUD
router.get('/portfolio', async (req, res) => {
    try {
        const db = await dbPromise;
        const portfolio = await db.all('SELECT * FROM portfolio ORDER BY created_at DESC');
        res.json(portfolio);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/portfolio', async (req, res) => {
    try {
        const db = await dbPromise;
        const { title, description, client, imageUrl } = req.body;
        const result = await db.run(
            'INSERT INTO portfolio (title, description, client, image_url) VALUES (?, ?, ?, ?)',
            [title, description, client, imageUrl]
        );
        res.json({ id: result.lastID });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/portfolio/:id', async (req, res) => {
    try {
        const db = await dbPromise;
        const { title, description, client, imageUrl } = req.body;
        await db.run(
            'UPDATE portfolio SET title = ?, description = ?, client = ?, image_url = ? WHERE id = ?',
            [title, description, client, imageUrl, req.params.id]
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/portfolio/:id', async (req, res) => {
    try {
        const db = await dbPromise;
        await db.run('DELETE FROM portfolio WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;