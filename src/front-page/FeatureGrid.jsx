import React from "react";
import { useNavigate } from "react-router-dom";
import './FeatureGrid.scss';
import png1 from './imgs/1.svg';
import png2 from './imgs/2.svg';
import png3 from './imgs/3.svg';
import png4 from './imgs/4.svg';
import p2 from '../asserts/2-white.svg';

export default function OrthoPaletteGrid() {
  const navigate = useNavigate();

  const handleGridItemClick = (path) => {
    navigate(path);
  };

  return (
    <div className="feature-grid">
      <div className="grid-container">
        {/* 隐形牙套 */}
        <div 
          className="grid-item invisible-aligners" 
          onClick={() => handleGridItemClick('/invisible-braces')}
          style={{ cursor: 'pointer' }}
        >
          <div className="grid-container-title">
            隱形牙套
          </div>
          <div className="description description-large">
            了解療程設計與隱形牙套的 <br/>
            矯正優勢
          </div>
          <div className="icon">
            <img src={png1} alt="隐形牙套" />
          </div>
        </div>
        
        {/* 正畸與美 */}
        <div 
          className="grid-item orthodontics-beauty"
          onClick={() => handleGridItemClick('/correction')}
          style={{ cursor: 'pointer' }}
        >
          <div className="grid-container-title">
            矯正與美
          </div>
          <div className="description description-medium">
            正確的齒列排列，不只是外觀上<br/>
            的美感，更是口腔健康的基礎
          </div>
          <div className="icon" style={{ top: '70%' }}>
            <img src={png2} alt="正畸与美" />
          </div>
        </div>
        
        {/* 維持器 */}
        <div 
          className="grid-item retainer"
          onClick={() => handleGridItemClick('/maintainer')}
          style={{ cursor: 'pointer' }}
        >
          <div className="grid-container-title">
            維持器
          </div>
          <div className="description description-medium">
            了解維持器的佩戴時機與<br/>
            保養方式
          </div>
          <div className="icon">
            <img src={png4} alt="維持器" />
          </div>
        </div>
        
        <div 
          className="grid-item smile-test"
          onClick={() => handleGridItemClick('/')}
          style={{ cursor: 'pointer' }}
        >
          <img src={p2} alt="主页" />
        </div>
        
        {/* 美白介紹 */}
        <div className="grid-item whitening-intro"
          onClick={() => handleGridItemClick('/upload')}
        >
          <div className="grid-container-title">
          微笑測試
          </div>
          <div className="description description-medium">
            透過珍舒美的免費微笑測試，只需幾張照片，<br />就能快速了解您是否適合進行隱形矯正，並獲得專屬建議
          </div>
          <div className="icon">
            <img src={png3} alt="美白介紹" />
          </div>
        </div>
      </div>
    </div>
  );
}
