import png12 from '../../asserts/12.svg';
import './index.scss';

export default function PlanCard({ tag, duration, subtitle, price, badge, features, checks, color }) {
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