import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchUser = () => {
    const userData = localStorage.getItem('user');
    setUser(userData ? JSON.parse(userData) : null);
  };

  useEffect(() => {
    // Fetch user data on component mount
    fetchUser();

    // Add event listener for storage changes (when user logs in/out)
    const handleStorageChange = () => {
      fetchUser();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      // Cleanup the event listener on unmount
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    // Clear user data from localStorage and reset the user state
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">
          BloG
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/dash">
                Profile          
              </Link>
            </li>

            {user ? (
              // Show username and Logout button when the user is logged in
              <>
                <li className="nav-item">
                  <span className="nav-link">
                    {user.username}
                  </span>
                </li>
             
                <li className="nav-item">
                  <button className="btn btn-warning ms-lg-2" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              // Show Register and Login buttons when no user is logged in
              <>
                <li className="nav-item">
                  <Link className="btn btn-warning ms-lg-4" to="/register">
                    Register
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-warning ms-lg-2" to="/login">
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
