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
            <img src={p1} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}