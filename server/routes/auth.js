const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const pool = require('../db');

// Login route
router.post('/login', authController.login);

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

module.exports = router;