import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Inline resources for now. Later you can move to /public/locales/{lng}/{ns}.json
const resources = {
  en: {
    translation: {
      welcome_line1: 'Welcome',
      welcome_line2: 'Back!',
      login: 'Login',
      add_friend: 'Add Friend',
      opening: 'Opening...',
      close: 'Close',
      signup_prompt: "Don't have an account?",
  signup_cta: 'Sign Up',
  profile_header: "Arthur's Parent",
  child_name_label: "Child's Name",
  child_name_placeholder: "Enter child's name",
  child_name_required: "Child's name is required.",
  parent_name_label: "Parent's Name",
  parent_name_placeholder: "Enter parent's name (optional)",
  phone_label: 'Phone number',
  phone_placeholder: 'Enter phone number (optional)',
  language_label: 'Language',
  save: 'Save'
    }
  },
  zh: {
    translation: {
      welcome_line1: '欢迎',
      welcome_line2: '回来！',
      login: '登录',
      add_friend: '添加好友',
      opening: '正在打开…',
      close: '关闭',
      signup_prompt: '还没有账号？',
  signup_cta: '注册',
  profile_header: 'Arthur的家长',
  child_name_label: '孩子姓名',
  child_name_placeholder: '输入孩子姓名',
  child_name_required: '孩子姓名是必填项。',
  parent_name_label: '家长姓名',
  parent_name_placeholder: '输入家长姓名（可选）',
  phone_label: '电话号码',
  phone_placeholder: '输入电话号码（可选）',
  language_label: '语言',
  save: '保存'
    }
  }
};

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: 'en',
      fallbackLng: 'en',
      interpolation: { escapeValue: false }
    });
}

export default i18n;
