const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');

require('dotenv').config();

async function initializeDatabase() {
    console.log('Starting database initialization...');
    
    console.log('Database URL format:', process.env.DATABASE_URL ? 'Set' : 'Not set');

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL + "?sslmode=require",
        ssl: true
    });

    try {
        console.log('Testing database connection...');
        await pool.query('SELECT NOW()');
        console.log('Database connection successful');

        const schemaPath = path.join(__dirname, 'database', 'schema.sql');
        console.log('Reading schema from:', schemaPath);
        const schema = await fs.readFile(schemaPath, 'utf8');
        
        console.log('Executing schema...');
        await pool.query(schema);
        
        console.log('Database initialized successfully');
        return pool;
    } catch (error) {
        console.error('Database initialization error:', error);
        throw error;
    }
}

async function main() {
    let pool;
    try {
        pool = await initializeDatabase();
        console.log('Database initialization complete');
    } catch (error) {
        console.error('Failed to initialize database:', error);
        process.exit(1);
    } finally {
        if (pool) {
            await pool.end();
        }
    }
}

if (require.main === module) {
    main();
}

module.exports = { initializeDatabase }; 