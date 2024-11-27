const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');

async function initializeDatabase() {
    console.log('Starting database initialization...');
    
    if (!process.env.DATABASE_URL) {
        console.error('DATABASE_URL environment variable is not set');
        process.exit(1);
    }

    let pool;
    try {
        // Cleanup first
        pool = await cleanupDatabase();
        
        // Read and execute schema
        const schemaPath = path.join(__dirname, 'database', 'schema.sql');
        console.log('Reading schema from:', schemaPath);
        const schema = await fs.readFile(schemaPath, 'utf8');
        
        console.log('Executing schema...');
        await pool.query(schema);
        
        // Execute migrations
        const migrationPath = path.join(__dirname, 'database', 'migrations', '001_create_managers_table.sql');
        console.log('Executing migration...');
        const migration = await fs.readFile(migrationPath, 'utf8');
        await pool.query(migration);
        
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (pool) await pool.end();
    }
}

async function cleanupDatabase() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        console.log('Reading cleanup script...');
        const cleanupPath = path.join(__dirname, 'database', 'cleanup.sql');
        const cleanup = await fs.readFile(cleanupPath, 'utf8');
        
        console.log('Executing cleanup script...');
        await pool.query(cleanup);
        console.log('Database cleaned successfully');
        
        return pool;
    } catch (error) {
        console.error('Cleanup error:', error);
        throw error;
    }
}

async function main() {
    try {
        await initializeDatabase();
        console.log('Database reset and initialized successfully');
        process.exit(0);
    } catch (error) {
        console.error('Failed to initialize database:', error);
        process.exit(1);
    }
}

main();

require('dotenv').config();
initializeDatabase(); 