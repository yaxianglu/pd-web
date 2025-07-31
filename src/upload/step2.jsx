import React, { useState } from 'react';
import './step2.scss';
import p3 from './imgs/3.svg';
import p4 from './imgs/4.svg';
import p5 from './imgs/5.svg';
import p6 from './imgs/6.svg';
import p11 from './imgs/11.svg';
import p12 from './imgs/12.svg';
import p13 from './imgs/13.svg';
import p14 from './imgs/14.svg';

export default function Step2({ onNext, onPrev, style }) {
  const [formData, setFormData] = useState({
    teethDescription: [],
    alignerConsideration: [],
    improvement: ''
  });

  const teethOptions = [
    { id: 'crowded', label: '齒列擁擠', image: p3 },
    { id: 'malocclusion', label: '咬合不正', image: p4 },
    { id: 'gap', label: '牙縫問題', image: p5 },
    { id: 'crooked', label: '輕微歪斜', image: p6 }
  ];

  const considerationOptions = [
    { id: 'price', label: '價格', icon: <img src={p11} alt="p11" /> },
    { id: 'procedure', label: '治療程序', icon: <img src={p12} alt="p12" style={{ width: '100%', height: '100%' }} /> },
    { id: 'duration', label: '療程週期', icon: <img src={p13} alt="p13" /> },
    { id: 'pain', label: '疼痛狀況', icon: <img src={p14} alt="p14" /> }
  ];

  const handleTeethSelect = (optionId) => {
    setFormData(prev => {
      const currentSelection = Array.isArray(prev.teethDescription) ? prev.teethDescription : [];
      let newSelection;
      
      if (optionId === 'unsure') {
        // 如果选择"我不確定"，清空其他选择
        newSelection = ['unsure'];
      } else {
        // 移除"我不確定"选项
        newSelection = currentSelection.filter(id => id !== 'unsure');
        
        if (currentSelection.includes(optionId)) {
          // 如果已选中，则取消选择
          newSelection = newSelection.filter(id => id !== optionId);
        } else {
          // 如果未选中，则添加选择
          newSelection = [...newSelection, optionId];
        }
      }
      
      return {
        ...prev,
        teethDescription: newSelection
      };
    });
  };

  const handleConsiderationSelect = (optionId) => {
    setFormData(prev => {
      const currentSelection = Array.isArray(prev.alignerConsideration) ? prev.alignerConsideration : [];
      let newSelection;
      
      if (optionId === 'none') {
        // 如果选择"以上都沒有"，清空其他选择
        newSelection = ['none'];
      } else {
        // 移除"以上都沒有"选项
        newSelection = currentSelection.filter(id => id !== 'none');
        
        if (currentSelection.includes(optionId)) {
          // 如果已选中，则取消选择
          newSelection = newSelection.filter(id => id !== optionId);
        } else {
          // 如果未选中，则添加选择
          newSelection = [...newSelection, optionId];
        }
      }
      
      return {
        ...prev,
        alignerConsideration: newSelection
      };
    });
  };

  const handleImprovementChange = (e) => {
    setFormData(prev => ({
      ...prev,
      improvement: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext && onNext(formData);
  };

  const handlePrev = () => {
    onPrev && onPrev();
  };

  return (
    <div className="step2-wrapper" style={style}>
      <div className="step2-content">
        <form className="step2-form" onSubmit={handleSubmit}>
          {/* 第一部分：牙齿描述 */}
          <div className="form-section">
            <h2 className="section-title">您如何形容您的牙齒？</h2>
            <div className="options-grid">
              {teethOptions.map(option => (
                <div
                  key={option.id}
                  className={`option-card ${formData.teethDescription.includes(option.id) ? 'selected' : ''}`}
                  onClick={() => handleTeethSelect(option.id)}
                >
                  <div className="option-image">
                    <img src={option.image} alt={option.label} />
                  </div>
                  <div className="option-label">{option.label}</div>
                </div>
              ))}
            </div>
            <button
              type="button"
              className={`unsure-button ${formData.teethDescription.includes('unsure') ? 'selected' : ''}`}
              onClick={() => handleTeethSelect('unsure')}
            >
              我不確定
            </button>
          </div>

          {/* 第二部分：透明牙套考量 */}
          <div className="form-section">
            <h2 className="section-title">您對於透明牙套的考量是？</h2>
            <div className="options-grid">
              {considerationOptions.map(option => (
                <div
                  key={option.id}
                  className={`option-card ${formData.alignerConsideration.includes(option.id) ? 'selected' : ''}`}
                  onClick={() => handleConsiderationSelect(option.id)}
                >
                  <div className="option-icon">{option.icon}</div>
                  <div className="option-label">{option.label}</div>
                </div>
              ))}
            </div>
            <button
              type="button"
              className={`none-button ${formData.alignerConsideration.includes('none') ? 'selected' : ''}`}
              onClick={() => handleConsiderationSelect('none')}
            >
              以上都沒有
            </button>
          </div>

          {/* 第三部分：改善需求 */}
          <div className="form-section">
            <h2 className="section-title">您覺得哪裡需要改善嗎？</h2>
            <div className="improvement-input-wrapper">
              <input
                type="text"
                className="improvement-input"
                value={formData.improvement}
                onChange={handleImprovementChange}
                placeholder="例如:我希望牙齒變得整齊。"
              />
            </div>
          </div>

          {/* 按钮区域 */}
          <div className="step2-buttons">
            <button
              type="button"
              className="step2-prev-button"
              onClick={handlePrev}
            >
              上一步
            </button>
            <button
              type="submit"
              className="step2-next-button"
            >
              下一步
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}