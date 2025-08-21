import React from 'react';
import { Link } from 'react-router-dom';
import './Signup.css';
import reachLogo from '../assets/reach-logo.png';

function Login() {
  return (
    <div className="login-container">
      <div className="login-card">
        {/* Logo */}
        <div className="logo-container">
          <img 
            src={reachLogo} 
            alt="Project Reach Logo" 
            className="logo"
          />
        </div>
    <div className='form-section'>
            {/* Welcome Text */}
            <div className="welcome-text">
            <h1>Welcome</h1>
            <h1>Back!</h1>
            </div>

            {/* Scan QR Button */}
            <button className="scan-qr-btn">
            Scan QR
            </button>

            {/* Sign Up Link */}
            <div className="signup-text">
            <span>Don't have an account? </span>
            <Link to="/signup2" className="signup-link">Sign Up</Link>
            </div>
    </div>

      </div>
    </div>
  );
}

export default Login;