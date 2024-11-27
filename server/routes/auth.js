const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const pool = require('../db');
const auth = require('../middleware/auth');

// Login route
router.post('/login', authController.login);

// Register route
router.post('/register', auth, authController.register);

// Debug route - remove in production
router.get('/debug', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query(`
            SELECT 
                table_name, 
                column_name, 
                data_type 
            FROM information_schema.columns 
            WHERE table_name = 'users'
        `);
        client.release();
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add this after your login route
router.get('/debug/users', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                id,
                email,
                is_admin,
                CASE WHEN password_hash IS NOT NULL THEN true ELSE false END as has_password
            FROM users
            ORDER BY id ASC
        `);
        
        res.json({
            userCount: result.rows.length,
            users: result.rows
        });
    } catch (err) {
        res.status(500).json({
            error: err.message,
            code: err.code
        });
    }
});

router.get('/health', async (req, res) => {
    try {
        // Test database connection
        const dbTest = await pool.query('SELECT NOW()');
        
        res.json({
            status: 'healthy',
            database: 'connected',
            timestamp: dbTest.rows[0].now,
            environment: {
                hasJwtSecret: !!process.env.JWT_SECRET,
                nodeEnv: process.env.NODE_ENV
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'unhealthy',
            error: err.message
        });
    }
});

// Verify token and admin status
router.get('/verify', authController.verifyToken);

module.exports = router;