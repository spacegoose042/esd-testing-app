import { useState, useEffect } from 'react';

function Home() {
    const [userId, setUserId] = useState('');
    const [period, setPeriod] = useState('morning');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [todayTests, setTodayTests] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
      const token = localStorage.getItem('token');
      // If there's no token, we'll still fetch users but might get a limited list
      fetch(`${window.__APP_CONFIG__.apiUrl}/api/users`, {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      })
      .then(res => {
          if (!res.ok) {
              // If unauthorized, we might want to show a message or handle differently
              if (res.status === 401) {
                  console.log('Unauthorized access - limited user list will be shown');
                  return [];
              }
              throw new Error('Failed to fetch users');
          }
          return res.json();
      })
      .then(data => {
          console.log('Received users data:', data);
          setUsers(data);
      })
      .catch(err => {
          console.error('Error fetching users:', err);
          setError('Failed to load users');
      });
  }, []);

    const clearForm = () => {
        setUserId('');
        setPeriod('morning');
        setTodayTests([]);
    };

    const handleSubmit = async (testValue) => {
        setError('');
        setSuccess('');

        if (!userId) {
            setError('Please select a user');
            return;
        }

        // Debug logs
        console.log('Button clicked with testValue:', testValue);
        console.log('Current period state:', period);
        console.log('Current userId state:', userId);

        const payload = {
            user_id: userId,
            test_period: period,  // Use period directly without any transformation
            passed: testValue === 'PASS'
        };

        console.log('Sending payload:', payload);

        try {
            const response = await fetch(`${window.__APP_CONFIG__.apiUrl}/api/tests/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            const data = await response.json();
            console.log('Server response:', data);

            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit test');
            }

            setSuccess(`Test submitted successfully: ${testValue}`);
            setTimeout(() => {
                setSuccess('');
                clearForm();
            }, 2000);

        } catch (err) {
            console.error('Error in handleSubmit:', err);
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-8">
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
                Test Submission
            </h1>
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-xl w-full">
                {error && (
                    <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                    </div>
                )}
                {success && (
                    <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
                        <p className="font-bold">Success!</p>
                        <p>{success}</p>
                    </div>
                )}

                <div className="mb-8">
                    <label className="block text-gray-700 text-xl font-bold mb-4" htmlFor="userId">
                        Select Your Name
                    </label>
                    <select
                        id="userId"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        className="shadow border rounded w-full py-4 px-3 text-gray-700 text-lg mb-6 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    >
                        <option value="">Select a user...</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.first_name} {user.last_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-8">
                    <label className="block text-gray-700 text-xl font-bold mb-4 text-center">
                        Test Period
                    </label>
                    <div className="flex justify-center space-x-8 mb-6">
                        <button
                            onClick={() => setPeriod('morning')}
                            className={`py-6 px-12 rounded-lg text-xl font-bold text-white relative ${
                                period === 'morning' 
                                ? 'bg-blue-600 hover:bg-blue-700' 
                                : 'bg-blue-400 hover:bg-blue-500'
                            }`}
                        >
                            Morning Test
                            {period === 'morning' && (
                                <svg 
                                    className="absolute top-2 right-2 h-6 w-6" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M5 13l4 4L19 7" 
                                    />
                                </svg>
                            )}
                        </button>
                        <button
                            onClick={() => setPeriod('evening')}
                            className={`py-6 px-12 rounded-lg text-xl font-bold text-white relative ${
                                period === 'evening' 
                                ? 'bg-purple-600 hover:bg-purple-700' 
                                : 'bg-purple-400 hover:bg-purple-500'
                            }`}
                        >
                            Evening Test
                            {period === 'evening' && (
                                <svg 
                                    className="absolute top-2 right-2 h-6 w-6" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M5 13l4 4L19 7" 
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                <div className="flex justify-center space-x-8">
                    <button
                        onClick={() => handleSubmit('PASS')}
                        className="bg-green-500 hover:bg-green-700 text-white text-xl font-bold py-6 px-12 rounded-lg focus:outline-none focus:shadow-outline"
                    >
                        PASS
                    </button>
                    <button
                        onClick={() => handleSubmit('FAIL')}
                        className="bg-red-500 hover:bg-red-700 text-white text-xl font-bold py-6 px-12 rounded-lg focus:outline-none focus:shadow-outline"
                    >
                        FAIL
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Home;