const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// Get all users - accessible to both authenticated and unauthenticated users
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                u.*,
                m.firstname as manager_first_name,
                m.lastname as manager_last_name,
                m.email as manager_email
            FROM users u
            LEFT JOIN managers m ON u.manager_id = m.id
            ORDER BY u.id ASC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single user - requires authentication
router.get('/:id', auth, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                u.*,
                m.firstname as manager_first_name,
                m.lastname as manager_last_name,
                m.email as manager_email
            FROM users u
            LEFT JOIN managers m ON u.manager_id = m.id
            WHERE u.id = $1
        `, [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = result.rows[0];
        res.json({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            manager_id: user.manager_id,
            manager_first_name: user.manager_first_name,
            manager_last_name: user.manager_last_name,
            is_admin: user.is_admin
        });
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user - requires authentication
router.put('/:id', auth, async (req, res) => {
    try {
        const { first_name, last_name, manager_id, is_admin } = req.body;
        
        const result = await pool.query(
            'UPDATE users SET first_name = $1, last_name = $2, manager_id = $3, is_admin = $4 WHERE id = $5 RETURNING *',
            [first_name, last_name, manager_id, is_admin, req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete user - requires authentication
router.delete('/:id', auth, async (req, res) => {
    try {
        const result = await pool.query(
            'DELETE FROM users WHERE id = $1 RETURNING *',
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add bulk update endpoint
router.put('/bulk-update', auth, async (req, res) => {
    try {
        const { userIds, managerId } = req.body;
        
        await pool.query(
            'UPDATE users SET manager_id = $1 WHERE id = ANY($2)',
            [managerId, userIds]
        );
        
        res.json({ message: 'Users updated successfully' });
    } catch (err) {
        console.error('Error updating users:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;