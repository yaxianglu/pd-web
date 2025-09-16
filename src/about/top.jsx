import './top.scss';
import p1 from './imgs/1.jpg';
// import p1 from './imgs/1.svg';
import p2 from './imgs/2.svg';
import { useLanguage } from '../context/LanguageContext';

export default function Top() {
  const { t } = useLanguage();
  
  return (
    <div className="about-top-section">
      <div className="about-top-title">
        {t('about.pageTitle')}，<br />
        {t('about.pageSubtitle')}
      </div>
      <div className="about-top-cotent">
        <div className="about-top-cotent-left about-top-cotent-detail">
          <div className="about-top-cotent-left-img">
            <img src={p1} alt="" />
          </div>
          <div className="about-top-cotent-left-description">
            {t('about.companyMission')}
          </div>
        </div>
        <div className="about-top-cotent-right about-top-cotent-detail">
          <div className="about-top-cotent-right-description">
          {t('about.companyIntro')}
          </div>
          <div className="about-top-cotent-right-img">
              <img src={p2} alt="" />
            </div>
        </div>
      </div>
    </div>
  );
}