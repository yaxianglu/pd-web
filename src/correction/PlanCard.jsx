import React from "react";
import './PlanCard.scss';
import CardWrapper from '../components/card-wrapper';

export default function PlanCard(props) {
  const { title, description, image, background, imgRight = true } = props;
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
          {title || '青少年適合使用隱形牙套？'}
          </div>
          <div
            className="correction-plan-card-section-item-description"
            style={{ textAlign: imgRight ? 'left' : 'right' }}
          >
            {
              description || (
                <>
                  青春期是牙齒與顏面骨發育的重要時機。及早<br/>
                  介入能有效改善擁擠、暴牙、深咬等問題，及<br/>
                  時規劃恆齒足夠的發育空間，預防將來更複雜<br/>
                  的矯正需求。透明牙套配戴不影響日常學習與<br/>
                  活動，讓孩子自信成長不設限。
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
