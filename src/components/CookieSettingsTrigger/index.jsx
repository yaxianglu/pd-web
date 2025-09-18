import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import CookieConsent from '../CookieConsent';

const CookieSettingsTrigger = ({ children, className, style }) => {
  const { t } = useLanguage();
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    setShowModal(true);
  };

  return (
    <>
      <span 
        className={className}
        style={{ cursor: 'pointer', textDecoration: 'underline', ...style }}
        onClick={handleClick}
      >
        {children || t('footer.cookieSettings')}
      </span>
      
      {showModal && (
        <CookieConsent 
          forceShow={true}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default CookieSettingsTrigger;
