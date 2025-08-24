import React from 'react';
import { Link } from 'react-router-dom';
import './Signup2.css';
import reachLogo from '../assets/reach-logo.png';
import { useTranslation } from 'react-i18next';

function Signup2() {
  const { t } = useTranslation();
  return (
    <div className="signup2-container">
      <div className="signup2-card">

        <div className='signup2-form-section'>
          {/* Title */}
          <div className="title-text">
            <h1>{t('s2_enter_date_of_birth')}</h1>
          </div>

          {/* Input Field */}
          <div className="input-container">
            <input 
              type="text" 
              placeholder={t('s2_full_name_placeholder')} 
              className="name-input"
            />
          </div>

          {/* Login Button */}
          <button className="login-btn">
            {t('s2_login')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup2;