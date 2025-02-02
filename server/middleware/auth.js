const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            console.log('No auth header found');
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            console.log('No token found in header');
            return res.status(401).json({ error: 'Invalid token format' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Auth error:', error.message);
        return res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authMiddleware;