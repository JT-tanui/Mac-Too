require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./db/migrations');
const { dbPromise } = require('./config/database');

const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const { contactValidation } = require('./middleware/validation');
const upload = require('./services/fileUpload');

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Initialize database and tables
initializeDatabase()
    .then(() => {
        console.log('Database and tables initialized');
        return dbPromise;
    })
    .then(db => {
        console.log('Database connected successfully');
    })
    .catch(err => {
        console.error('Database initialization failed:', err);
    });

// Routes with middleware
app.use('/api/contacts', contactValidation, require('./routes/contacts'));
app.use('/api/services', authMiddleware, require('./routes/services'));
app.use('/api/projects', authMiddleware, require('./routes/projects'));
app.use('/api/newsletter', require('./routes/newsletter'));

// File upload route
app.post('/api/upload', authMiddleware, upload.single('file'), (req, res) => {
  res.json({ file: req.file });
});

app.use(errorHandler);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));