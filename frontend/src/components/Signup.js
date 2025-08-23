import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { setAppLanguage } from '../i18n';
import { Scanner } from '@yudiel/react-qr-scanner';
import './Signup.css';
import reachLogo from '../assets/reach-logo.png';
import { useNavigate } from 'react-router-dom';
import { FaFingerprint, FaUser } from 'react-icons/fa';

function Login() {
  const [showCamera, setShowCamera] = useState(false);
  const [camLoading, setCamLoading] = useState(false);
  const [camError, setCamError] = useState(null);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

const handleScan = (result) => {
  if (!result) return;
  const raw = result[0]?.rawValue || result;
  
  // Debug logs to see exactly what we're getting
  console.log('Raw QR content:', raw);
  console.log('Raw QR content length:', raw.length);
  console.log('Raw QR content as bytes:', Array.from(raw).map(c => c.charCodeAt(0)));
  
  try {
    // Clean the string - remove any invisible characters
    const cleanedRaw = raw.trim().replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
    console.log('Cleaned content:', cleanedRaw);
    
    // Try to parse as JSON
    const qrData = JSON.parse(cleanedRaw);
    console.log('Parsed QR data:', qrData);
    
    // Check if organization matches
    if(qrData.organization){
        if (qrData.organization === "REACH_HK") {
        console.log('Valid REACH QR:', qrData);
        setShowCamera(false);
        setCamError(null); // Clear any errors on success
        
        // Handle different user types
        if (qrData.username && qrData.username.startsWith('admin')) {
          console.log('Admin login:', qrData.username);
          navigate('/HomeAdmin');
        } else if (qrData.username && qrData.username.startsWith('teacher')) {
          console.log('Teacher login:', qrData.username);
          // TODO: Navigate to teacher dashboard
        } else {
          console.log('Student login:', qrData.username);
          navigate('/HomePage');
        }
      } else {
        setShowCamera(false); // Close camera to show error
        setCamError('Invalid organization: ' + qrData.organization);
        console.log('Invalid organization in QR:', qrData.organization);
      }
    }else{
      setShowCamera(false); // Close camera to show error
      setCamError('Invalid QR code - missing organization.');
      console.log('No organization field in QR data');
    }
  
  } catch (error) {
    // Not valid JSON
    setShowCamera(false); // Close camera to show error
    setCamError('Invalid QR code format: ' + error.message);
    console.log('JSON parsing failed:', error);
    console.log('Failed to parse:', raw);
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
          onClick={() => {
            setShowCamera(false);
            setCamError(null); // Clear errors when manually closing
          }}
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
  alignItems: 'center',
  position: 'relative',
      }}>
        {/* Language toggle */}
        <button
          type="button"
          onClick={() => setAppLanguage(i18n.language === 'en' ? 'zh' : 'en')}
          style={{
            position: 'absolute',
            top: 16,
            right: 20,
            background: '#e7e9ec',
            color: '#222',
            border: 'none',
            borderRadius: 20,
            padding: '6px 14px',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            letterSpacing: '.5px'
          }}
        >
          {i18n.language === 'en' ? '中文' : 'EN'}
        </button>
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
          <div>{t('welcome_line1')}</div>
          <div>{t('welcome_line2')}</div>
        </div>

        <div style={{
          display: 'flex',
          gap: '5vw',
          width: '100%',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '3vh'
        }}>
          {[{ label: t('login'), key: 'login', icon: '🫆'},
            { label: t('add_friend'), key: 'add_friend', icon: '👤' }].map(btn => (
            <button
              key={btn.key}
              onClick={openCamera}
              disabled={camLoading}
              style={{
                flex: '0 1 46%',
                aspectRatio: '1 / 1',
                background: btn.key === 'login' ? '#5f8f78' : '#df8d53',
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
                // background: 'linear-gradient(#ffffff,#f0f0f0)',
                borderRadius: '50%',
                marginBottom: '1.2vh',
                fontSize: '50px',
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
                {camLoading ? t('opening') : btn.label}
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
          {t('signup_prompt')}{' '}
          <span style={{ fontWeight: 700, cursor: 'pointer' }}>{t('signup_cta')}</span>
        </div>
      </div>
    </div>
  );
}

export default Login;
// ...existing code...
