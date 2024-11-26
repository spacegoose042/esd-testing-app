const { Pool } = require('pg');

// Construct database URL from environment variables
const constructDbUrl = () => {
    const dbConfig = {
        user: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD,
        host: 'postgres.railway.internal',
        port: process.env.PGPORT || 5432,
        database: process.env.POSTGRES_DB || 'railway'
    };
    
    return `postgresql://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`;
};

const dbUrl = constructDbUrl();
console.log('Database connection string (masked):', dbUrl.replace(/:[^:\/]+@/, ':****@'));

const pool = new Pool({
    connectionString: dbUrl,
    ssl: {
        rejectUnauthorized: false
    }
});

// Test connection immediately
(async () => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW()');
        console.log('Database connected successfully at:', result.rows[0].now);
        client.release();
    } catch (err) {
        console.error('Database connection error:', {
            message: err.message,
            code: err.code,
            stack: err.stack
        });
    }
})();

module.exports = pool;