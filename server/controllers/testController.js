const pool = require('../db');

const testController = {
    getPreviousNames: async (req, res) => {
        try {
            const result = await pool.query(
                'SELECT DISTINCT first_name || \' \' || last_name as full_name FROM users ORDER BY full_name'
            );
            res.json(result.rows.map(row => row.full_name));
        } catch (err) {
            console.error('Error fetching names:', err);
            res.status(500).json({ error: 'Server error' });
        }
    },

};

module.exports = testController;