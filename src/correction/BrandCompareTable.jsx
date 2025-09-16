import React from "react";
import './BrandCompareTable.scss';
import p8 from './imgs/8.jpg';
import p9 from './imgs/9.svg';
import p10 from './imgs/10.jpg';
import GrayCard from "../components/gray-card";
import { useLanguage } from '../context/LanguageContext';

export default function ManufacturingSection() {
  const { t } = useLanguage();
  
  return (
    <GrayCard
      title={t('correction.teenOrthodontics.timing.title')}
      description={t('correction.teenOrthodontics.timing.description')}
    >
      <div className="timing-sections">
        {/* 换牙期 */}
        <div className="timing-section">
          <div className="timing-image">
            <img src={p8} alt="换牙期儿童" />
          </div>
          <div className="timing-content">
            <div className="timing-title">{t('correction.teenOrthodontics.timing.stages.mixed.title')}</div>
            <div className="timing-description">
              {t('correction.teenOrthodontics.timing.stages.mixed.description').split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  {index < t('correction.teenOrthodontics.timing.stages.mixed.description').split('\n').length - 1 && <br/>}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 恒牙初期 */}
        <div className="timing-section">
          <div className="timing-image">
            <img src={p9} alt="恒牙初期青少年" />
          </div>
          <div className="timing-content">
            <div className="timing-title">{t('correction.teenOrthodontics.timing.stages.early.title')}</div>
            <div className="timing-description">
              {t('correction.teenOrthodontics.timing.stages.early.description').split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  {index < t('correction.teenOrthodontics.timing.stages.early.description').split('\n').length - 1 && <br/>}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 颚骨调整期 */}
        <div className="timing-section">
          <div className="timing-image">
            <img src={p10} alt="颚骨调整期青少年" />
          </div>
          <div className="timing-content">
            <div className="timing-title">{t('correction.teenOrthodontics.timing.stages.growth.title')}</div>
            <div className="timing-description">
              {t('correction.teenOrthodontics.timing.stages.growth.description').split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  {index < t('correction.teenOrthodontics.timing.stages.growth.description').split('\n').length - 1 && <br/>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </GrayCard>
  );
}
