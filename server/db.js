const { Pool } = require('pg');

// Construct database URL from environment variables
const constructDbUrl = () => {
    // Use the direct Railway-provided URL if available
    if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('${{')) {
        return process.env.DATABASE_URL;
    }

    // Fallback to constructing from individual variables
    const dbConfig = {
        user: 'postgres',  // Railway default
        password: process.env.POSTGRES_PASSWORD,
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

// Test connection immediately and log detailed info
(async () => {
    try {
        const client = await pool.connect();
        console.log('Database connection test:');
        console.log('- Connected successfully');
        console.log('- Using password:', process.env.POSTGRES_PASSWORD ? 'Yes (length: ' + process.env.POSTGRES_PASSWORD.length + ')' : 'No');
        console.log('- Database name:', process.env.POSTGRES_DB || 'railway');
        
        const result = await client.query('SELECT current_database(), current_user');
        console.log('- Current database:', result.rows[0].current_database);
        console.log('- Current user:', result.rows[0].current_user);
        
        client.release();
    } catch (err) {
        console.error('Database connection error:', {
            message: err.message,
            code: err.code,
            detail: err.detail,
            hint: err.hint
        });
        // Don't exit, but make sure error is very visible
        console.error('🚨 DATABASE CONNECTION FAILED 🚨');
    }
})();

module.exports = pool;