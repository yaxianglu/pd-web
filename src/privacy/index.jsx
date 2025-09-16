import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.scss';
import { useLanguage } from '../context/LanguageContext';

const Privacy = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="privacy-page">
      <div className="privacy-container">
        <div className="privacy-content">
          <div className="privacy-section">
            <p>
              {t('privacy.introduction')}
            </p>
          </div>

          <div className="privacy-section">
            <h2>{t('privacy.sections.collection.title')}</h2>
            <p>
              {t('privacy.sections.collection.description')}
            </p>
            <ul>
              {t('privacy.sections.collection.personalInfo').map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p>
              {t('privacy.sections.collection.billingInfo')}
            </p>
            <p>
              {t('privacy.sections.collection.demographicInfo')}
            </p>
            <ul>
              {t('privacy.sections.collection.demographicItems').map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p>
              {t('privacy.sections.collection.voluntaryInfo')}
            </p>
            <p>
              {t('privacy.sections.collection.futureCollection')}
            </p>
          </div>

          <div className="privacy-section">
            <h2>{t('privacy.sections.use.title')}</h2>
            <p>
              {t('privacy.sections.use.description')}
            </p>
            <ul>
              {t('privacy.sections.use.purposes').map((purpose, index) => (
                <li key={index}>{purpose}</li>
              ))}
            </ul>
            <p>
              {t('privacy.sections.use.additionalUse')}
            </p>
          </div>

          <div className="privacy-section">
            <h2>{t('privacy.sections.sharing.title')}</h2>
            <p>
              {t('privacy.sections.sharing.noSale')}
            </p>
            <p>
              {t('privacy.sections.sharing.businessPartners')}
            </p>
            <p>
              {t('privacy.sections.sharing.legalDisclosure')}
            </p>
          </div>

          <div className="privacy-section">
            <h2>{t('privacy.sections.optOut.title')}</h2>
            <p>
              {t('privacy.sections.optOut.rightToKnow')}
            </p>
            <ul>
              {t('privacy.sections.optOut.rightToKnowItems').map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p>
              {t('privacy.sections.optOut.ccpRights')}
            </p>
          </div>

          <div className="privacy-section">
            <h2>{t('privacy.sections.tracking.title')}</h2>
            <p>
              {t('privacy.sections.tracking.description')}
            </p>
          </div>

          <div className="privacy-section">
            <h2>{t('privacy.sections.automaticCollection.title')}</h2>
            <p>
              {t('privacy.sections.automaticCollection.description')}
            </p>
          </div>

          <div className="privacy-section">
            <h2>{t('privacy.sections.cookies.title')}</h2>
            <p>
              {t('privacy.sections.cookies.description')}
            </p>
            <p>
              {t('privacy.sections.cookies.convenience')}
            </p>
            <p>
              {t('privacy.sections.cookies.choice')}
            </p>
          </div>

          <div className="privacy-section">
            <h2>{t('privacy.sections.links.title')}</h2>
            <p>
              {t('privacy.sections.links.description')}
            </p>
          </div>

          <div className="privacy-section">
            <h2>{t('privacy.sections.security.title')}</h2>
            <p>
              {t('privacy.sections.security.ssl')}
            </p>
            <p>
              {t('privacy.sections.security.disclaimer')}
            </p>
          </div>

          <div className="privacy-section">
            <h2>{t('privacy.sections.deletion.title')}</h2>
            <p>
              {t('privacy.sections.deletion.description')}
            </p>
            <ul>
              {t('privacy.sections.deletion.deletionActions').map((action, index) => (
                <li key={index}>{action}</li>
              ))}
            </ul>
            <p>
              {t('privacy.sections.deletion.exceptions')}
            </p>
            <ul>
              {t('privacy.sections.deletion.exceptionItems').map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="privacy-section">
            <h2>{t('privacy.sections.children.title')}</h2>
            <p>
              {t('privacy.sections.children.description')}
            </p>
          </div>

          <div className="privacy-section">
            <h2>{t('privacy.sections.optOutCommunications.title')}</h2>
            <p>
              {t('privacy.sections.optOutCommunications.description')}
            </p>
            <ul>
              {t('privacy.sections.optOutCommunications.methods').map((method, index) => (
                <li key={index}>{method}</li>
              ))}
            </ul>
          </div>

          <div className="privacy-section">
            <h2>{t('privacy.sections.emailCommunications.title')}</h2>
            <p>
              {t('privacy.sections.emailCommunications.description')}
            </p>
          </div>

          <div className="privacy-section">
            <h2>{t('privacy.sections.externalStorage.title')}</h2>
            <p>
              {t('privacy.sections.externalStorage.description')}
            </p>
          </div>

          <div className="privacy-section">
            <h2>{t('privacy.sections.policyChanges.title')}</h2>
            <p>
              {t('privacy.sections.policyChanges.description')}
            </p>
          </div>

          <div className="privacy-section">
            <h2>{t('privacy.sections.contact.title')}</h2>
            <p>
              {t('privacy.sections.contact.description')}
            </p>
            <p dangerouslySetInnerHTML={{ __html: t('privacy.sections.contact.companyInfo') }} />
          </div>

          <div className="privacy-footer">
            <p>{t('privacy.sections.effectiveDate')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
