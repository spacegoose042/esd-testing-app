const { Pool } = require('pg');

// Construct the connection URL from individual parts if needed
const constructDbUrl = () => {
    if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('${{')) {
        return process.env.DATABASE_URL;
    }
    
    return `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@postgres.railway.internal:5432/${process.env.POSTGRES_DB}`;
};

console.log('Attempting database connection with:', constructDbUrl().replace(/:[^:\/]+@/, ':****@'));

const pool = new Pool({
    connectionString: constructDbUrl(),
    ssl: {
        rejectUnauthorized: false
    }
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Database connected successfully');
    }
});

module.exports = pool;