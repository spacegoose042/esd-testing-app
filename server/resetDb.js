const { Pool } = require('pg');
require('dotenv').config();

async function resetDatabase() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        // Drop all tables
        await pool.query(`
            DROP TABLE IF EXISTS notifications CASCADE;
            DROP TABLE IF EXISTS esd_tests CASCADE;
            DROP TABLE IF EXISTS settings CASCADE;
            DROP TABLE IF EXISTS users CASCADE;
            DROP TABLE IF EXISTS managers CASCADE;
        `);
        console.log('Database reset successful');
    } catch (error) {
        console.error('Reset error:', error);
    } finally {
        await pool.end();
    }
}

if (require.main === module) {
    resetDatabase();
} 