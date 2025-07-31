import './top.scss';
import p1 from './imgs/1.jpg';
// import p1 from './imgs/1.svg';
import p2 from './imgs/2.svg';

export default function Top() {
  return (
    <div className="about-top-section">
      <div className="about-top-title">
        專注科技與專業，<br />
        打造安心美齒體驗
      </div>
      <div className="about-top-cotent">
        <div className="about-top-cotent-left about-top-cotent-detail">
          <div className="about-top-cotent-left-img">
            <img src={p1} alt="" />
          </div>
          <div className="about-top-cotent-left-description">
            我們致力於將先進技術應用於齒顎矯正，提升治療品質與患者體驗。我們相信，美<br />
            麗的笑容，應建立在專業、安全與科技並重的基礎上。
          </div>
        </div>
        <div className="about-top-cotent-right about-top-cotent-detail">
          <div className="about-top-cotent-right-description">
          珍舒美是由美國矽谷科技公司<br />
          Pearl Digital Inc. 所創立。
          </div>
          <div className="about-top-cotent-right-img">
              <img src={p2} alt="" />
            </div>
        </div>
      </div>
    </div>
  );
}