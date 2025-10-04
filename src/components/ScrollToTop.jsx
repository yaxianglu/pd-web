import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    console.log('ScrollToTop: Route changed to', location.pathname);
    
    // 延迟0.5秒后滚动到顶部
    const timer = setTimeout(() => {
      console.log('ScrollToTop: Executing scroll to top');
      
      // 强制滚动到顶部 - 使用最简单的方法
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // 再尝试平滑滚动
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      }, 10);
      
      console.log('ScrollToTop: Scroll command completed');
    }, 500);

    // 清理定时器
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return null;
}

export default ScrollToTop;