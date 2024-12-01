const getUsers = async (req, res) => {
    try {
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

        const users = result.rows.map(user => ({
            ...user,
            fullName: `${user.first_name} ${user.last_name}`,
            managerName: user.manager_first_name && user.manager_last_name 
                ? `${user.manager_first_name} ${user.manager_last_name}`
                : 'No Manager'
        }));

        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Server error' });
    }
};