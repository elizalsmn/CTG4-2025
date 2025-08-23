import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChild, FaUserEdit, FaPhoneAlt, FaLanguage, FaChevronDown } from 'react-icons/fa';
import avatarPlaceholder from '../assets/avatar-placeholder.jpg';
import './Profile.css';
import UserMenu from "./UserMenu";

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
  }, [i18n.language]);

  const [touched, setTouched] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const languageWrapperRef = useRef(null);

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
    <div className="profile-page">
      <form onSubmit={handleSubmit} className="profile-form">
        {/* Header */}
        <div className="profile-header">
          <img
            src={avatarPlaceholder}
            alt="Profile avatar"
            className="profile-avatar"
          />
          <div className="profile-title">{t('profile_header')}</div>
        </div>

        {/* Rows */}
        <div>
          {/* Child's Name */}
          <div className="profile-row">
            <div className="row-topline">
              <FaChild size={24} />
              <span>{t('child_name_label')} <span className="required">*</span></span>
            </div>
            <input
              type="text"
              value={childName}
              onChange={e => setChildName(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder={t('child_name_placeholder')}
              className={`input-field ${childInvalid ? 'invalid' : ''}`}
            />
            {childInvalid && (
              <div className="error-text">{t('child_name_required')}</div>
            )}
          </div>

          {/* Parent's Name */}
          <div className="profile-row">
            <div className="row-topline">
              <FaUserEdit size={22} />
              <span>{t('parent_name_label')}</span>
            </div>
            <input
              type="text"
              value={parentName}
              onChange={e => setParentName(e.target.value)}
              placeholder={t('parent_name_placeholder')}
              className="input-field"
            />
          </div>

          {/* Phone */}
          <div className="profile-row">
            <div className="row-topline">
              <FaPhoneAlt size={20} />
              <span>{t('phone_label')}</span>
            </div>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder={t('phone_placeholder')}
              className="input-field"
            />
          </div>

          {/* Language */}
          <div className="profile-row">
            <div className="row-topline">
              <FaLanguage size={22} />
              <span>{t('language_label')}</span>
            </div>
            <div ref={languageWrapperRef} className="dropdown-wrapper">
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={languageOpen}
                onClick={() => setLanguageOpen(o => !o)}
                className="dropdown-button"
              >
                {language === 'english' ? 'English' : 'Chinese'}
                <FaChevronDown className={`chevron ${languageOpen ? 'open' : ''}`} />
              </button>
              {languageOpen && (
                <ul role="listbox" className="dropdown-list">
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

          {/* Save */}
          <div className="form-actions">
            <button type="submit" className="save-button">
              {t('save')}
            </button>
          </div>
        </div>
      </form>
      <UserMenu />
    </div>
  );

  
}

export default Profile;