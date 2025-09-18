import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const LanguageSelector = () => {
  const { 
    currentLanguage, 
    changeLanguage, 
    getAvailableLanguages, 
    isAutoDetecting 
  } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = getAvailableLanguages();

  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'none',
          border: 'none',
          padding: '8px 12px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '14px',
          color: '#333'
        }}
      >
        <span>{languages.find(lang => lang.code === currentLanguage)?.name}</span>
        <span style={{ fontSize: '12px' }}>▼</span>
        {isAutoDetecting && (
          <span style={{ 
            fontSize: '10px', 
            color: '#007bff',
            marginLeft: '4px'
          }}>
            (检测中...)
          </span>
        )}
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            zIndex: 1000,
            minWidth: '120px'
          }}
        >
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: 'none',
                background: language.code === currentLanguage ? '#f0f0f0' : 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '14px',
                color: language.code === currentLanguage ? '#007bff' : '#333'
              }}
            >
              {language.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
