import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from './logo.png';
import axios from 'axios';

const boldTextStyle = { color: '#CD5E77', fontWeight: 'bold' };

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleNavCollapse = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };

  useEffect(() => {
    // Check if the user is logged in as a regular user
    axios.get('/loggedinuser')
      .then((response) => {
        setIsUserLoggedIn(response.data);
      })
      .catch((error) => {
        console.error('Error checking user login:', error);
        setIsUserLoggedIn(false);
      });

    // Check if the user is logged in as an admin
    axios.get('/loggedinadmin')
      .then((response) => {
        setIsAdminLoggedIn(response.data);
      })
      .catch((error) => {
        console.error('Error checking admin login:', error);
        setIsAdminLoggedIn(false);
      });
  }, []);

  const handleLogout = () => {
    axios.post('http://localhost:8080/logout')
      .then((response) => {
        console.log('Logout successful:', response.data);
        // Redirect to the login page after logout
        navigate('/login');
      })
      .catch((error) => {
        console.error('Logout failed:', error);
        // Handle logout error here (e.g., show an error message to the user)
      });
  };

  const isLandingPage = location.pathname === '/';
  if (isLandingPage) {
    return null;
  }

  const isLoginPage = location.pathname === '/login';
  if (isLoginPage) {
    return null;
  }

  const isSignupPage = location.pathname === '/signup';
  if (isSignupPage) {
    return null;
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: '#e6e6fa' }}>
      {/* Placeholder image */}
      <img width={150} src={Logo} alt="Logo" className="navbar-brand" />

      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded={!isNavCollapsed}
        aria-label="Toggle navigation"
        onClick={handleNavCollapse}
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      
      <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse `} id="navbarNav">
        <ul className="navbar-nav mr-auto">
          {/* Link to Feed.js */}
          <li className="nav-item">
            <Link to="/feed" className="nav-link" style={boldTextStyle}>
              Feed
            </Link>
          </li>

          {/* Link to yourProfile.js */}
          <li className="nav-item">
            <Link to="/yourprofile" className="nav-link" style={boldTextStyle}>
              Profile
            </Link>
          </li>

          {/* Link to Create.js with a placeholder symbol of "+" */}
          <li className="nav-item">
            <Link to="/create" className="nav-link" style={boldTextStyle}>
              Create
            </Link>
          </li>
        

        {/* Links for Admin Dashboard and AdminFeed */}
        
          {isAdminLoggedIn && (
            <>
              <li className="nav-item">
                <Link to="/admin" className="nav-link" style={boldTextStyle}>
                  UserDashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/adminfeed" className="nav-link" style={boldTextStyle}>
                  AdminFeed
                </Link>
              </li>
            </>
          )}
          </ul>
          <ul className="navbar-nav ml-auto">
          {/* Logout button */}
          {isUserLoggedIn ? (
            <li className="nav-item">
              <button className="btn btn-link nav-link" style={boldTextStyle} onClick={handleLogout}>
                Logout
              </button>
            </li>
          ) : (
            <></>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
