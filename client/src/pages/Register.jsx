import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config';

function Register() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        managerId: '',
        isAdmin: false,
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [managers, setManagers] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

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
                setError('Failed to load managers');
            }
        };
        fetchManagers();
    }, []);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${config.apiUrl}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    manager_id: formData.managerId || null,
                    is_admin: formData.isAdmin
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Registration failed');
            }

            const data = await response.json();
            setSuccess('User registered successfully');
            setFormData({
                firstName: '',
                lastName: '',
                managerId: '',
                isAdmin: false,
                email: '',
                password: '',
                confirmPassword: ''
            });
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Register New User
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                            {success}
                        </div>
                    )}
                    <div className="rounded-md shadow-sm space-y-4">
                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <label htmlFor="firstName" className="sr-only">First Name</label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    required
                                    className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="First Name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="lastName" className="sr-only">Last Name</label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    required
                                    className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Last Name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label htmlFor="managerId" className="block text-sm font-medium text-gray-700">Manager</label>
                            <select
                                id="managerId"
                                name="managerId"
                                required
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                value={formData.managerId}
                                onChange={handleChange}
                            >
                                <option value="">Select a Manager</option>
                                {managers.map(manager => (
                                    <option key={manager.id} value={manager.id}>
                                        {manager.first_name} {manager.last_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center space-x-2">
                                <input
                                    id="isAdmin"
                                    name="isAdmin"
                                    type="checkbox"
                                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    checked={formData.isAdmin}
                                    onChange={handleChange}
                                />
                                <label htmlFor="isAdmin" className="block text-base font-medium text-gray-900">
                                    Register as Administrator
                                </label>
                            </div>
                            
                            {formData.isAdmin && (
                                <div className="mt-4 space-y-4 pl-7">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                            Admin Email
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required={formData.isAdmin}
                                            className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="Enter admin email"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                            Password
                                        </label>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            required={formData.isAdmin}
                                            className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="Enter password"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                            Confirm Password
                                        </label>
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            required={formData.isAdmin}
                                            className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="Confirm password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Register User
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;