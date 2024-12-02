import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import History from './pages/History';
import Login from './pages/Login';
import Register from './pages/Register';
import Users from './pages/Users';
import Navbar from './components/Navbar';
import config from './config';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      console.log('API URL:', config.apiUrl);
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAdmin(false);
        return;
      }

      try {
        const response = await fetch(`${config.apiUrl}/api/auth/verify`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to verify admin status');
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Invalid response format');
        }

        const data = await response.json();
        setIsAdmin(data.isAdmin === true);
      } catch (err) {
        console.error('Error verifying admin status:', err);
        localStorage.removeItem('token');
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar isAdmin={isAdmin} />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<History />} />
            <Route path="/login" element={<Login setIsAdmin={setIsAdmin} />} />
            {isAdmin && (
              <>
                <Route path="/register" element={<Register />} />
                <Route path="/users" element={<Users />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;