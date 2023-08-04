import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: '#e6e6fa'
  };
  
  const formStyle = {
    width: '300px',
    padding: '20px',
    background: '#ffffff',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  };
  
  const submitButtonStyle = {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    background: 'transparent',
    border: '2px solid #FFB6C1', 
    color: '#FFB6C1', 
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.3s', 
  };

  const submitButtonHoverStyle = {
    backgroundColor: '#FFB6C1',
    color: 'white', 
    textDecoration: 'none',
  };

function Login() {

  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/login', { username, password })
      .then((response) => {
        console.log('Login successful:', response.data);
        if (response.data.loginSuccessful) {
          navigate('/feed');
          window.location.reload();
        } else {
          setLoginError('Login failed. Please check your username and password.');
        }
      })
      .catch((error) => {
        console.error('Login failed:', error);
        setLoginError('Login failed. Please check your username and password.');
      });
  };
  
  

  return (
    <div style={containerStyle}>
      <form style={formStyle} onSubmit={handleLogin}>
      <div className="form-group" style={{ display: 'flex', alignItems: 'center' }}>
      <button
  type="button"
  className="btn btn-link"
  style={{ textDecoration: 'none', color: '#007bff', fontSize: '16px' }}
  onClick={() => navigate('/')}
>
  Back
</button>

          <h3 style={{ flex: 1 }}>Please Log In</h3>
        </div>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <br />
        <button type="submit" className="btn" style={{ ...submitButtonStyle, ...submitButtonHoverStyle }}>
          Log in
        </button>
        {loginError && <p style={{ color: 'red', marginTop: '10px' }}>{loginError}</p>}
      </form>
    </div>
  )
}

export default Login