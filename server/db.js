const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'esd_testing_db',
    password: 'postgres',  // Replace with your actual password
    port: 5432,
});

module.exports = pool;