import React from 'react';
import './index.scss';
import { useNavigate } from 'react-router-dom';

export default function Thumbnail(props) {
  const { title, subtitle, image, button1, button2, description, subDescription } = props;
  const navigate = useNavigate();
  const handleClick = (button) => {
    if (button === '微笑測試') {
      navigate('/upload');
    } else if (button === '關於珍舒美') {
      navigate('/about');
    }
  }
  return (
    <div className="thumbnail-section">
      <div className="content-wrapper">
        {/* 横向内容：左文右图 */}
        <div className="main-content">
          {/* 左主文案 */}
          <div className="text-content">
            <h1 className="main-title">
              {title}
              {/* SHINE BRIGHT<br />ALIGN RIGHT */}
            </h1>
            {subtitle && <div className="subtitle">
              {subtitle}
            </div>}
            {subDescription && <div className="sub-description">
              {subDescription}
            </div>}

            {/* 按钮区 */}
            <div className="button-group">
              {
                button1 && (
                  <button className="primary-button" onClick={() => handleClick(button1)}>
                    {button1}
                    <span className="star-icon">✦</span>
                  </button>
                )
              }
              {
                button2 && (
                  <button className="secondary-button" onClick={() => handleClick(button2)}>
                    {button2}
                  </button>
                )
              }
            </div>

            {/* 细说明 */}
            {
              description && (
                <div className="description">
                  {description}
                </div>
              )
            }
          </div>
          {/* 右图像 */}
          <div className="image-container">
            <img
              src={image}
              alt="#"
              className="main-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
