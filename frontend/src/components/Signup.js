import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Scanner } from '@yudiel/react-qr-scanner';
import './Signup.css';
import reachLogo from '../assets/reach-logo.png';

function Login() {
  const [showCamera, setShowCamera] = useState(false);

  const handleScan = (result) => {
    if (result) {
      console.log('QR Code scanned:', result[0].rawValue);
      setShowCamera(false);
      // Handle the scanned data here
    }
  };

  const handleError = (error) => {
    console.error('QR Scanner error:', error);
  };

  const openCamera = () => {
    setShowCamera(true);
  };

  if (showCamera) {
    return (
      <div className="camera-container" style={{ width: '100vw', height: '100vh' }}>
        <Scanner
          onScan={handleScan}
          onError={handleError}
          constraints={{ facingMode: 'environment' }}
        />
        <button 
          onClick={() => setShowCamera(false)}
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '10px 20px',
            background: '#6b9b7a',
            color: 'white',
            border: 'none',
            borderRadius: '10px'
          }}
        >
          Close Camera
        </button>
      </div>
    );
  }

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
          <button onClick={openCamera} className="scan-qr-btn">
            Scan QR
          </button>

          {/* Sign Up Link */}
          <div className="signup-text">
            <span>Don't have an account? </span>
            {/* Temporary, just for now until we have the sign up page, currently leads to page after scanning QR */}
            <Link to="/signup2" className="signup-link">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;