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


    getTestHistory: async (req, res) => {
        try {
            const result = await pool.query(
                `SELECT 
                    e.id,
                    u.first_name || ' ' || u.last_name as name,
                    e.test_date,
                    e.test_time,
                    e.test_period,
                    e.passed,
                    e.notes,
                    e.created_at
                FROM esd_tests e
                JOIN users u ON e.user_id = u.id
                ORDER BY e.created_at DESC`
            );
            res.json(result.rows);
        } catch (err) {
            console.error('Error fetching test history:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }
};

module.exports = testController;