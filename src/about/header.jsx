import './header.scss';
import p5 from './imgs/6.jpg';
import DetailButton from '../components/detail-button';

export default function Description() {
  return (
    <div className="about-about-description-section">
      <div className="about-about-description-section-text" style={{ fontSize: '66px', fontWeight: 'bold' }}>
        專注科技與專業<br />
        打造安心美齒體驗
      <DetailButton text="成為合作夥伴" onClick={() => {
        window.location.href = '/join';
      }}/>
      </div>
      <img src={p5} alt="#" />
    </div>
  );
}