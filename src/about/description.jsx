import './description.scss';
import p5 from './imgs/5.jpg';

export default function Description() {
  return (
    <div className="about-about-description-section">
      <div className="about-about-description-section-text">
        在珍舒美，我們以科技輔助、專業主導、品質落實為核心理念，持續精進，<br />
        只為讓每一位配戴者，看見自然的改變、感受安心的矯正體驗。
      </div>
      <img src={p5} alt="#" />
    </div>
  );
}