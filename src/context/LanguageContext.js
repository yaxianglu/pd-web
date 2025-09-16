import React, { createContext, useContext, useState, useEffect } from 'react';
import zhTW from '../locales/zh-TW';
import zhCN from '../locales/zh-CN';
import en from '../locales/en';

const LanguageContext = createContext();

// 语言配置
const languages = {
  'zh-TW': {
    name: '台灣(繁中)',
    flag: '🇹🇼',
    translations: zhTW
  },
  'zh-CN': {
    name: '中國(简中)',
    flag: '🇨🇳',
    translations: zhCN
  },
  'en': {
    name: 'English',
    flag: '🇺🇸',
    translations: en
  }
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('zh-TW');
  const [translations, setTranslations] = useState(zhTW);

  // 从localStorage加载保存的语言设置
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage && languages[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
      setTranslations(languages[savedLanguage].translations);
    }
  }, []);

  // 切换语言
  const changeLanguage = (languageCode) => {
    if (languages[languageCode]) {
      setCurrentLanguage(languageCode);
      setTranslations(languages[languageCode].translations);
      localStorage.setItem('preferred-language', languageCode);
    }
  };

  // 翻译函数
  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key "${key}" not found`);
        return key; // 返回key本身作为fallback
      }
    }

    // 如果value是字符串，进行参数替换
    if (typeof value === 'string') {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey] || match;
      });
    }

    return value;
  };

  // 获取当前语言信息
  const getCurrentLanguageInfo = () => {
    return languages[currentLanguage];
  };

  // 获取所有可用语言
  const getAvailableLanguages = () => {
    return Object.keys(languages).map(code => ({
      code,
      ...languages[code]
    }));
  };

  const value = {
    currentLanguage,
    translations,
    changeLanguage,
    t,
    getCurrentLanguageInfo,
    getAvailableLanguages,
    languages
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
