import './top-new.scss';
import p1 from './imgs/1.jpg';
// import p1 from './imgs/1.svg';
import p2 from './imgs/2.svg';

export default function Top() {
  return (
    <div className="about-top-section">
      <div className="about-top-cotent">
        <div className="about-top-cotent-left about-top-cotent-detail">
          <div className="about-top-cotent-left-img">
          <div className="about-top-cotent-left-ddd">
            珍舒美是由美國矽谷科技公司 PEARL DIGITAL INC. 所創立。
          </div>
          <div className="about-top-cotent-left-text">
            珍舒美創立於美國矽谷，聯合創辦人兼指導醫師Dr. David Shen專注於牙齒矯正領域30年，有豐富的臨床經驗，是 OrthoWorks 矯正專科集團的創辦人兼執行長，該集團擁有11家診所，是舊金山灣區歷史最悠久且仍由私人經營的矯正專科診所。
          </div>
            <img src={p1} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}