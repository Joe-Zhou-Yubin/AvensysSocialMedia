import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { firestore } from '../firebase';
import axios from 'axios';
import { collection, addDoc } from 'firebase/firestore';

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  background: '#e6e6fa',
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

function Signup() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUsernameError('');
    setEmailError('');
    setPasswordError('');
    setErrorMessage('');
    
    let hasErrors = false;

    // Check if the username is required
    if (user.username.trim() === '') {
      setUsernameError('Username is required.');
      hasErrors = true;
    }

    // Check if the email is required
    if (user.email.trim() === '') {
      setEmailError('Email is required.');
      hasErrors = true;
    }

    // Check if the password is required
    if (user.password.trim() === '') {
      setPasswordError('Password is required.');
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    // Assuming the API call to the backend to create the user and save it in Firestore
    axios.post('http://localhost:8080/createuser', user)
      .then((response) => {
        console.log(response);
        const { data } = response;

        // Check if the username is already taken
        if (data.isUsernameExists) {
          setUsernameError('Username already taken.');
          hasErrors = true;
        }

        // Check if the email is already registered
        if (data.isEmailExists) {
          setEmailError('Email already registered.');
          hasErrors = true;
        }

        if (hasErrors) {
          return;
        }

        // Assuming the server returns the newly created user data in the response
        const createdUser = data.user;

        // Assuming that the server returns the newly created user data
        const db = firestore;
        addDoc(collection(db, 'users'), createdUser)
          .then(() => {
            console.log('User created successfully in Firestore!');
            navigate('/login');
          })
          .catch((error) => {
            console.error('Error creating user in Firestore: ', error);
            setErrorMessage('Failed to create and save the new user in Firestore: ' + error.message);
            navigate('/signup');
          });
      })
      .catch((error) => {
        console.error('Error creating user on the server: ', error.response.data);

        // Convert the error response to error messages and display on HTML page
        const { isUsernameExists, isEmailExists, isPasswordValid, isUsernameRequired, isEmailRequired } = error.response.data;

        if (isUsernameExists) {
          setUsernameError('Username already taken.');
        }

        if (isUsernameRequired) {
          setUsernameError('Username is required.');
        }
        if (isEmailRequired){
          setEmailError('Email is required.');
        }
        if (isEmailExists) {
          setEmailError('Email already registered.');
        }
        // Check other error conditions and set respective error messages

        // Display the error message on your HTML page
        setErrorMessage('Failed to create and save the new user on the server. Please check the form for errors.');
        // Alternatively, you can set a specific error message based on the combination of errors received from the server.
        // setErrorMessage('Failed to create and save the new user on the server: ' + error.response.data);
      });
  };
  
  
  
  

  return (
    <div style={containerStyle}>
      <form style={formStyle} onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            className="form-control"
            value={user.username}
            onChange={handleChange}
          />
          {usernameError && <p style={{ color: 'red' }}>{usernameError}</p>}
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            name="email"
            className="form-control"
            value={user.email}
            onChange={handleChange}
          />
          {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            value={user.password}
            onChange={handleChange}
          />
          {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
        </div>
        <br />
        <button
          type="submit"
          className="btn"
          style={{ ...submitButtonStyle, ...submitButtonHoverStyle }}
        >
          Sign up
        </button>
        {/* Display the error message */}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </form>
    </div>
  );
}

export default Signup;
