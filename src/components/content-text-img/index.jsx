import React from "react";
import { useResponsive } from '../responsive-hook';
import './index.scss';

export default function ContentTextImg(props) {
  const { title, description, image, imgRight = true } = props;
  const { isMobile, isTablet } = useResponsive();
  const borderStyle = imgRight ? { borderLeft: '3px solid #48d2ce', textAlign: 'left', paddingLeft: '16px' } : { borderRight: '3px solid #48d2ce', textAlign: 'right', paddingRight: '10px' };
  return (
    <div className={`content-text-img-section ${!imgRight ? 'content-text-img-section-reverse' : ''}`}>
      {!imgRight && <div className="content-text-img-section-img" style={{ justifyContent: 'start' }}>
        <img src={image} alt="#" />
      </div>}
      <div
        className="content-text-img-section-item content-text-img-section-item-1"
      >
        <div
          className="content-text-img-section-item-title"
          style={{ ...borderStyle }}
        >
        {title || '青少年適合使用隱形牙套？'}
        </div>
        <div
          className="content-text-img-section-item-description"
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
        {imgRight && <div className="content-text-img-section-img">
          <img src={image} alt="#" />
        </div>}
    </div>
  );
}
