import React from 'react';
import { useResponsive, getResponsiveClass } from '../responsive-hook';
import './index.scss';

export default function PageWrapper({ children }) {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const responsiveClass = getResponsiveClass(isMobile, isTablet, isDesktop);

  return (
    <div className={`page-wrapper ${responsiveClass}`}>
      <div className="page-content">
        {children}
      </div>
    </div>
  );
}
