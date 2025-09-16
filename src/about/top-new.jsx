import './top-new.scss';
import p1 from './imgs/1.jpg';
// import p1 from './imgs/1.svg';
import p2 from './imgs/2.svg';
import { useLanguage } from '../context/LanguageContext';

export default function Top() {
  const { t } = useLanguage();
  
  return (
    <div className="about-top-section">
      <div className="about-top-cotent">
        <div className="about-top-cotent-left about-top-cotent-detail">
          <div className="about-top-cotent-left-img">
          <div className="about-top-cotent-left-ddd">
            {t('about.companyIntro')}
          </div>
          <div className="about-top-cotent-left-text">
            {t('about.companyDescription')}
          </div>
            <img src={p1} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}