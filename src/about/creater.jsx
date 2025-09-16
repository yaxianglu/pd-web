import './creater.scss';
import p7 from './imgs/7.jpg';
import CardWrapper from '../components/card-wrapper';
import { useLanguage } from '../context/LanguageContext';

export default function Creater() {
  const { t } = useLanguage();
  
  return (
    <div className="about-creater">
      <img src={p7} alt="" />
      <CardWrapper title={t('about.drDavidShen')} style={{ marginTop: 0 }}>
        <div className="about-creater-content">
        {t('about.drDescription')}
        </div>
      </CardWrapper>
    </div>
  );
}