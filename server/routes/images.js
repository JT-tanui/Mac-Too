const express = require('express');
const router = express.Router();
const { dbPromise } = require('../config/database');
const upload = require('../services/fileUpload');

router.get('/', async (req, res) => {
    try {
        const db = await dbPromise;
        const images = await db.all('SELECT * FROM images ORDER BY created_at DESC');
        res.json(images);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) throw new Error('No image uploaded');
        
        const db = await dbPromise;
        const result = await db.run(`
            INSERT INTO images (name, url, size, type, uploaded_by)
            VALUES (?, ?, ?, ?, ?)
        `, [
            req.file.originalname,
            `/uploads/${req.file.filename}`,
            req.file.size,
            req.file.mimetype,
            req.user.id
        ]);

        const image = await db.get('SELECT * FROM images WHERE id = ?', result.lastID);
        res.status(201).json(image);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;