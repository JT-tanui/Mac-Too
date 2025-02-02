const express = require('express');
const router = express.Router();
const { dbPromise } = require('../config/database');

// Get all blog posts
router.get('/', async (req, res) => {
    try {
        const db = await dbPromise;
        const posts = await db.all('SELECT * FROM blog_posts ORDER BY created_at DESC');
        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get single blog post
router.get('/:id', async (req, res) => {
    try {
        const db = await dbPromise;
        const post = await db.get('SELECT * FROM blog_posts WHERE id = ?', [req.params.id]);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch blog post' });
    }
});

// Create blog post
router.post('/', async (req, res) => {
    try {
        const db = await dbPromise;
        const { title, content, category, imageUrl, visible } = req.body;
        
        // Validate required fields
        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }

        const result = await db.run(
            'INSERT INTO blog_posts (title, content, category, image_url, visible) VALUES (?, ?, ?, ?, ?)',
            [title, content, category, imageUrl, visible]
        );
        const post = await db.get('SELECT * FROM blog_posts WHERE id = ?', result.lastID);
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update blog post
router.put('/:id', async (req, res) => {
    try {
        const { title, content, category, imageUrl } = req.body;
        const db = await dbPromise;
        
        await db.run(
            'UPDATE blog_posts SET title = ?, content = ?, category = ?, image_url = ? WHERE id = ?',
            [title, content, category, imageUrl, req.params.id]
        );

        res.json({ message: 'Blog post updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update blog post' });
    }
});

// Delete blog post
router.delete('/:id', async (req, res) => {
    try {
        const db = await dbPromise;
        await db.run('DELETE FROM blog_posts WHERE id = ?', [req.params.id]);
        res.json({ message: 'Blog post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete blog post' });
    }
});

module.exports = router;