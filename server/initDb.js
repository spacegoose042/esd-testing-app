const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');

async function initializeDatabase() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        // Read the schema file
        const schemaPath = path.join(__dirname, 'database', 'schema.sql');
        const schema = await fs.readFile(schemaPath, 'utf8');

        // Execute the schema
        await pool.query(schema);
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        await pool.end();
    }
}

require('dotenv').config();
initializeDatabase(); 