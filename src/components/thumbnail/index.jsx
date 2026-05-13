import React from 'react';
import './index.scss';
import { useNavigate } from 'react-router-dom';

export default function Thumbnail(props) {
  const {
    title,
    subtitle,
    image,
    button1,
    button2,
    description,
    subDescription,
    onButton1Click,
    onButton2Click,
    variant = 'default',
  } = props;
  const navigate = useNavigate();
  const handleClick = (button) => {
    if (button === '微笑測試' || button === 'Smile Quiz' || button === '微笑测试') {
      window.open('/upload', '_blank');
    } else if (button === '關於珍舒美' || button === '关于珍舒美' || button === 'About Pearl Digital') {
      navigate('/about');
    }
  };

  const handlePrimaryClick = () => {
    if (typeof onButton1Click === 'function') {
      onButton1Click();
      return;
    }
    handleClick(button1);
  };

  const handleSecondaryClick = () => {
    if (typeof onButton2Click === 'function') {
      onButton2Click();
      return;
    }
    handleClick(button2);
  };

  return (
    <div className={`thumbnail-section thumbnail-section-${variant}`}>
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
                  <button className="primary-button" onClick={handlePrimaryClick}>
                    {button1}
                    <span className="star-icon">✦</span>
                  </button>
                )
              }
              {
                button2 && (
                  <button className="secondary-button" onClick={handleSecondaryClick}>
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
