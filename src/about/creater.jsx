import './creater.scss';
import p7 from './imgs/7.jpg';
import CardWrapper from '../components/card-wrapper';

export default function Creater() {
  return (
    <div className="about-creater">
      <img src={p7} alt="" />
      <CardWrapper title="DR. DAVID SHEN" style={{ marginTop: 0 }}>
        <div className="about-creater-content">
        Dr. David Shen畢業於美國賓夕法尼亞大學牙醫學院，曾任教於加州大學舊金山分校，同時也是北加州亞裔牙醫師協會的創會會長，現任賓夕法尼亞大學牙醫學院顧問委員會主席，曾任多場牙科國際會議演講者，享譽國際，所創品牌以專業醫療團隊為核心、AI智慧系統為輔助，協助規劃精準、有效率的療程，透過人工智慧模擬牙齒移動的過程與效果，搭配臨床資料與三維影像判讀，提升治療預測性與整體安全性，珍舒美是市面上少數支援「聯合矯正」的品牌，Dr. David Shen指出，珍舒美特別設計可與傳統固定矯正器接軌的隱形牙套方案，使用者可於矯正後期在不影響使用狀態下，轉換為更舒適美觀的透明牙套。
        </div>
      </CardWrapper>
    </div>
  );
}