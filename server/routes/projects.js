const express = require('express');
const router = express.Router();
const { dbPromise } = require('../config/database');

router.get('/', async (req, res) => {
  try {
    const db = await dbPromise;
    const projects = await db.all(`
      SELECT p.*, s.name as service_name 
      FROM projects p 
      LEFT JOIN services s ON p.service_id = s.id
    `);
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const db = await dbPromise;
    const { title, description, client, service_id, image_url, completion_date } = req.body;
    
    const result = await db.run(
      `INSERT INTO projects (title, description, client, service_id, image_url, completion_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description, client, service_id, image_url, completion_date]
    );

    res.status(201).json({ id: result.lastID });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;