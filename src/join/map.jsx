import './map.scss';
import CardWrapper from '../components/card-wrapper';
import p2 from './imgs/2.svg';

export default function Map() {
  return (
    <CardWrapper title="珍舒美的牙醫在哪裏可以找到？">
      <div className="map-section">
       <div className="map-section-title-wrapper">
        <div className="map-section-title">
            <div className="map-section-title-text">
              台灣
            </div>
            <div className="map-section-title-description">
              合作牙醫診所
            </div>
          </div>
          <div className="map-section-title">
            <div className="map-section-title-text">
            美國
            </div>
            <div className="map-section-title-description">
            總公司
            </div>
          </div>
          <div className="map-section-title">
            <div className="map-section-title-text">
            其他國家
            </div>
            <div className="map-section-title-description">
            數百個合作者
            </div>
          </div>
       </div>
       <div className="map-section-content">
        <img src={p2} alt="#" />
       </div>
      </div>
    </CardWrapper>
  );
}