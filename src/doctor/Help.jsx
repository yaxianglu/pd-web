import React from 'react';
import './Help.scss';
import { useLanguage } from '../context/LanguageContext';

export default function Help() {
  const { t } = useLanguage();
  return (
    <div className="help-page">
      <div className="card">
        <div className="card-title">{t('doctor.help.title')}</div>
        <div className="help-content">
          <div className="help-section">
            <h3>{t('doctor.help.faq')}</h3>
            <div className="faq-item">
              <h4>{t('doctor.help.q1')}</h4>
              <p>{t('doctor.help.a1')}</p>
            </div>
            <div className="faq-item">
              <h4>{t('doctor.help.q2')}</h4>
              <p>{t('doctor.help.a2')}</p>
            </div>
            <div className="faq-item">
              <h4>{t('doctor.help.q3')}</h4>
              <p>{t('doctor.help.a3')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
