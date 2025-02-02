const express = require('express');
const router = express.Router();

// API Documentation endpoint
router.get('/docs', (req, res) => {
    res.json({
        version: '1.0',
        endpoints: {
            auth: {
                login: 'POST /api/auth/login',
                register: 'POST /api/auth/register'
            },
            admin: {
                services: 'CRUD /api/admin/services',
                blog: 'CRUD /api/admin/blog',
                testimonials: 'CRUD /api/admin/testimonials',
                team: 'CRUD /api/admin/team',
                images: 'CRUD /api/admin/images',
                settings: 'GET,PUT /api/admin/settings',
                contacts: 'GET,PATCH /api/admin/contacts'
            }
        }
    });
});

module.exports = router;