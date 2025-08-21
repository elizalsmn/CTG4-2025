import React from 'react';
import { Link } from 'react-router-dom';
import './Signup2.css';
import reachLogo from '../assets/reach-logo.png';

function Signup2() {
  return (
    <div className="signup2-container">
      <div className="signup2-card">

        <div className='signup2-form-section'>
          {/* Title */}
          <div className="title-text">
            <h1>Enter Full Name</h1>
          </div>

          {/* Input Field */}
          <div className="input-container">
            <input 
              type="text" 
              placeholder="Full Name" 
              className="name-input"
            />
          </div>

          {/* Login Button */}
          <button className="login-btn">
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup2;