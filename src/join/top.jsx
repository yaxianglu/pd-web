import './top.scss';
import p1 from './imgs/1.svg';
import DetailButton from '../components/detail-button';

export default function Description() {
  const handleJoinClick = () => {
    const joinInfoElement = document.getElementById('join-info');
    if (joinInfoElement) {
      const offset = 80; // 为固定header留出空间
      const elementPosition = joinInfoElement.offsetTop - offset;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="join-join-description-section">
      <div className="join-join-description-section-text">
        <div className="join-join-description-section-text-title">
          攜手推動數位矯正新時代<br />
          讓專業診所的價值被更多人看見
        </div>
        <div className="join-join-description-section-text-content">
        珍舒美 誠摯邀請您成為我們的合作診所夥伴，結合國際品牌與在地交付力，提供給患者值<br />
        得信賴的隱形矯正體驗，同時為診所開拓新的服務機會與品牌曝光管道
        </div>
        <DetailButton 
          text="成為合作夥伴" 
          size="small" 
          onClick={handleJoinClick}
        />
      </div>
      <img src={p1} alt="#" />
    </div>
  );
}