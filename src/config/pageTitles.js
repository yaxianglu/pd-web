// 页面标题配置
// 根据路由路径和语言返回对应的页面标题

const pageTitles = {
  '/invisible-braces': {
    'zh-TW': '珍舒美隱形牙套｜美國品牌AI智慧透明牙套｜FDA認證品質',
    'zh-CN': '珍舒美隱形牙套｜美國品牌AI智慧透明牙套｜FDA認證品質',
    'en': 'Invisible Clear Aligners | American Brand | AI-Powered Orthodontics | FDA-Cleared Quality'
  },
  '/': {
    'zh-TW': '珍舒美隱形牙套｜美國品牌AI智慧矯正｜FDA認證品質｜Pearly Clear Aligners',
    'zh-CN': '珍舒美隱形牙套｜美國品牌AI智慧矯正｜FDA認證品質｜Pearly Clear Aligners',
    'en': 'Pearly Clear Aligners | American Brand | AI-Powered Orthodontics | FDA-Cleared Quality'
  },
  '/front-page': {
    'zh-TW': '珍舒美隱形牙套｜美國品牌AI智慧矯正｜FDA認證品質｜Pearly Clear Aligners',
    'zh-CN': '珍舒美隱形牙套｜美國品牌AI智慧矯正｜FDA認證品質｜Pearly Clear Aligners',
    'en': 'Pearly Clear Aligners | American Brand | AI-Powered Orthodontics | FDA-Cleared Quality'
  },
  '/maintainer': {
    'zh-TW': '珍舒美維持器｜美國品牌AI智慧設計透明維持器｜FDA認證品質',
    'zh-CN': '珍舒美維持器｜美國品牌AI智慧設計透明維持器｜FDA認證品質',
    'en': 'Pearly Clear Retainers | American Brand | AI-Powered Orthodontics | FDA-Cleared Quality'
  },
  '/journey': {
    'zh-TW': '珍舒美旅程｜美國品牌AI智慧矯正體驗｜FDA認證品質',
    'zh-CN': '珍舒美旅程｜美國品牌AI智慧矯正體驗｜FDA認證品質',
    'en': 'Your Pearly Journey | AI Orthodontic Experience | American Brand | FDA-Cleared Quality'
  },
  '/about': {
    'zh-TW': '關於珍舒美Pearly｜美國品牌AI智慧隱形牙套｜FDA認證品質',
    'zh-CN': '關於珍舒美Pearly｜美國品牌AI智慧隱形牙套｜FDA認證品質',
    'en': 'About Pearly | American Brand | AI-Powered Orthodontics | FDA-Cleared Quality'
  },
  '/correction': {
    'zh-TW': '矯正與美｜美國品牌AI智慧美學矯正｜FDA認證品質｜珍舒美Pearly',
    'zh-CN': '矯正與美｜美國品牌AI智慧美學矯正｜FDA認證品質｜珍舒美Pearly',
    'en': 'Orthodontics & Aesthetics | Pearly Clear Aligners | American Brand | AI-Powered Orthodontics | FDA-Cleared Quality'
  },
  '/join': {
    'zh-TW': '成為合作夥伴｜美國品牌隱形牙套OEM與診所合作｜FDA認證品質｜Pearly珍舒美',
    'zh-CN': '成為合作夥伴｜美國品牌隱形牙套OEM與診所合作｜FDA認證品質｜Pearly珍舒美',
    'en': 'Partner with Pearly | Pearly Clear Aligners | American Brand | AI-Powered Orthodontics | Clinic Partnership | FDA-Cleared Quality'
  }
};

/**
 * 根据路由路径和语言获取页面标题
 * @param {string} pathname - 路由路径
 * @param {string} language - 语言代码 ('zh-TW', 'zh-CN', 'en')
 * @returns {string} 页面标题
 */
export const getPageTitle = (pathname, language = 'zh-TW') => {
  // 标准化路径（移除尾部斜杠，除了根路径）
  const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
  
  // 查找匹配的标题配置
  const titleConfig = pageTitles[normalizedPath];
  
  if (titleConfig && titleConfig[language]) {
    return titleConfig[language];
  }
  
  // 如果没有找到对应语言的标题，尝试使用繁体中文作为默认
  if (titleConfig && titleConfig['zh-TW']) {
    return titleConfig['zh-TW'];
  }
  
  // 如果完全没有找到，返回默认标题
  return 'Pearly Clear Aligners | American Brand | AI-Powered Orthodontics';
};

export default pageTitles;

