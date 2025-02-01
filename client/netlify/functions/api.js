const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const { initializeDatabase } = require('../../../server/db/migrations');

const app = express();
app.use(cors());
app.use(express.json());

// Admin routes
app.get('/api/admin/stats', async (req, res) => {
  try {
    const db = await initializeDatabase();
    const stats = await db.all(`
      SELECT 
        (SELECT COUNT(*) FROM contacts) as totalContacts,
        (SELECT COUNT(*) FROM blog_posts) as totalPosts,
        (SELECT COUNT(*) FROM services) as totalServices,
        (SELECT COUNT(*) FROM portfolio) as totalProjects
    `);
    res.json(stats[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Include other routes
app.use('/api/contacts', require('../../../server/routes/contacts'));
app.use('/api/services', require('../../../server/routes/services'));
app.use('/api/portfolio', require('../../../server/routes/portfolio'));
app.use('/api/blog', require('../../../server/routes/blog'));

module.exports.handler = serverless(app);