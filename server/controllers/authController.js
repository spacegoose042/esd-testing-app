const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

class AuthController {
    async login(req, res) {
        console.log('=== Login Request Started ===');
        console.log('Request body:', { ...req.body, password: '[REDACTED]' });
        
        try {
            const { email, password } = req.body;
            
            // Log database connection attempt
            console.log('Attempting database connection...');
            const client = await pool.connect();
            console.log('Database connection successful');

            try {
                // Log query execution
                console.log('Executing user query for email:', email);
                const result = await client.query(
                    'SELECT id, email, password_hash, is_admin FROM users WHERE email = $1',
                    [email]
                );
                console.log('Query result rows:', result.rows.length);

                if (result.rows.length === 0) {
                    console.log('No user found with email:', email);
                    return res.status(400).json({ error: 'Invalid credentials' });
                }

                const user = result.rows[0];
                console.log('User found:', { id: user.id, email: user.email, isAdmin: user.is_admin });

                // Log password comparison
                console.log('Comparing passwords...');
                const validPassword = await bcrypt.compare(password, user.password_hash);
                console.log('Password validation result:', validPassword);

                if (!validPassword) {
                    console.log('Invalid password for user:', email);
                    return res.status(400).json({ error: 'Invalid credentials' });
                }

                // Log JWT creation
                console.log('Creating JWT token...');
                console.log('JWT Secret length:', process.env.JWT_SECRET?.length);
                const token = jwt.sign(
                    { id: user.id, isAdmin: user.is_admin },
                    process.env.JWT_SECRET,
                    { expiresIn: '1d' }
                );
                console.log('JWT token created successfully');

                console.log('Login successful for user:', { email, isAdmin: user.is_admin });
                res.json({ token, isAdmin: user.is_admin });

            } finally {
                client.release();
            }
        } catch (err) {
            console.error('Login error:', {
                message: err.message,
                code: err.code,
                stack: err.stack,
                type: err.constructor.name
            });
            res.status(500).json({ error: 'Server error during login' });
        }
        console.log('=== Login Request Ended ===');
    }
}

module.exports = new AuthController();