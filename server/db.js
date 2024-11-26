const { Pool } = require('pg');

// Construct database URL from environment variables
const constructDbUrl = () => {
    const dbConfig = {
        user: 'postgres',
        password: 'VnDVogYbNYZpomnNOvRRwfypItYJCskB',
        host: 'postgres.railway.internal',
        port: 5432,
        database: 'railway'
    };
    
    const url = `postgresql://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`;
    console.log('Constructed database URL (masked):', url.replace(/:[^:\/]+@/, ':****@'));
    return url;
};

const pool = new Pool({
    connectionString: constructDbUrl(),
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