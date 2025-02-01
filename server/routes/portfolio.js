const express = require('express');
const router = express.Router();
const { dbPromise } = require('../config/database');

// Get all portfolio items
router.get('/', async (req, res) => {
    try {
        const db = await dbPromise;
        const items = await db.all('SELECT * FROM portfolio ORDER BY created_at DESC');
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch portfolio items' });
    }
});

// Get single portfolio item
router.get('/:id', async (req, res) => {
    try {
        const db = await dbPromise;
        const item = await db.get('SELECT * FROM portfolio WHERE id = ?', [req.params.id]);
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch portfolio item' });
    }
});

// Create portfolio item
router.post('/', async (req, res) => {
    try {
        const { title, description, imageUrl, category, link } = req.body;
        
        if (!title || !description) {
            return res.status(400).json({ error: 'Title and description are required' });
        }

        const db = await dbPromise;
        const result = await db.run(
            'INSERT INTO portfolio (title, description, image_url, category, link, created_at) VALUES (?, ?, ?, ?, ?, datetime("now"))',
            [title, description, imageUrl, category, link]
        );

        res.status(201).json({ 
            id: result.lastID,
            message: 'Portfolio item created successfully' 
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create portfolio item' });
    }
});

// Update portfolio item
router.put('/:id', async (req, res) => {
    try {
        const { title, description, imageUrl, category, link } = req.body;
        const db = await dbPromise;
        
        await db.run(
            'UPDATE portfolio SET title = ?, description = ?, image_url = ?, category = ?, link = ? WHERE id = ?',
            [title, description, imageUrl, category, link, req.params.id]
        );

        res.json({ message: 'Portfolio item updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update portfolio item' });
    }
});

// Delete portfolio item
router.delete('/:id', async (req, res) => {
    try {
        const db = await dbPromise;
        await db.run('DELETE FROM portfolio WHERE id = ?', [req.params.id]);
        res.json({ message: 'Portfolio item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete portfolio item' });
    }
});

module.exports = router;