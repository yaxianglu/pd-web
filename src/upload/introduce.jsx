import p1 from './imgs/1.svg';
import p2 from './imgs/2.svg';
import p8 from './imgs/8.jpg';
import p9 from './imgs/9.jpg';
import p10 from './imgs/10.jpg';
import './introduce.scss';

export default function Introduce(props) {
  const { setStep, style } = props;
  return (
    <div className="introduce-content" style={style}>
    <div className="introduce-content-container">
      <div className="introduce-content-title">
        你的笑容，可以更自然、更自信！
      </div>
      <div className="introduce-content-text">
        透過珍舒美的免費微笑測試，只需幾張照片，就能快速了解<br/>
        您是否適合進行隱形矯正，並獲得專屬建議！
      </div>

      <div className="introduce-content-xxxx">
        <div className="introduce-content-xxxx-left">
          <img src={p1} alt="p1" />
          <span className="introduce-content-xxxx-left-number">03</span><span className="introduce-content-xxxx-left-text">step</span>
        </div>
        <div className="introduce-content-xxxx-right">
          <img src={p2} alt="p2" />
          <span className="introduce-content-xxxx-left-number">05</span><span className="introduce-content-xxxx-left-text">min</span>
          </div>
      </div>
      <div className="introduce-content-yyyyy">
      <div className="introduce-content-yyyyy-item">
        <div className='introduce-content-yyyyy-item-left'>
          <img src={p8} alt="p8" />
        </div>
        <div className='introduce-content-yyyyy-item-right'>
          <div className='introduce-content-yyyyy-item-right-title'>
            進行微笑測試
          </div>
          <div className='introduce-content-yyyyy-item-right-li'>
            正面微笑照（自然微笑、牙齒露出）
          </div>
          <div className='introduce-content-yyyyy-item-right-li'>
            上排牙齒近照（輕拉上唇）
          </div>
          <div className='introduce-content-yyyyy-item-right-li'>
            下排牙齒近照（輕拉下唇）
          </div>
          <div className='introduce-content-yyyyy-item-right-small'>
            確保光線充足，對焦清晰即可<br />
            無需張嘴過大，呈現牙齒整體狀態為主
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
            上傳您的照片
          </div>
          <div className='introduce-content-yyyyy-item-right-description'>
            請使用下方表單上傳剛拍攝的照片，我們的專業團<br />
            隊將根據您的牙齒狀況，進行初步評估，並提供是<br/>
            否適合進行隱形矯正的回覆建議。
          </div>
        </div>
      </div>

      <div className="introduce-content-yyyyy-item">
        <div className='introduce-content-yyyyy-item-left'>
          <img src={p10} alt="p10" />
        </div>
        <div className='introduce-content-yyyyy-item-right'>
          <div className='introduce-content-yyyyy-item-right-title'>
            留下聯絡方式
          </div>
          <div className='introduce-content-yyyyy-item-right-description'>
            請填寫以下基本資料，讓我們能順利與您聯繫。<br />
            我們將於 1–2 個工作天內透過 LINE、Email 或電<br />
            話與您聯繫，提供進一步說明或安排診所諮詢。
          </div>
        </div>
      </div>
    </div>
    </div>
    <div className="introduce-button-wrapper">
      <button className={`introduce-button`} onClick={() => setStep(4)}>
        開始微笑測試
      </button>
    </div>
  </div>
  );
}