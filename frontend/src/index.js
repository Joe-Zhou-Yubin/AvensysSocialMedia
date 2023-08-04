import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Navbar from './components/Navbar';
import Feed from './components/Feed';
import Profile from './components/Profile';
import Create from './components/Create';
import Admin from './components/Admin';
import Landing from './components/Landing';
import Signup from './components/Signup';
import Login from './components/Login';
import YourProfile from './components/YourProfile';
import UpdatePost from './components/UpdatePost';
import AdminFeed from './components/AdminFeed';
import AdminUpdate from './components/AdminUpdate';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

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

  return (
    <Router>
      {isUserLoggedIn || isAdminLoggedIn ? <Navbar /> : null}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {isAdminLoggedIn && (
          <>
            <Route path="/admin" element={<Admin />} />
            <Route path="/adminfeed" element={<AdminFeed />} />
            <Route path="/adminupdatepost/:postId" element={<AdminUpdate/>} />
          </>
        )}

        {isUserLoggedIn && (
          <>
            <Route path="/feed" element={<Feed />} />
            <Route path="/yourprofile" element={<YourProfile />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/updatepost/:postId" element={<UpdatePost />} />
            <Route path="/create" element={<Create />} />
          </>
        )}

        {/* Add a default route to handle unknown paths */}
        <Route path="/*" element={<Landing />} />
      </Routes>
    </Router>
  );
}

render(<App />, document.getElementById('root'));
