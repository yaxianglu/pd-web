import React from 'react';
import { Select } from 'antd';
import { useLanguage } from '../../context/LanguageContext';
import './index.scss';

const LanguageSelector = ({ 
  size = 'small', 
  style = {}, 
  className = '',
  showFlag = true,
  showText = true,
  placement = 'bottomLeft'
}) => {
  const { currentLanguage, changeLanguage, getAvailableLanguages } = useLanguage();
  const availableLanguages = getAvailableLanguages();

  const handleLanguageChange = (value) => {
    changeLanguage(value);
  };

  const options = availableLanguages.map(lang => ({
    value: lang.code,
    label: (
      <div className="language-option">
        {showFlag && <span className="language-flag">{lang.flag}</span>}
        {showText && <span className="language-name">{lang.name}</span>}
      </div>
    )
  }));

  const currentLanguageInfo = availableLanguages.find(lang => lang.code === currentLanguage);

  return (
    <Select
      value={currentLanguage}
      onChange={handleLanguageChange}
      size={size}
      style={style}
      className={`language-selector ${className}`}
      placement={placement}
      options={options}
      optionLabelProp="label"
    />
  );
};

export default LanguageSelector;
