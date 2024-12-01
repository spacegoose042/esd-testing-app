// In the get users endpoint
const result = await pool.query(`
    SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.is_admin,
        m.first_name as manager_first_name,
        m.last_name as manager_last_name
    FROM users u
    LEFT JOIN users m ON u.manager_id = m.id
    ORDER BY u.last_name, u.first_name
`);