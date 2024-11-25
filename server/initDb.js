const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');

async function initializeDatabase() {
    console.log('Starting database initialization...');
    
    if (!process.env.DATABASE_URL) {
        console.error('DATABASE_URL environment variable is not set');
        process.exit(1);
    }

    console.log('Using DATABASE_URL:', process.env.DATABASE_URL.split('@')[1]);
    
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        // Test connection
        console.log('Testing database connection...');
        const testResult = await pool.query('SELECT NOW()');
        console.log('Connection successful, server time:', testResult.rows[0].now);

        // Read the schema file
        const schemaPath = path.join(__dirname, 'database', 'schema.sql');
        console.log('Reading schema from:', schemaPath);
        const schema = await fs.readFile(schemaPath, 'utf8');
        console.log('Schema file loaded successfully');

        // Execute the schema
        console.log('Executing schema...');
        await pool.query(schema);
        console.log('Database schema initialized successfully');
    } catch (error) {
        console.error('Error details:', error.message);
        if (error.code === 'ENOTFOUND') {
            console.error('Could not resolve database hostname. Check DATABASE_URL format.');
        }
    } finally {
        await pool.end();
    }
}

require('dotenv').config();
initializeDatabase(); 