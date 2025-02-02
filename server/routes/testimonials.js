import express from 'express';
import { dbPromise } from '../config/database.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const db = await dbPromise;
        const testimonials = await db.all('SELECT * FROM testimonials ORDER BY created_at DESC');
        res.json(testimonials);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;