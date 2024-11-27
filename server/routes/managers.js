const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// Get all managers
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, first_name, last_name, email 
            FROM managers 
            ORDER BY last_name, first_name
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching managers:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add new manager (admin only)
router.post('/', auth, async (req, res) => {
    try {
        const { first_name, last_name, email } = req.body;
        
        const result = await pool.query(
            `INSERT INTO managers (first_name, last_name, email) 
             VALUES ($1, $2, $3) 
             RETURNING *`,
            [first_name, last_name, email]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating manager:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
