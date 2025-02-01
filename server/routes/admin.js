const express = require('express');
const router = express.Router();
const { dbPromise } = require('../config/database');
const adminAuth = require('../middleware/adminAuth');

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