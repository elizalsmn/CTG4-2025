import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Scanner } from '@yudiel/react-qr-scanner';
import './Signup.css';
import reachLogo from '../assets/reach-logo.png';
import { FaFingerprint, FaUser } from 'react-icons/fa';

function Login() {
  const [showCamera, setShowCamera] = useState(false);
  const [camLoading, setCamLoading] = useState(false);
  const [camError, setCamError] = useState(null);

  const handleScan = (result) => {
    if (result) {
      console.log('QR:', result[0]?.rawValue || result);
      setShowCamera(false);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const openCamera = async () => {
    setCamError(null);
    setCamLoading(true);
    try {
      // Preflight request to trigger permission prompt
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Release immediately; Scanner will request again
      stream.getTracks().forEach(t => t.stop());
      setShowCamera(true);
    } catch (e) {
      if (e.name === 'NotAllowedError') {
        setCamError('Camera permission denied. Allow it in site/browser settings and retry.');
      } else if (e.name === 'NotFoundError') {
        setCamError('No camera device found.');
      } else if (e.name === 'NotReadableError') {
        setCamError('Camera busy (used by another app). Close other apps and retry.');
      } else {
        setCamError('Camera error: ' + e.name);
      }
    } finally {
      setCamLoading(false);
    }
  };

  if (showCamera) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999
      }}>
        <Scanner
          onScan={handleScan}
          onError={handleError}
          constraints={{ facingMode: 'environment' }}
          style={{ width: '100%', maxWidth: 500 }}
        />
        <button
          onClick={() => setShowCamera(false)}
          style={{
            marginTop: 20,
            padding: '12px 28px',
            background: '#6b9b7a',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fafafa',
      padding: '0 4vw',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <div style={{
        background: '#fafafa',
        width: '100%',
        maxWidth: 760,
        borderRadius: 48,
        padding: '6vh 6vw 4vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <img
          src={reachLogo}
          alt="Project Reach"
          style={{
            width: '32vw',
            maxWidth: 230,
            height: 'auto',
            marginTop: '2vh',
            marginBottom: '32vh',
            objectFit: 'contain'
          }}
        />

        <div style={{
          width: '100%',
            fontSize: '8vw',
            maxWidth: 560,
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: '-0.5px',
            marginBottom: '4vh'
        }}>
          <div>Welcome</div>
          <div>Back!</div>
        </div>

        <div style={{
          display: 'flex',
          gap: '5vw',
          width: '100%',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '3vh'
        }}>
          {[{ label: 'Login', icon: <FaFingerprint size="34%" /> },
            { label: 'Add Friend', icon: <FaUser size="34%" /> }].map(btn => (
            <button
              key={btn.label}
              onClick={openCamera}
              disabled={camLoading}
              style={{
                flex: '0 1 46%',
                aspectRatio: '1 / 1',
                background: btn.label === 'Login' ? '#5f8f78' : '#df8d53',
                border: 'none',
                borderRadius: 12,
                color: '#fff',
                fontSize: '3.4vw',
                fontWeight: 600,
                cursor: camLoading ? 'wait' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                opacity: camLoading ? 0.7 : 1
              }}
            >
              <div style={{
                width: '42%',
                height: '42%',
                minWidth: 60,
                minHeight: 60,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2b2b2b',
                background: 'linear-gradient(#ffffff,#f0f0f0)',
                borderRadius: '50%',
                marginBottom: '1.2vh',
                fontSize: 0
              }}>
                {btn.icon}
              </div>
              <span style={{
                fontSize: '3.4vw',
                maxWidth: 120,
                fontWeight: 600,
                color: '#fff',
                lineHeight: 1.1
              }}>
                {camLoading ? 'Opening...' : btn.label}
              </span>
            </button>
          ))}
        </div>

        {camError && (
          <div style={{
            color: '#b00020',
            fontSize: '3.2vw',
            maxWidth: 420,
            textAlign: 'center',
            marginBottom: '2vh'
          }}>
            {camError}
          </div>
        )}

        <div style={{
          fontSize: '3.6vw',
          maxWidth: 320,
          textAlign: 'center',
          fontWeight: 400
        }}>
          Don't have an account?{' '}
          <span style={{ fontWeight: 700, cursor: 'pointer' }}>Sign Up</span>
        </div>
      </div>
    </div>
  );
}

export default Login;
// ...existing code...
