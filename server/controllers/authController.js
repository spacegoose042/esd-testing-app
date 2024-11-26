const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

class AuthController {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            console.log('Login attempt for:', email);

            // Verify database connection first
            const client = await pool.connect();
            console.log('Database connection established for login');

            try {
                const result = await client.query(
                    'SELECT * FROM users WHERE email = $1',
                    [email]
                );

                if (result.rows.length === 0) {
                    console.log('No user found with email:', email);
                    return res.status(400).json({ error: 'Invalid credentials' });
                }

                const user = result.rows[0];
                const validPassword = await bcrypt.compare(password, user.password_hash);

                if (!validPassword) {
                    console.log('Invalid password for user:', email);
                    return res.status(400).json({ error: 'Invalid credentials' });
                }

                const token = jwt.sign(
                    { id: user.id, isAdmin: user.is_admin },
                    process.env.JWT_SECRET,
                    { expiresIn: '1d' }
                );

                console.log('Login successful for user:', email);
                res.json({ token, isAdmin: user.is_admin });

            } finally {
                client.release();
            }
        } catch (err) {
            console.error('Login error:', {
                message: err.message,
                code: err.code,
                stack: err.stack
            });
            res.status(500).json({ error: 'Server error during login' });
        }
    }
}

module.exports = new AuthController();