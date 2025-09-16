import React from "react";
import './PlanCard.scss';
import CardWrapper from '../components/card-wrapper';
import { useLanguage } from '../context/LanguageContext';

export default function PlanCard(props) {
  const { title, description, image, background, imgRight = true } = props;
  const { t } = useLanguage();
  
  return (
    <CardWrapper>
      <div className="correction-plan-card-section">
        {!imgRight && <div className="correction-plan-card-section-item">
          <img src={image} alt="p7" />
        </div>}
        <div
          className="correction-plan-card-section-item correction-plan-card-section-item-1"
          style={{ background }}
        >
          <div
            className="correction-plan-card-section-item-title"
            style={{ textAlign: imgRight ? 'left' : 'right' }}
          >
          {title || t('correction.teenOrthodontics.title')}
          </div>
          <div
            className="correction-plan-card-section-item-description"
            style={{ textAlign: imgRight ? 'left' : 'right' }}
          >
            {
              description || (
                <>
                  {t('correction.teenOrthodontics.description').split('\n').map((line, index) => (
                    <span key={index}>
                      {line}
                      {index < t('correction.teenOrthodontics.description').split('\n').length - 1 && <br/>}
                    </span>
                  ))}
                </>
              )
            }
          </div>
          </div>
          {imgRight && <div className="correction-plan-card-section-item">
            <img src={image} alt="p7" />
          </div>}
      </div>
    </CardWrapper>
  );
}
