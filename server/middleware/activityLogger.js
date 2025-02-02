const { dbPromise } = require('../config/database');

const activityLogger = async (req, res, next) => {
    const startTime = Date.now();
    const originalJson = res.json;
    
    res.json = async function(data) {
        const responseTime = Date.now() - startTime;
        
        try {
            const db = await dbPromise;
            await db.run(`
                INSERT INTO activity_logs (
                    user_id, 
                    action, 
                    details, 
                    ip_address, 
                    response_time,
                    status_code
                ) VALUES (?, ?, ?, ?, ?, ?)
            `, [
                req.user?.id || null,
                `${req.method} ${req.path}`,
                JSON.stringify({
                    body: req.body,
                    query: req.query,
                    params: req.params
                }),
                req.ip,
                responseTime,
                res.statusCode
            ]);
        } catch (error) {
            console.error('Activity logging failed:', error);
        }
        
        originalJson.call(this, data);
    };
    
    next();
};

app.use('/api/*', activityLogger);

module.exports = activityLogger;