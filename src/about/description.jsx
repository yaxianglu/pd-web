import './description.scss';
import p5 from './imgs/5.jpg';
import { useLanguage } from '../context/LanguageContext';

export default function Description() {
  const { t } = useLanguage();
  
  return (
    <div className="about-about-description-section">
      <div className="about-about-description-section-text">
        {t('about.descriptionText')}
      </div>
      <img src={p5} alt="#" />
    </div>
  );
}