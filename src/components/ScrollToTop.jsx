import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    console.log('ScrollToTop: Route changed to', location.pathname);
    console.log('ScrollToTop: Current scroll position:', window.scrollY);
    
    // 排除join路由，不自动滚动到顶部
    if (location.pathname !== '/join') {
      console.log('ScrollToTop: Scrolling to top');
      
      // 先滚动到稍微下面的位置，让滚动效果更明显
      window.scrollTo(0, 50);
      
      // 使用setTimeout确保页面内容完全加载后再滚动
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
        
        console.log('ScrollToTop: Smooth scroll executed');
      }, 150);
    } else {
      console.log('ScrollToTop: Skipping scroll for join route');
    }
  }, [location.pathname]);

  return null;
}

export default ScrollToTop;
