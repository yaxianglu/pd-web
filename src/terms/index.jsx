import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.scss';
import { useLanguage } from '../context/LanguageContext';

const Terms = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="terms-page">
      <div className="terms-container">
        <div className="terms-content">
          <div className="terms-section">
            <h2>{t('terms.sections.agreement.title')}</h2>
            <p>
              {t('terms.sections.agreement.welcome')}
            </p>
            <p>
              {t('terms.sections.agreement.ecommerce')}
            </p>
            <p>
              {t('terms.sections.agreement.products')}
            </p>
          </div>

          <div className="terms-section">
            <h2>{t('terms.sections.medicalDisclaimer.title')}</h2>
            <p>
              {t('terms.sections.medicalDisclaimer.description')}
            </p>
          </div>

          <div className="terms-section">
            <h2>{t('terms.sections.privacy.title')}</h2>
            <p>
              {t('terms.sections.privacy.description')}
            </p>
          </div>

          <div className="terms-section">
            <h2>{t('terms.sections.electronicCommunications.title')}</h2>
            <p>
              {t('terms.sections.electronicCommunications.description')}
            </p>
          </div>

          <div className="terms-section">
            <h2>{t('terms.sections.account.title')}</h2>
            <p>
              {t('terms.sections.account.description')}
            </p>
          </div>

          <div className="terms-section">
            <h2>{t('terms.sections.children.title')}</h2>
            <p dangerouslySetInnerHTML={{ __html: t('terms.sections.children.description') }} />
          </div>

          <div className="terms-section">
            <h2>{t('terms.sections.cancellation.title')}</h2>
            <p>
              {t('terms.sections.cancellation.description')}
            </p>
          </div>

          <div className="terms-section">
            <h2>{t('terms.sections.thirdPartyLinks.title')}</h2>
            <p>
              {t('terms.sections.thirdPartyLinks.description')}
            </p>
            <p>
              {t('terms.sections.thirdPartyLinks.thirdPartyServices')}
            </p>
          </div>

          <div className="terms-section">
            <h2>{t('terms.sections.intellectualProperty.title')}</h2>
            <p>
              {t('terms.sections.intellectualProperty.license')}
            </p>
            <p>
              {t('terms.sections.intellectualProperty.content')}
            </p>
            <p>
              {t('terms.sections.intellectualProperty.restrictions')}
            </p>
          </div>

          <div className="terms-section">
            <h2>{t('terms.sections.internationalUsers.title')}</h2>
            <p>
              {t('terms.sections.internationalUsers.description')}
            </p>
          </div>

          <div className="terms-section">
            <h2>{t('terms.sections.indemnification.title')}</h2>
            <p>
              {t('terms.sections.indemnification.description')}
            </p>
          </div>

          <div className="terms-section">
            <h2>{t('terms.sections.arbitration.title')}</h2>
            <p>
              {t('terms.sections.arbitration.description')}
            </p>
            <p>
              {t('terms.sections.arbitration.additionalInfo')}
            </p>
          </div>

          <div className="terms-section">
            <h2>{t('terms.sections.classActionWaiver.title')}</h2>
            <p dangerouslySetInnerHTML={{ __html: t('terms.sections.classActionWaiver.description') }} />
          </div>

          <div className="terms-section">
            <h2>{t('terms.sections.liabilityDisclaimer.title')}</h2>
            <p>
              {t('terms.sections.liabilityDisclaimer.description')}
            </p>
            <p>
              {t('terms.sections.liabilityDisclaimer.warranty')}
            </p>
            <p>
              {t('terms.sections.liabilityDisclaimer.limitation')}
            </p>
            <p>
              {t('terms.sections.liabilityDisclaimer.remedy')}
            </p>
          </div>

          <div className="terms-section">
            <h2>{t('terms.sections.termination.title')}</h2>
            <p>
              {t('terms.sections.termination.description')}
            </p>
            <p>
              {t('terms.sections.termination.relationship')}
            </p>
            <p>
              {t('terms.sections.termination.validity')}
            </p>
            <p>
              {t('terms.sections.termination.entireAgreement')}
            </p>
            <p>
              {t('terms.sections.termination.language')}
            </p>
          </div>

          <div className="terms-section">
            <h2>{t('terms.sections.changes.title')}</h2>
            <p>
              {t('terms.sections.changes.description')}
            </p>
          </div>

          <div className="terms-section">
            <h2>{t('terms.sections.contact.title')}</h2>
            <p>
              {t('terms.sections.contact.description')}
            </p>
            <p dangerouslySetInnerHTML={{ __html: t('terms.sections.contact.companyInfo') }} />
          </div>

          <div className="terms-footer">
            <p>{t('terms.sections.effectiveDate')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
