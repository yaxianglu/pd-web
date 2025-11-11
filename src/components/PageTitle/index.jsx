import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { getPageTitle } from '../../config/pageTitles';

/**
 * 动态设置页面标题的组件
 * 根据当前路由和语言自动更新 document.title
 */
const PageTitle = () => {
  const location = useLocation();
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    // 根据路由和语言获取标题
    const title = getPageTitle(location.pathname, currentLanguage);
    
    // 设置 document.title
    document.title = title;
    
    // 可选：在开发环境下输出日志
    if (process.env.NODE_ENV === 'development') {
      console.log(`[PageTitle] 设置页面标题: "${title}" (路由: ${location.pathname}, 语言: ${currentLanguage})`);
    }
  }, [location.pathname, currentLanguage]);

  // 这个组件不渲染任何内容
  return null;
};

export default PageTitle;

