import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import "./index.css";
import logo from '../../asserts/2.svg';
import { Select } from 'antd';
import 'antd/dist/reset.css';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 50);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    // 初始化时检查屏幕尺寸
    handleResize();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const getCurrentBrandValue = () => {
    switch (location.pathname) {
      case '/':
      case '/front-page':
        return 'PEARL DIGITAL';
      case '/about':
        return '關於我們';
      case '/join':
        return '合作夥伴';
      default:
        return 'PEARL DIGITAL';
    }
  };

  const getCurrentNavValue = () => {
    switch (location.pathname) {
      case '/invisible-braces':
        return '/invisible-braces';
      case '/maintainer':
        return '/maintainer';
      case '/journey':
        return '/journey';
      case '/correction':
        return '/correction';
      default:
        return '/invisible-braces';
    }
  };

  const handleBrandSelectChange = (value) => {
    switch (value) {
      case 'PEARL DIGITAL':
        navigate('/');
        break;
      case '隱形牙套':
        navigate('/invisible-braces');
        break;
      case '維持器':
        navigate('/maintainer');
        break;
      case '珍舒美白':
        navigate('/whitening');
        break;
      case '珍舒美旅程':
        navigate('/journey');
        break;
      case '矯正與美':
        navigate('/correction');
        break;
      case '關於我們':
        navigate('/about');
        break;
      case '合作夥伴':
        navigate('/join');
        break;
      default:
        break;
    }
  };

  const handleNavSelectChange = (value) => {
    navigate(value);
  };

  return (
    <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-left">
        <img 
          src={logo} 
          alt="logo" 
          className="header-logo-img" 
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        />
      </div>
      <div className="header-center">
        <Select
          defaultValue={getCurrentBrandValue()}
          size="small"
          style={{ width: 160, height: 36 }}
          className="brand-select"
          options={[
            { value: 'PEARL DIGITAL', label: 'PEARL DIGITAL' },
            { value: '關於我們', label: '關於我們' },
            { value: '合作夥伴', label: '合作夥伴' },
          ]}
          onChange={handleBrandSelectChange}
        />
        
        {/* 桌面端导航 */}
        {!isMobile && (
          <>
          <nav className="header-nav">
            <a 
              href="#" 
              className={location.pathname === '/invisible-braces' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); navigate('/invisible-braces'); }}
            >
              隱形牙套
            </a>
            <a 
              href="#" 
              className={location.pathname === '/maintainer' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); navigate('/maintainer'); }}
            >
              維持器
            </a>
            <a 
              href="#" 
              className={location.pathname === '/journey' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); navigate('/journey'); }}
            >
              珍舒美旅程
            </a>
            <a 
              href="#" 
              className={location.pathname === '/correction' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); navigate('/correction'); }}
            >
              矯正與美
            </a>
          </nav>
            <button className="test-btn" onClick={() => navigate('/upload')}>
              微笑測試 <span className="star">✦</span>
            </button>
        </>
        )}
        
        {/* 移动端导航下拉框 */}
        {isMobile && (
          <Select
            defaultValue={getCurrentNavValue()}
            size="small"
            style={{ width: 120, height: 36 }}
            className="nav-select"
            options={[
              { value: '/invisible-braces', label: '隱形牙套' },
              { value: '/maintainer', label: '維持器' },
              { value: '/journey', label: '珍舒美旅程' },
              { value: '/correction', label: '矯正與美' },
              { value: '/upload', label: '微笑測試' },
            ]}
            onChange={handleNavSelectChange}
          />
        )}
        
      </div>
      <div className="header-right">
        <Select
          defaultValue="台灣(繁中)"
          size="small"
          style={{ width: 120, height: 36 }}
          className="lang-select"
          options={[
            { value: '台灣(繁中)', label: '台灣(繁中)' },
            { value: '中国(简体)', label: '中国(简体)' },
            { value: 'EN', label: 'EN' }
          ]}
        />
        <button className="login-btn" onClick={handleLoginClick}>登入</button>
      </div>
    </header>
  );
}
