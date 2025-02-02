import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { dbPromise } from './config/database.js';
import { initializeDatabase } from './db/migrations/index.js';

import authMiddleware from './middleware/auth.js';
import errorHandler from './middleware/errorHandler.js';
import { contactValidation } from './middleware/validation.js';
import upload from './services/fileUpload.js';
import adminRoutes from './routes/admin.js';
import settingsRoutes from './routes/settings.js';
import imageRoutes from './routes/images.js';
import testimonialRoutes from './routes/testimonials.js';
import contactRoutes from './routes/contacts.js';
import teamRoutes from './routes/team.js';
import apiRoutes from './routes/api.js';
import activityLogger from './middleware/activityLogger.js';
import { validateService, validateBlogPost, validateTestimonial, handleValidation } from './middleware/validation.js';
import newsletterRoutes from './routes/newsletter.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// CORS and middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database
await initializeDatabase();

// Routes
app.use('/api/admin/testimonials', authMiddleware, testimonialRoutes);
app.use('/api/admin/contacts', authMiddleware, contactRoutes);
app.use('/api/admin/team', authMiddleware, teamRoutes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is busy, trying ${PORT + 1}`);
        app.listen(PORT + 1);
    }
});