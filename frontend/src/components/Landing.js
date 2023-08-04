import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './logo.png';
import '../style.css'

const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: '#e6e6fa', /* Set the background color to the desired color */
  };

const buttonStyle = {
    padding: '10px 20px',
    fontSize: '1rem',
    border: '2px solid #CD5E77', 
    background: 'transparent',
    color: '#CD5E77', 
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background 0.3s, color 0.3s, border-color 0.3s',
    textDecoration: 'none', 
    margin: '0 10px', 
  };
  
  const buttonHoverStyle = {
    background: '#CD5E77', 
    color: 'white', 
    borderColor: '#CD5E77', 
  };

function Landing() {
  return (
    <div style={{ ...containerStyle, background: '#e6e6fa' }}>
      <img width={500} src={Logo} alt="Logo" className="img-fluid mb-4" />
      <h1 style={{ color: '#CD5E77' }}>Welcome to PastelPals</h1>
      <br></br>
      <div className="mt-4">
        <Link to="/login" className="btn btn-lg" style={{ ...buttonStyle, ...buttonHoverStyle }}>
          Log in
        </Link>
        <Link to="/signup" className="btn btn-lg" style={{ ...buttonStyle, ':hover':{...buttonHoverStyle }}}>
          Sign up
        </Link>
      </div>
    </div>
  );
}

export default Landing;
