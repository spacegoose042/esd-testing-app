const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const authController = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            console.log('Login attempt:', { email }); // Debug log

            // Find user
            const result = await pool.query(
                'SELECT * FROM users WHERE email = $1',
                [email]
            );

            if (result.rows.length === 0) {
                console.log('User not found'); // Debug log
                return res.status(400).json({ error: 'Invalid credentials' });
            }

            const user = result.rows[0];
            console.log('Found user:', { id: user.id, email: user.email }); // Debug log

            // Compare password
            const validPassword = await bcrypt.compare(password, user.password_hash);
            console.log('Password validation result:', validPassword); // Debug log

            if (!validPassword) {
                console.log('Invalid password'); // Debug log
                return res.status(400).json({ error: 'Invalid credentials' });
            }

            // Create token
            const token = jwt.sign(
                { id: user.id, isAdmin: user.is_admin },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            res.json({
                token,
                isAdmin: user.is_admin
            });
        } catch (err) {
            console.error('Login error:', err);
            res.status(500).json({ error: 'Server error' });
        }
    },

    register: async (req, res) => {
        try {
            const { first_name, last_name, manager_email, is_admin, password } = req.body;
            console.log('Registration attempt:', { first_name, last_name, manager_email, is_admin });

            let password_hash = null;
            if (is_admin) {
                if (!password) {
                    return res.status(400).json({ 
                        error: 'Password required for admin users'
                    });
                }
                const salt = await bcrypt.genSalt(10);
                password_hash = await bcrypt.hash(password, salt);
            }

            // Generate a unique email for non-admin users
            const email = is_admin ? manager_email : `${first_name.toLowerCase()}.${last_name.toLowerCase()}@company.com`;

            // Insert new user
            const result = await pool.query(
                'INSERT INTO users (first_name, last_name, email, manager_email, is_admin, password_hash) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [first_name, last_name, email, manager_email, is_admin, password_hash]
            );

            res.json({
                success: true,
                message: 'User registered successfully',
                user: {
                    id: result.rows[0].id,
                    first_name: result.rows[0].first_name,
                    last_name: result.rows[0].last_name,
                    email: result.rows[0].email,
                    manager_email: result.rows[0].manager_email,
                    is_admin: result.rows[0].is_admin
                }
            });
        } catch (err) {
            console.error('Registration error:', err);
            res.status(500).json({ error: 'Server error' });
        }
    },

    verify: async (req, res) => {
        try {
            const token = req.header('Authorization').replace('Bearer ', '');
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            const result = await pool.query(
                'SELECT is_admin FROM users WHERE id = $1',
                [decoded.id]
            );
    
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
    
            res.json({ isAdmin: result.rows[0].is_admin });
        } catch (err) {
            console.error('Token verification error:', err);
            res.status(401).json({ error: 'Please authenticate' });
        }
    }
};

module.exports = authController;