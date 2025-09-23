import React from 'react';
import './index.scss';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export default function Thumbnail(props) {
  const { title, subtitle, image, button1, button2, description, subDescription } = props;
  const { t } = useLanguage();
  const navigate = useNavigate();
  const handleClick = (button) => {
    if (button === '微笑測試' || button === 'Smile Quiz' || button === '微笑测试') {
      window.open('/upload', '_blank');
    } else if (button === '關於珍舒美' || button === '关于珍舒美' || button === 'About Pearl Digital') {
      navigate('/about');
    }
  }
  return (
    <div className="thumbnail-section">
      <div className="content-wrapper">
        <div className="main-content">
          <div className="text-content">
            <h1 className="main-title">
              {title}
            </h1>
            {subtitle && <div className="subtitle">
              {subtitle}
            </div>}
            {subDescription && <div className="sub-description">
              {subDescription}
            </div>}

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

            {
              description && (
                <div className="description">
                  {description}
                </div>
              )
            }
          </div>
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
