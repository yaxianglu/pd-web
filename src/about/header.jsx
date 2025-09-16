import './header.scss';
import p5 from './imgs/6.jpg';
import DetailButton from '../components/detail-button';
import { useLanguage } from '../context/LanguageContext';

export default function Description() {
  const { t } = useLanguage();
  
  return (
    <div className="about-about-description-section">
      <div className="about-about-description-section-text">
        {t('about.pageTitle')}<br />
        {t('about.pageSubtitle')}
      <DetailButton text={t('about.becomePartner')} onClick={() => {
        window.location.href = '/join';
      }}/>
      </div>
      <img src={p5} alt="#" />
    </div>
  );
}