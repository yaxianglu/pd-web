// ProductFeatures.jsx
import React from 'react';
import './ProductFeatures.scss';
import CardWrapper from '../components/card-wrapper';
import p2 from './imgs/2.svg';
import p3 from './imgs/3.svg';
import p4 from './imgs/4.svg';
import p5 from './imgs/5.svg';

const features = [
  {
    title: (
      <>
        簡單易用
        <br />
        日常輕鬆亮白
      </>
    ),
    desc: `筆狀設計方便攜帶與塗抹，無需繁瑣流程，只需幾秒鐘，即可輕鬆應用於牙齒表面，適合忙碌生活節奏。`,
    icon: (
      <img src={p2} alt="#" />
    ),
    highlight: false,
  },
  {
    title: (
      <>
        舒緩敏感
        <br />
        溫和護理
      </>
    ),
    desc: `配方中添加具舒緩效果的成分，有效降低使用美白產品常見的牙齒敏感不適，溫和不刺激，適合敏感體質使用者。`,
    icon: (
      <img src={p3} alt="#" />
    ),
    highlight: true,
  },
  {
    title: (
      <>
        強化牙釉質
        <br />
        提升抗蝕力
      </>
    ),
    desc: `富含有助於修復與強化牙釉質的礦物成分，有效提高牙齒抗力，讓亮白效果不只是表面，而是健康由內而外。`,
    icon: (
      <img src={p4} alt="#" />
    ),
    highlight: false,
  },
  {
    title: (
      <>
        療程搭配友善
        <br />
        可與矯正同步使用
      </>
    ),
    desc: `珍舒美白筆設計適用於隱形牙套與維持器配戴者，可於牙套取下時使用，不影響矯正流程，是矯正期間牙齒護理的理想補充。`,
    icon: (
      <img src={p5} alt="#" />
    ),
    highlight: false,
  },
];

export default function ProductFeatures() {
  return (
    <CardWrapper title="產品特點">
      <div className="product-features__list">
        {features.map((f, i) => (
          <div
            key={i}
            className={
              'product-features__item' +
              (f.highlight ? ' product-features__item--highlight' : '')
            }
          >
            <div className="product-features__item-header">{f.title}</div>
            <div className="product-features__item-divider" />
            <div className="product-features__item-desc">{f.desc}</div>
            <div className="product-features__item-icon">{f.icon}</div>
          </div>
        ))}
      </div>
    </CardWrapper>
  );
}
