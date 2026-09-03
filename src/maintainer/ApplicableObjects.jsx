import React, { useState, useEffect } from 'react';
import './ApplicableObjects.scss';
import CardWrapper from '../components/card-wrapper';
import DetailButton from '../components/detail-button';
import Grid from '../components/grid';
import { useLanguage } from '../context/LanguageContext';

export default function ApplicableObjects() {
  const { t } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1125);
    };

    window.addEventListener('resize', handleResize);
    
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <CardWrapper title={t('maintainer.applicableObjects.title')}>
      {
        isMobile ? (
          <>
          <Grid>
            <div className="object-card blue">
              <h3 className="card-title">{t('maintainer.applicableObjects.objects.traditional.title')}</h3>
              <p className="card-description">
                {t('maintainer.applicableObjects.objects.traditional.description')}
              </p>
            </div>
          </Grid>
            
          <Grid>
          <div className="object-card green">
              <h3 className="card-title">{t('maintainer.applicableObjects.objects.invisible.title')}</h3>
              <p className="card-description">
                {t('maintainer.applicableObjects.objects.invisible.description')}
              </p>
            </div>
          </Grid>
            
          <Grid>
          <div className="object-card orange">
              <h3 className="card-title">{t('maintainer.applicableObjects.objects.relapse.title')}</h3>
              <p className="card-description">
                {t('maintainer.applicableObjects.objects.relapse.description')}
              </p>
            </div>
          </Grid>
          </>
        ) : (
          <>
          <Grid>
            <div className="object-card blue">
              <h3 className="card-title">{t('maintainer.applicableObjects.objects.traditional.title')}</h3>
              <p className="card-description">
                {t('maintainer.applicableObjects.objects.traditional.description')}
              </p>
            </div>
            
            <div className="object-card green">
              <h3 className="card-title">{t('maintainer.applicableObjects.objects.invisible.title')}</h3>
              <p className="card-description">
                {t('maintainer.applicableObjects.objects.invisible.description')}
              </p>
            </div>
            
            <div className="object-card orange">
              <h3 className="card-title">{t('maintainer.applicableObjects.objects.relapse.title')}</h3>
              <p className="card-description">
                {t('maintainer.applicableObjects.objects.relapse.description')}
              </p>
            </div>
          </Grid>
          </>
        )
      }
      
      <DetailButton text={t('maintainer.applicableObjects.buttonText')} onClick={() => window.open('/upload?new=1', '_blank')} />
    </CardWrapper>
  );
} 