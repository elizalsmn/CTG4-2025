import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChild, FaUserEdit, FaPhoneAlt, FaLanguage, FaQrcode, FaPen, FaChevronDown } from 'react-icons/fa';
import avatarPlaceholder from '../assets/avatar-placeholder.jpg';

const rowStyle = {
  padding: '18px 20px 6px',
  borderBottom: '1px solid #eef0f2',
  display: 'flex',
  flexDirection: 'column'
};

const topLineStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  fontSize: 18,
  color: '#45505c',
  fontWeight: 500
};

function Profile() {
  const { t, i18n } = useTranslation();
  const [childName, setChildName] = useState('');
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const langMap = { en: 'english', zh: 'chinese' };
  const revLangMap = { english: 'en', chinese: 'zh' };
  const initialLang = typeof window !== 'undefined' ? (localStorage.getItem('lang') || i18n.language) : i18n.language;
  const [language, setLanguage] = useState(langMap[initialLang] || 'english');
  // keep local state in sync if language toggled elsewhere
  useEffect(() => {
    setLanguage(langMap[i18n.language] || 'english');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);
  const [touched, setTouched] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const languageWrapperRef = useRef(null);
  // t can now be used for future translated labels in this form

  // Close language dropdown on outside click
  useEffect(() => {
    if (!languageOpen) return;
    const handler = (e) => {
      if (languageWrapperRef.current && !languageWrapperRef.current.contains(e.target)) {
        setLanguageOpen(false);
      }
    };
    window.addEventListener('pointerdown', handler);
    return () => window.removeEventListener('pointerdown', handler);
  }, [languageOpen]);

  const childInvalid = touched && !childName.trim();

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (childInvalid) return;
    console.log({ childName, parentName, phone, language });
    alert('Saved (prototype)');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f4f5f8',
      fontFamily: 'system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
      display: 'flex',
      justifyContent: 'center',
      padding: '0 12px'
    }}>
       <form onSubmit={handleSubmit} style={{
        width: '100%',
        maxWidth: 640,
        background: '#fff',
        borderRadius: 12,
        // overflow: 'hidden',   // REMOVE this
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        overflow: 'visible',     // ensure dropdown can extend
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          background: '#f5f4fa',
          padding: '25px 28px 36px',
          textAlign: 'center',
          position: 'relative'
        }}>
          {/* <div style={{ position: 'absolute', top: 14, right: 60, cursor: 'pointer', color: '#1f2731' }}>
            <FaQrcode size={22} />
          </div>
            <div style={{ position: 'absolute', top: 14, right: 20, cursor: 'pointer', color: '#1f2731' }}>
            <FaPen size={20} />
          </div> */}
          <img
            src={avatarPlaceholder}
            alt="Profile avatar"
            style={{
              width: 132,
              height: 132,
              margin: '0 auto 20px',
              borderRadius: '50%',
              objectFit: 'cover',
              display: 'block',
              background: '#f1dde3'
            }}
          />
          <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 6, color: '#1f2731' }}>
            {t('profile_header')}
          </div>
          {/* <div style={{ fontSize: 16, color: '#4a5662' }}>
            (929) 617-0714
          </div> */}
        </div>

        {/* Rows */}
        <div>

          {/* Child's Name */}
          <div style={rowStyle}>
            <div style={topLineStyle}>
              <FaChild size={24} />
              <span>{t('child_name_label')} <span style={{ color: '#d32f2f' }}>*</span></span>
            </div>
            <input
              type="text"
              value={childName}
              onChange={e => setChildName(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder={t('child_name_placeholder')}
              style={{
                marginTop: 10,
                padding: '12px 14px',
                borderRadius: 10,
                border: `1px solid ${childInvalid ? '#d32f2f' : '#cdd4dc'}`,
                fontSize: 16,
                outline: 'none',
                background: '#f9fafb'
              }}
            />
            {childInvalid && (
              <div style={{ color: '#d32f2f', fontSize: 12, marginTop: 6 }}>
                {t('child_name_required')}
              </div>
            )}
          </div>

          {/* Parent's Name */}
          <div style={rowStyle}>
            <div style={topLineStyle}>
              <FaUserEdit size={22} />
              <span>{t('parent_name_label')}</span>
            </div>
            <input
              type="text"
              value={parentName}
              onChange={e => setParentName(e.target.value)}
              placeholder={t('parent_name_placeholder')}
              style={{
                marginTop: 10,
                padding: '12px 14px',
                borderRadius: 10,
                border: '1px solid #cdd4dc',
                fontSize: 16,
                outline: 'none',
                background: '#f9fafb'
              }}
            />
          </div>

            {/* Phone number */}
          <div style={rowStyle}>
            <div style={topLineStyle}>
              <FaPhoneAlt size={20} />
              <span>{t('phone_label')}</span>
            </div>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder={t('phone_placeholder')}
              style={{
                marginTop: 10,
                padding: '12px 14px',
                borderRadius: 10,
                border: '1px solid #cdd4dc',
                fontSize: 16,
                outline: 'none',
                background: '#f9fafb'
              }}
            />
          </div>

          {/* Language (custom dropdown) */}
          <div style={rowStyle}>
            <div style={topLineStyle}>
              <FaLanguage size={22} />
              <span>{t('language_label')}</span>
            </div>
            <div ref={languageWrapperRef} style={{ position: 'relative', marginTop: 10 }}>
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={languageOpen}
                onClick={() => setLanguageOpen(o => !o)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '12px 14px',
                  borderRadius: 10,
                  border: '1px solid #cdd4dc',
                  fontSize: 16,
                  outline: 'none',
                  background: '#f9fafb',
                  color: '#1f2731',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                {language === 'english' ? 'English' : 'Chinese'}
                <FaChevronDown size={14} style={{ transition: 'transform .18s ease', transform: languageOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </button>
              {languageOpen && (
                <ul
                  role="listbox"
                  style={{
                    listStyle: 'none',
                    margin: 4,
                    padding: '4px 0',
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: '#ffffff',
                    border: '1px solid #d6dde3',
                    borderRadius: 10,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    zIndex: 50
                  }}
                >
                  {[
                    { value: 'english', label: 'English' },
                    { value: 'chinese', label: 'Chinese' }
                  ].map(opt => (
                    <li key={opt.value}>
                      <button
                        type="button"
                        onClick={() => { setLanguage(opt.value); const newLng = revLangMap[opt.value] || 'en'; i18n.changeLanguage(newLng); try { localStorage.setItem('lang', newLng); } catch(e){} setLanguageOpen(false); }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '10px 14px',
                          background: language === opt.value ? '#eef4ff' : 'transparent',
                          border: 'none',
                          fontSize: 15,
                          cursor: 'pointer',
                          fontWeight: language === opt.value ? 600 : 400,
                          color: '#1f2731'
                        }}
                      >
                        {opt.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Logout */}
          <div style={{ padding: '40px 20px 70px' }}>
            <button
              type="submit"
              style={{
                width: '100%',
                background: '#f3f4f6',
                color: '#1f2731',
                border: 'none',
                borderRadius: 18,
                padding: '18px 12px',
                fontSize: 18,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {t('save')}
            </button>
            {/* <button
              type="button"
              style={{
                width: '100%',
                background: '#ffffff',
                color: '#c62828',
                border: '1px solid #e2e5e9',
                borderRadius: 18,
                padding: '16px 12px',
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer',
                marginTop: 14
              }}
              onClick={() => alert('Logged out (prototype)')}
            >
              Log out
            </button> */}
          </div>
        </div>
      </form>
    </div>
  );
}

export default Profile;