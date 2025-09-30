import React from 'react';
import './ProductFeatures.scss';
import CardWrapper from '../components/card-wrapper';
import p14 from './imgs/14.png';
import p15 from './imgs/15.png';
import p16 from './imgs/16.png';
import p17 from './imgs/17.png';
import p18 from './imgs/18.png';
import Grid3 from '../components/grid';
import { useLanguage } from '../context/LanguageContext';

export default function ProductFeatures() {
  const { t } = useLanguage();
  
  return (
    <CardWrapper>
      <Grid3>
        <div className="correction-dkfjsl-wrapper-item correction-dkfjsl-wrapper-item-tttt">
          {t('correction.facialIssues.description').split('\n').map((line, index) => (
            <span key={index}>
              {line}
              {index < t('correction.facialIssues.description').split('\n').length - 1 && <br/>}
            </span>
          ))}
        </div>
        <div className="correction-dkfjsl-wrapper-item">
          <img src={p14} alt="p3" />
          <div className="correction-dkfjsl-wrapper-item-content">
            <div className="correction-dkfjsl-wrapper-item-title">
              {t('correction.facialIssues.problems.overbite.title')}
            </div>
            <div className="correction-dkfjsl-wrapper-item-description">
              {t('correction.facialIssues.problems.overbite.description').split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  {index < t('correction.facialIssues.problems.overbite.description').split('\n').length - 1 && <br/>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Grid3>
      <Grid3 style={{ marginTop: '24px' }}>
        <div className="correction-dkfjsl-wrapper-item">
          <img src={p17} alt="p3" />
          <div className="correction-dkfjsl-wrapper-item-content">
            <div className="correction-dkfjsl-wrapper-item-title">
              {t('correction.facialIssues.problems.underbite.title')}
            </div>
            <div className="correction-dkfjsl-wrapper-item-description">
              {t('correction.facialIssues.problems.underbite.description').split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  {index < t('correction.facialIssues.problems.underbite.description').split('\n').length - 1 && <br/>}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="correction-dkfjsl-wrapper-item">
          <img src={p18} alt="p3" />
          <div className="correction-dkfjsl-wrapper-item-content">
            <div className="correction-dkfjsl-wrapper-item-title">
              {t('correction.facialIssues.problems.crowding.title')}
            </div>
            <div className="correction-dkfjsl-wrapper-item-description">
              {t('correction.facialIssues.problems.crowding.description')}
            </div>
          </div>
        </div>
      </Grid3>
      <Grid3 style={{ marginTop: '24px' }}>
        <div className="correction-dkfjsl-wrapper-item">
          <img src={p15} alt="p3" />
          <div className="correction-dkfjsl-wrapper-item-content">
            <div className="correction-dkfjsl-wrapper-item-title">
              {t('correction.facialIssues.problems.openBite.title')}
            </div>
            <div className="correction-dkfjsl-wrapper-item-description">
              {t('correction.facialIssues.problems.openBite.description').split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  {index < t('correction.facialIssues.problems.openBite.description').split('\n').length - 1 && <br/>}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="correction-dkfjsl-wrapper-item">
          <img src={p16} alt="p3" />
          <div className="correction-dkfjsl-wrapper-item-content">
            <div className="correction-dkfjsl-wrapper-item-title">
              {t('correction.facialIssues.problems.deepBite.title')}
            </div>
            <div className="correction-dkfjsl-wrapper-item-description">
              {t('correction.facialIssues.problems.deepBite.description').split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  {index < t('correction.facialIssues.problems.deepBite.description').split('\n').length - 1 && <br/>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Grid3>
    </CardWrapper>
  );
}