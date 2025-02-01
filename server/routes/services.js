const express = require('express');
const router = express.Router();
const { dbPromise } = require('../config/database');

router.get('/', async (req, res) => {
  try {
    const db = await dbPromise;
    const services = await db.all('SELECT * FROM services');
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const db = await dbPromise;
    const { name, description, price_range } = req.body;
    
    const result = await db.run(
      'INSERT INTO services (name, description, price_range) VALUES (?, ?, ?)',
      [name, description, price_range]
    );

    res.status(201).json({ id: result.lastID });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;