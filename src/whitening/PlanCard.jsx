import React from "react";
import png12 from '../asserts/12.svg';
import './PlanCard.scss';

const plans = [
  {
    tag: "輕度",
    duration: "3 – 9個月",
    subtitle: "(平均治療週期)",
    price: "$ 48,000",
    badge: "限時優惠",
    features: [
      "針對前排牙齒外觀",
      "沒有或少量附件",
      "無需拔牙",
    ],
    checks: [
      "美觀為主，日常幾乎無感",
      "無附件設計，簡潔自然"
    ],
    color: "#48d2ce",
  },
  {
    tag: "中度",
    duration: "9 – 15個月",
    subtitle: "(平均治療週期)",
    price: "$ 98,000",
    badge: "限時優惠",
    features: [
      "前排與部分後排牙齒",
      "多數牙齒需黏附件",
      "視乎情況或需拔牙"
    ],
    checks: [
      "美觀與功能兼顧",
      "符合多數成人矯正需求"
    ],
    color: "#48d2ce",
  },
  {
    tag: "重度",
    duration: "15 – 22個月",
    subtitle: "(平均治療週期)",
    price: "$ 118,000",
    badge: "限時優惠",
    features: [
      "前排牙齒調整，並改善咬合",
      "大多數牙齒需要黏附件",
      "視乎情況或需拔牙"
    ],
    checks: [
      "全面改善齒列與咬合關係",
      "適用於進階需求或骨架型調整"
    ],
    color: "#48d2ce",
  }
];

function PlanCard({ tag, duration, subtitle, price, badge, features, checks, color }) {
  return (
    <div className="plan-card" style={{ '--card-color': color }}>
      {/* 标题栏 */}
      <div className="card-header">
        {tag}
        <span className="complexity-text">/複雜程度</span>
      </div>
      {/* 主体内容 */}
      <div className="card-body">
        <div className="duration">{duration}</div>
        <div className="subtitle">{subtitle}</div>
        
        {/* 第一个分隔线 */}
        <div className="divider" />
        
        {/* 价格和徽章容器 */}
        <div className="price-container">
          <div className="price">
            {price}
            {/* 限时优惠徽章图片 */}
            <img 
              src={png12} 
              alt="限時優惠"
              className="badge-image"
            />
          </div>
        </div>

        {/* 第二个分隔线 */}
        <div className="divider" />

        {/* 适应症 */}
        <ul className="features-list">
          {features.map((ft, i) =>
            <li key={i}>{ft}</li>
          )}
        </ul>
        
        {/* 第三个分隔线 */}
        <div className="divider" />
        
        {/* 检查项 */}
        <ul className="checks-list">
          {checks.map((ch, i) => (
            <li key={i}>
              <span className="check-icon">
                <svg width="12" height="12" viewBox="0 0 20 20">
                  <polyline points="4,10 9,15 16,6" fill="none" stroke="#fff" strokeWidth="2.5" />
                </svg>
              </span>
              {ch}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function WhichPlan() {
  return (
    <div className="plan-section">
      <div className="plan-container">
        <div className="plan-header">
          {/* 顶部标题 */}
          <div className="plan-title">
            哪一種更適合我？
          </div>
          <div className="plan-description">
            根據您的牙齒狀況，專業推薦三種隱形牙套方案，無論是輕微排列或<br />
            是複雜牙齒問題，我們都有完善的療程，給你閃耀動人的微笑。
          </div>
        </div>

        {/* 方案卡片 */}
        <div className="plan-cards">
          {plans.map((plan, idx) =>
            <PlanCard key={plan.tag} {...plan} />
          )}
        </div>

        {/* 行动按钮 */}
        <div className="action-button">
          <button className="cta-button">
            我適合哪種方案？
          </button>
        </div>
      </div>
    </div>
  );
}
