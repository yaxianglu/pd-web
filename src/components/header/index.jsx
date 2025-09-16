import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import "./index.css";
import logo from '../../asserts/2.svg';
import open from './imgs/1.svg';
import { Select } from 'antd';
import 'antd/dist/reset.css';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSelector from '../language-selector';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showCover, setShowCover] = useState(false); // 是否顯示遮罩

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 50);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1125);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    handleResize();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLoginClick = () => {
    window.open('/login', '_blank');
  };

  const getCurrentBrandValue = () => {
    switch (location.pathname) {
      case '/':
      case '/front-page':
        return t('brand.pearlDigital');
      case '/about':
        return t('about.title');
      case '/join':
        return t('brand.pearlDigital'); // 改为始终显示 PEARL DIGITAL
      default:
        return t('brand.pearlDigital');
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
      case t('brand.pearlDigital'):
        navigate('/');
        break;
      case t('navigation.invisibleBraces'):
        navigate('/invisible-braces');
        break;
      case t('navigation.maintainer'):
        navigate('/maintainer');
        break;
      case t('navigation.whitening'):
        navigate('/whitening');
        break;
      case t('navigation.journey'):
        navigate('/journey');
        break;
      case t('navigation.correction'):
        navigate('/correction');
        break;
      case t('navigation.about'):
        navigate('/about');
        break;
      case t('navigation.partners'):
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
        {
          isMobile ? null : (
            <Select
            defaultValue={getCurrentBrandValue()}
            size="small"
            style={{ width: 160, height: 36 }}
            className="brand-select"
            options={[
              { value: t('brand.pearlDigital'), label: t('brand.pearlDigital') },
              { value: t('about.title'), label: t('about.title') },
              { value: t('about.partners'), label: t('about.partners') },
            ]}
            onChange={handleBrandSelectChange}
          />
          )
        }
        
        {!isMobile && (
          <>
          <nav className="header-nav">
            <a 
              href="#" 
              className={location.pathname === '/invisible-braces' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); navigate('/invisible-braces'); }}
            >
              {t('navigation.invisibleBraces')}
            </a>
            <a 
              href="#" 
              className={location.pathname === '/maintainer' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); navigate('/maintainer'); }}
            >
              {t('navigation.maintainer')}
            </a>
            <a 
              href="#" 
              className={location.pathname === '/journey' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); navigate('/journey'); }}
            >
              {t('navigation.journey')}
            </a>
            <a 
              href="#" 
              className={location.pathname === '/correction' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); navigate('/correction'); }}
            >
              {t('navigation.correction')}
            </a>
          </nav>
        </>
        )}
        
        <button className="test-btn" onClick={() => window.open('/upload', '_blank')}>
          {t('navigation.smileTest')} <span className="star">✦</span>
        </button>
      </div>
      <div className="header-right">
        {isMobile ? (
          <img src={open} alt="#" style={{ width: 28, height: 28, marginLeft: 12 }} onClick={() => setShowCover(true)}/>
        ) : (
          <>
          <LanguageSelector
            size="small"
            style={{ width: 120, height: 36 }}
            className="lang-select"
          />
          <button className="login-btn" onClick={handleLoginClick}>{t('common.login')}</button>
          </>
        )}
      </div>
      {showCover && (
        <div className="header-cover" onClick={() => setShowCover(false)}>
          <div className="header-cover-close" onClick={() => setShowCover(false)}>X</div>
          <div className="header-cover-content">
            <span onClick={() => navigate('/invisible-braces')}>{t('navigation.invisibleBraces')}</span>
            <span onClick={() => navigate('/maintainer')}>{t('navigation.maintainer')}</span>
            <span onClick={() => navigate('/journey')}>{t('navigation.journey')}</span>
            <span onClick={() => navigate('/correction')}>{t('navigation.correction')}</span>
            <span onClick={() => navigate('/about')}>{t('navigation.about')}</span>
            <span onClick={() => navigate('/join')}>{t('navigation.partners')}</span>
            <span onClick={handleLoginClick}>{t('common.login')}</span>
          </div>
        </div>
      )}
    </header>
  );
}
