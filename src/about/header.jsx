import './header.scss';
import p5 from './imgs/6.jpg';
import DetailButton from '../components/detail-button';
import { useLanguage } from '../context/LanguageContext';

export default function Description() {
  const { t } = useLanguage();
  
  // return (
  //   <div className="about-about-description-section">
  //     <div className="about-about-description-section-text">
  //     <div className="about-about-description-section-text-title">
        // {t('about.pageTitle')}<br />
  //       </div>
  //       <div className="about-about-description-section-text-content">
  //       {t('about.pageSubtitle')}
  //       </div>
  //     <DetailButton text={t('about.becomePartner')} onClick={() => {
  //       window.location.href = '/join';
  //     }}/>
  //     </div>
  //     <img src={p5} alt="#" />
  //   </div>
  // );


  return (
    <div className="join-join-description-section">
      <div className="join-join-description-section-text" style={{ backgroundImage: `url(${p5})`, backgroundSize: '100%', backgroundRepeat: 'no-repeat' }}>
      <div className="join-join-description-section-text-title">
        {t('about.pageTitle')}<br />
        </div>
        <div className="join-join-description-section-text-content">
        {t('about.pageSubtitle')}
        </div>
        <DetailButton 
          text={t('join.hero.buttonText')} 
          size="small" 
          onClick={() => {
            window.location.href = '/join';
          }}
        />
      </div>
    </div>
  );
}