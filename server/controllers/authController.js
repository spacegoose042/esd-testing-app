const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

class AuthController {
    async login(req, res) {
        console.log('\n=== Login Request Started ===');
        console.log('Environment Check:');
        console.log('- JWT_SECRET present:', !!process.env.JWT_SECRET);
        console.log('- Database Config:', {
            host: 'postgres.railway.internal',
            port: 5432,
            database: 'railway',
            user: 'postgres',
            // Log password length only
            passwordLength: 'VnDVogYbNYZpomnNOvRRwfypItYJCskB'.length
        });
        
        try {
            const { email, password } = req.body;
            console.log('Login attempt for email:', email);

            // Test database connection first
            console.log('Testing database connection...');
            const testQuery = await pool.query('SELECT 1');
            console.log('Database connection test successful');

            // Now proceed with login
            const result = await pool.query(
                'SELECT id, email, password_hash, is_admin FROM users WHERE email = $1',
                [email]
            );
            console.log('Query executed, found rows:', result.rows.length);

            if (result.rows.length === 0) {
                console.log('No user found with email:', email);
                return res.status(400).json({ error: 'Invalid credentials' });
            }

            const user = result.rows[0];
            console.log('User details:', {
                id: user.id,
                email: user.email,
                isAdmin: user.is_admin,
                hasPasswordHash: !!user.password_hash
            });

            const validPassword = await bcrypt.compare(password, user.password_hash);
            console.log('Password validation result:', validPassword);

            if (!validPassword) {
                console.log('Invalid password for user:', email);
                return res.status(400).json({ error: 'Invalid credentials' });
            }

            const token = jwt.sign(
                { id: user.id, isAdmin: user.is_admin },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            console.log('Login successful, returning response');
            res.json({ 
                token, 
                isAdmin: user.is_admin,
                userId: user.id
            });

        } catch (err) {
            console.error('Login error details:', {
                name: err.name,
                message: err.message,
                code: err.code,
                stack: err.stack?.split('\n')
            });
            res.status(500).json({ error: 'Server error during login' });
        }
        console.log('=== Login Request Ended ===\n');
    }

    async verifyToken(req, res) {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');
            
            if (!token) {
                return res.status(401).json({ isAdmin: false });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            res.json({ isAdmin: decoded.isAdmin });
        } catch (err) {
            console.error('Token verification error:', err);
            res.status(401).json({ isAdmin: false });
        }
    }

    async register(req, res) {
        try {
            const { first_name, last_name, email, password, manager_email, is_admin } = req.body;
            
            // Log sanitized request data
            console.log('Registration attempt:', {
                first_name,
                last_name,
                email,
                manager_email,
                is_admin,
                password: password ? '[REDACTED]' : undefined
            });

            // Validate required fields
            if (!first_name || !last_name || !email || !password) {
                return res.status(400).json({
                    error: 'Missing required fields',
                    required: ['first_name', 'last_name', 'email', 'password']
                });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Find manager ID if manager_email is provided
            let managerId = null;
            if (manager_email) {
                const managerResult = await pool.query(
                    'SELECT id FROM users WHERE email = $1',
                    [manager_email]
                );
                if (managerResult.rows.length > 0) {
                    managerId = managerResult.rows[0].id;
                }
            }

            // Insert new user
            const result = await pool.query(
                `INSERT INTO users (first_name, last_name, email, password_hash, manager_id, is_admin)
                 VALUES ($1, $2, $3, $4, $5, $6)
                 RETURNING id, first_name, last_name, email, is_admin`,
                [first_name, last_name, email, hashedPassword, managerId, is_admin || false]
            );

            res.status(201).json({
                message: 'User registered successfully',
                user: result.rows[0]
            });

        } catch (err) {
            console.error('Registration error details:', {
                message: err.message,
                code: err.code,
                stack: err.stack,
                detail: err.detail
            });
            
            if (err.code === '23505') { // Unique violation
                return res.status(400).json({
                    error: 'Email already exists',
                    code: err.code
                });
            }
            
            res.status(500).json({
                error: 'Error registering user',
                code: err.code
            });
        }
    }
}

module.exports = new AuthController();