import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import History from './pages/History';
import Login from './pages/Login';
import Register from './pages/Register';
import Users from './pages/Users';
import Navbar from './components/Navbar';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAdmin(false);
        return;
      }

      try {
        const response = await fetch(`${window.__APP_CONFIG__.apiUrl}/api/auth/verify`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        
        if (response.ok && data.isAdmin) {
          setIsAdmin(true);
        } else {
          localStorage.removeItem('token');
          setIsAdmin(false);
        }
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