import { useState, useEffect } from 'react';
import UserEdit from '../components/UserEdit';
import config from '../config';

function Users() {
    const [users, setUsers] = useState([]);
    const [editingUserId, setEditingUserId] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedManagerId, setSelectedManagerId] = useState('');
    const [sortField, setSortField] = useState('last_name');
    const [sortDirection, setSortDirection] = useState('asc');
    const [searchTerm, setSearchTerm] = useState('');
    const [managers, setManagers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${config.apiUrl}/api/users`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                console.log('Raw user data:', data);
                
                const transformedData = data.map(user => ({
                    ...user,
                    fullName: `${user.first_name} ${user.last_name}`,
                    managerName: user.manager_first_name && user.manager_last_name 
                        ? `${user.manager_first_name} ${user.manager_last_name}`
                        : 'No Manager'
                }));
                
                console.log('Transformed user data:', transformedData);
                setUsers(transformedData);
            } catch (err) {
                console.error('Error fetching users:', err);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const fetchManagers = async () => {
            try {
                const response = await fetch(`${config.apiUrl}/api/managers`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                setManagers(data);
            } catch (err) {
                console.error('Error fetching managers:', err);
            }
        };
        fetchManagers();
    }, []);

    const handleDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) throw new Error('Failed to delete user');
            
            setSuccess('User deleted successfully');
            fetchUsers();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to delete user');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleBulkManagerUpdate = async () => {
        if (!selectedManagerId || selectedUsers.length === 0) return;

        try {
            const response = await fetch(`${config.apiUrl}/api/users/bulk-update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    userIds: selectedUsers,
                    managerId: selectedManagerId
                })
            });

            if (!response.ok) throw new Error('Failed to update users');
            
            setSuccess('Users updated successfully');
            fetchUsers(); // Refresh the users list
            setSelectedUsers([]); // Clear selection
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message);
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const sortedAndFilteredUsers = users
        .filter(user => 
            user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.managerName.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            let compareA, compareB;
            
            switch (sortField) {
                case 'name':
                    compareA = a.fullName;
                    compareB = b.fullName;
                    break;
                case 'manager_name':
                    compareA = a.managerName;
                    compareB = b.managerName;
                    break;
                case 'is_admin':
                    compareA = a.is_admin ? '1' : '0';
                    compareB = b.is_admin ? '1' : '0';
                    break;
                default:
                    compareA = a[sortField];
                    compareB = b[sortField];
            }
            
            return sortDirection === 'asc' 
                ? compareA.toString().localeCompare(compareB.toString())
                : compareB.toString().localeCompare(compareA.toString());
        });

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">User Management</h1>

            {(error || success) && (
                <div className={`mb-4 p-3 border rounded ${
                    error ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700'
                }`}>
                    {error || success}
                </div>
            )}

            <div className="mb-6 space-y-4">
                <div className="flex space-x-4">
                    <input
                        type="text"
                        placeholder="Search by name or manager..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 p-2 border rounded"
                    />
                    <select
                        value={selectedManagerId}
                        onChange={(e) => setSelectedManagerId(e.target.value)}
                        className="p-2 border rounded"
                    >
                        <option value="">Select Manager</option>
                        {managers.map(manager => (
                            <option key={manager.id} value={manager.id}>
                                {manager.first_name} {manager.last_name}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleBulkManagerUpdate}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        disabled={selectedUsers.length === 0}
                    >
                        Update Selected
                    </button>
                </div>
            </div>

            <div className="bg-white shadow-md rounded my-6">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">
                                <input
                                    type="checkbox"
                                    onChange={(e) => {
                                        setSelectedUsers(e.target.checked ? users.map(u => u.id) : []);
                                    }}
                                    checked={selectedUsers.length === users.length}
                                />
                            </th>
                            <th 
                                className="py-3 px-6 text-left cursor-pointer hover:bg-gray-300"
                                onClick={() => handleSort('name')}
                            >
                                Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th 
                                className="py-3 px-6 text-left cursor-pointer hover:bg-gray-300"
                                onClick={() => handleSort('manager_name')}
                            >
                                Manager {sortField === 'manager_name' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th 
                                className="py-3 px-6 text-left cursor-pointer hover:bg-gray-300"
                                onClick={() => handleSort('is_admin')}
                            >
                                Admin {sortField === 'is_admin' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="py-3 px-6 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm">
                        {sortedAndFilteredUsers.map(user => (
                            <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.includes(user.id)}
                                        onChange={(e) => {
                                            setSelectedUsers(prev => 
                                                e.target.checked
                                                    ? [...prev, user.id]
                                                    : prev.filter(id => id !== user.id)
                                            );
                                        }}
                                    />
                                </td>
                                <td className="py-3 px-6 text-left whitespace-nowrap">
                                    {user.fullName}
                                </td>
                                <td className="py-3 px-6 text-left whitespace-nowrap">
                                    {user.managerName}
                                </td>
                                <td className="py-3 px-6 text-left">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        user.is_admin 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {user.is_admin ? 'Yes' : 'No'}
                                    </span>
                                </td>
                                <td className="py-3 px-6 text-left">
                                    <button
                                        onClick={() => setEditingUserId(user.id)}
                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editingUserId && (
                <UserEdit
                    userId={editingUserId}
                    onClose={() => setEditingUserId(null)}
                    onUpdate={fetchUsers}
                />
            )}
        </div>
    );
}

export default Users;