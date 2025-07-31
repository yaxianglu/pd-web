// ProductFeatures.jsx
import React from 'react';
import './ProductFeatures.scss';
import CardWrapper from '../components/card-wrapper';

const features = [
  {
    title: (
      <>美國口腔矯正科技品牌</>
    ),
    desc: `珍舒美為美國矽谷 Pearl Digital Inc. 所創立，專注
於結合人工智慧與臨床專業的隱形牙套系統。我們
的產品已通過美國FDA認證與台灣TFDA 醫療器材
許可證認可，符合國際雙重規範標準。我們的療程
由具備超過30年矯治規劃經驗的專業團隊設計， 
搭配AI輔助設計與三維影像整合分析，為每一位患
者提供兼具安全與效率的矯正體驗。`,
    color: 'rgba(105,155,255)'
  },
  {
    title: (
      <>台灣製作 × 穩定交付</>
    ),
    desc: (
      <>
        所有牙套皆於通過 ISO 13485 與 GMP 認證的台灣
        專業醫療器材工廠製作，從設計、製造到出貨皆可控、
        可追蹤，確保交期穩定、品質一致。
        <span style={{ fontSize: '18px', lineHeight: '1.4', display: 'block', marginTop: '16px' }}>
          • 在地製作、快速交貨<br />
          • 專業製造流程，品質有保障
        </span>
      </>
    ),
    color: 'rgba(250,86,30)'
  },
  {
    title: (
      <>
        協助診所數位行銷
        <br />
        提升客源能見度
      </>
    ),
    desc: (
      <>
      我們不僅提供優質產品，更協助診所擴展品牌曝光與客源導
      入，幫助合作診所強化在地影響力：

      <span style={{ fontSize: '18px', lineHeight: '1.4', display: 'block', marginTop: '16px' }}>
      • 收錄於珍舒美官網合作診所名單<br />
      • 提供診所專屬微笑測試連結，線上引導潛在患者預約<br />
      • 協助製作社群推廣素材、行銷文案與品牌視覺資源<br />
      • 專人協助診所使用數位工具進行初步過濾與導流<br />
      • 提供線下推廣物料（QR Code、DM、診所簡介頁等<br />
        </span>
      </>
    ),
    color: 'rgba(180,211,24)'
  },
  {
    title: (
      <>
      歡迎加入我們
      </>
    ),
    desc: `若您是診所負責人、牙醫師、矯正專業團隊，
並有興趣拓展隱形矯正療程服務，歡迎填寫以
下表單與我們聯繫，將由專人安排合作說明與
品牌資源介紹`,
    color: 'rgba(255,140,26)'
  },
];

export default function ProductFeatures() {
  return (
    <CardWrapper title="為什麼要成為珍舒美的合作夥伴？">
      <div className="join-features__list">
        {features.map((f, i) => (
          <div
            key={i}
            className={
              'join-features__item join-features__item--' + f.color +
              (f.highlight ? ' join-features__item--highlight' : '')
            }
            style={{ backgroundColor: f.color }}
          >
            <div className="join-features__item-header">{f.title}</div>
            <div className="join-features__item-divider" />
            <div className="join-features__item-desc">{f.desc}</div>
          </div>
        ))}
      </div>
    </CardWrapper>
  );
}
