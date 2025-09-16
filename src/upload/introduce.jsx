import { useLanguage } from '../context/LanguageContext';
import p1 from './imgs/1.svg';
import p2 from './imgs/2.svg';
import p8 from './imgs/8.jpg';
import p9 from './imgs/9.jpg';
import p10 from './imgs/10.jpg';
import './introduce.scss';

export default function Introduce(props) {
  const { setStep, style } = props;
  const { t } = useLanguage();
  
  return (
    <div className="introduce-content" style={style}>
    <div className="introduce-content-container">
      <div className="introduce-content-title">
        {t('upload.title')}
      </div>
      <div className="introduce-content-text">
        {t('upload.description')}
      </div>

      <div className="introduce-content-xxxx">
        <div className="introduce-content-xxxx-left">
          <img src={p1} alt="p1" />
          <span className="introduce-content-xxxx-left-number">03</span><span className="introduce-content-xxxx-left-text">{t('upload.steps')}</span>
        </div>
        <div className="introduce-content-xxxx-right">
          <img src={p2} alt="p2" />
          <span className="introduce-content-xxxx-left-number">05</span><span className="introduce-content-xxxx-left-text">{t('upload.minutes')}</span>
          </div>
      </div>
      <div className="introduce-content-yyyyy">
      <div className="introduce-content-yyyyy-item">
        <div className='introduce-content-yyyyy-item-left'>
          <img src={p8} alt="p8" />
        </div>
        <div className='introduce-content-yyyyy-item-right'>
          <div className='introduce-content-yyyyy-item-right-title'>
            {t('upload.step1.title')}
          </div>
          <div className='introduce-content-yyyyy-item-right-li'>
            {t('upload.step1.photo1')}
          </div>
          <div className='introduce-content-yyyyy-item-right-li'>
            {t('upload.step1.photo2')}
          </div>
          <div className='introduce-content-yyyyy-item-right-li'>
            {t('upload.step1.photo3')}
          </div>
          <div className='introduce-content-yyyyy-item-right-small'>
            {t('upload.step1.tips')}
          </div>
          <div className='introduce-content-yyyyy-item-right-description'></div>
        </div>
      </div>

      <div className="introduce-content-yyyyy-item">
        <div className='introduce-content-yyyyy-item-left'>
          <img src={p9} alt="p9" />
        </div>
        <div className='introduce-content-yyyyy-item-right'>
          <div className='introduce-content-yyyyy-item-right-title'>
            {t('upload.step2.title')}
          </div>
          <div className='introduce-content-yyyyy-item-right-description'>
            {t('upload.step2.description')}
          </div>
        </div>
      </div>

      <div className="introduce-content-yyyyy-item">
        <div className='introduce-content-yyyyy-item-left'>
          <img src={p10} alt="p10" />
        </div>
        <div className='introduce-content-yyyyy-item-right'>
          <div className='introduce-content-yyyyy-item-right-title'>
            {t('upload.step3.title')}
          </div>
          <div className='introduce-content-yyyyy-item-right-description'>
            {t('upload.step3.description')}
          </div>
        </div>
      </div>
    </div>
    </div>
    <div className="introduce-button-wrapper">
      <button className={`introduce-button`} onClick={() => setStep(2)}>
        {t('upload.startTest')}
      </button>
    </div>
  </div>
  );
}