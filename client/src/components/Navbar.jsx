import { Link } from 'react-router-dom';

function Navbar({ isAdmin }) {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <Link to="/" className="text-white hover:text-gray-300">Home</Link>
          <Link to="/history" className="text-white hover:text-gray-300">History</Link>
          {isAdmin && (
            <>
              <Link to="/users" className="text-white hover:text-gray-300">Users</Link>
              <Link to="/register" className="text-white hover:text-gray-300">Register</Link>
            </>
          )}
        </div>
        <div className="flex space-x-4">
          {!localStorage.getItem('token') ? (
            <Link to="/login" className="text-white hover:text-gray-300">Admin Login</Link>
          ) : (
            <button onClick={handleLogout} className="text-white hover:text-gray-300">Logout</button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;