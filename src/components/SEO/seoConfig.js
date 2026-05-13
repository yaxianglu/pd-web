// SEO Configuration for different pages
export const seoConfig = {
  home: {
    title: '珍舒美 Shineville - FDA認證隱形牙套 | AI智能矯正 | 美國品牌',
    description: '珍舒美（Shineville）隱形牙套，美國FDA認證、AI智能矯正系統。採用醫療級材料，專業團隊30年經驗，台灣ISO 13485認證製造。提供平價、專業、透明的矯正體驗。',
    keywords: 'clear aligner, invisible braces, orthodontics, teeth straightening, FDA cleared, AI orthodontics, medical grade, transparent aligners, bite correction, malocclusion treatment, 珍舒美, 隱形牙套, 透明牙套, 平價矯正, 微笑矯正, 隱形矯正, 數位化矯正, 美國品牌, AI技術, 亞洲人數據庫, 維持器, 美國FDA認證, 台灣TFDA class II, 台灣醫療器材, 台灣製造工廠, 國際醫療器材標準',
    url: '/',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "MedicalBusiness",
      "name": "珍舒美 Shineville Digital",
      "alternateName": "珍舒美",
      "description": "珍舒美（Shineville）AI智能隱形牙套矯正系統，美國FDA認證，採用醫療級材料",
      "url": "https://pearl-digital.com",
      "medicalSpecialty": "Orthodontics",
      "serviceType": "Clear Aligner Treatment"
    }
  },
  
  invisibleBraces: {
    title: '珍舒美隱形牙套 - FDA認證透明牙套 | AI智能矯正 | 美國品牌',
    description: '珍舒美隱形牙套，美國FDA認證、AI智能矯正系統。採用醫療級透明材料，專業治療規劃，精準模擬牙齒移動。提供輕度、中度、重度三種方案，價格公開透明。',
    keywords: 'clear aligner, invisible braces, FDA cleared, AI orthodontics, transparent aligners, teeth straightening, orthodontic treatment, medical grade materials, 珍舒美, 隱形牙套, 透明牙套, 平價矯正, 微笑矯正, 隱形矯正, 數位化矯正, 美國品牌, AI技術, 亞洲人數據庫, 維持器, 美國FDA認證, 台灣TFDA class II, 台灣醫療器材, 台灣製造工廠, 國際醫療器材標準',
    url: '/invisible-braces',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "珍舒美隱形牙套",
      "alternateName": "珍舒美透明牙套",
      "description": "珍舒美FDA認證隱形牙套，AI智能治療規劃",
      "brand": {
        "@type": "Brand",
        "name": "珍舒美 Shineville Digital"
      },
      "category": "Orthodontic Treatment",
      "offers": {
        "@type": "Offer",
        "priceRange": "$48,000 - $118,000"
      }
    }
  },

  maintainer: {
    title: '珍舒美維持器 - 透明維持器 | 穩定矯正成果 | 珍舒美',
    description: '珍舒美透明維持器，穩定您的矯正成果。採用醫療級高透明材料，邊緣光滑、配戴舒適，幾乎隱形。有效防止牙齒回彈，保持咬合穩定。',
    keywords: 'clear retainers, orthodontic retainers, smile maintenance, transparent retainers, post-treatment care, teeth stability, 珍舒美, 維持器, 透明維持器, 矯正維持器, 隱形牙套, 透明牙套, 平價矯正, 微笑矯正, 矯正後維持, 牙齒穩定, 維持器, 透明維持器, 矫正维持器',
    url: '/maintainer',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "珍舒美透明維持器",
      "description": "珍舒美醫療級透明維持器，穩定矯正成果",
      "brand": {
        "@type": "Brand",
        "name": "珍舒美 Shineville Digital"
      },
      "category": "Orthodontic Retainers"
    }
  },

  journey: {
    title: '珍舒美旅程 - 隱形牙套治療流程 | 微笑升級 | 珍舒美',
    description: '了解珍舒美隱形牙套完整治療流程。從預約、評估、計劃、旅程到關懷，AI智能輔助設計，確保最佳矯正效果。價格公開透明，無隱藏費用。',
    keywords: 'clear aligner journey, orthodontic process, treatment steps, AI treatment planning, orthodontic consultation, smile transformation, 珍舒美, 珍舒美旅程, 隱形牙套, 透明牙套, 平價矯正, 微笑矯正, 矯正流程, 治療過程, 微笑升級, 矯正方案',
    url: '/journey',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "MedicalProcedure",
      "name": "Clear Aligner Treatment Process",
      "description": "Step-by-step clear aligner orthodontic treatment process",
      "provider": {
        "@type": "MedicalBusiness",
        "name": "珍舒美 Shineville Digital"
      }
    }
  },

  correction: {
    title: '珍舒美矯正與美 - 咬合矯正 | 牙齒排列 | 隱形牙套',
    description: '珍舒美矯正與美，全面矯正咬合與牙齒排列問題。改善上前牙突出、下巴後縮、牙弓狹窄等亞洲人常見問題。隱形牙套治療，美觀舒適。',
    keywords: 'orthodontic treatment, bite correction, teeth alignment, malocclusion, protrusion, crowding, orthodontics, dental correction, 珍舒美, 隱形牙套, 透明牙套, 平價矯正, 微笑矯正, 隱形矯正, 數位化矯正',
    url: '/correction',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "MedicalProcedure",
      "name": "Orthodontic Treatment",
      "description": "Comprehensive orthodontic treatment for bite and alignment correction",
      "bodyLocation": "Teeth and Jaw",
      "procedureType": "Orthodontic Treatment"
    }
  },

  about: {
    title: '關於珍舒美 - 美國矽谷AI智能矯正 | 珍舒美品牌故事',
    description: '了解珍舒美（Shineville Digital）的品牌故事。創立於美國矽谷，結合30年臨床經驗與AI技術，專為亞洲人設計的隱形牙套系統。Dr. David Shen指導醫師，專業醫療團隊。',
    keywords: 'about Shineville Digital, AI orthodontics, Silicon Valley, orthodontic technology, Dr. David Shen, clinical expertise, orthodontic innovation, 珍舒美, 關於珍舒美, 隱形牙套, 透明牙套, 平價矯正, 微笑矯正, 美國品牌, AI技術, 美國矽谷, 矯正專業團隊',
    url: '/about',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "About Shineville Digital",
      "description": "Learn about our AI-powered orthodontic technology and clinical expertise",
      "mainEntity": {
        "@type": "MedicalBusiness",
        "name": "珍舒美 Shineville Digital"
      }
    }
  },

  join: {
    title: '珍舒美合作夥伴 - 加入診所網絡 | 隱形牙套合作計劃',
    description: '加入珍舒美合作夥伴網絡，為患者提供FDA認證隱形牙套。提供數位行銷支援、專業資源、品牌視覺資源，協助診所拓展客源與品牌曝光。',
    keywords: 'orthodontic partner, dental partner, clear aligner partnership, orthodontic network, dental practice partnership, orthodontic marketing, 珍舒美, 合作夥伴, 隱形牙套, 透明牙套, 平價矯正, 微笑矯正, 診所合作, 醫師合作, 數位行銷支援',
    url: '/join',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Partner With Shineville",
      "description": "Join our orthodontic partner network and offer clear aligner treatments",
      "mainEntity": {
        "@type": "MedicalBusiness",
        "name": "珍舒美 Shineville Digital"
      }
    }
  },

  upload: {
    title: '珍舒美免費微笑測試 - 線上評估 | 隱形牙套適用性檢測',
    description: '珍舒美免費微笑測試，只需上傳幾張照片，即可快速了解您是否適合隱形牙套治療。專業團隊評估，提供個人化建議。完全免費，無需費用。',
    keywords: 'free smile quiz, clear aligner assessment, orthodontic consultation, smile test, teeth evaluation, orthodontic suitability, 珍舒美, 微笑測試, 免費微笑測試, 隱形牙套, 透明牙套, 平價矯正, 微笑矯正, 線上評估, 矯正諮詢',
    url: '/upload',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Shineville Smile Quiz",
      "description": "Free online smile assessment for clear aligner suitability",
      "applicationCategory": "HealthApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  },

  faq: {
    title: '珍舒美常見問題 - 隱形牙套FAQ | 矯正常見問題解答',
    description: '珍舒美常見問題解答，包含隱形牙套療程、配戴時間、安全性、價格、付款方式等問題。專業團隊提供詳細解答，讓您了解矯正治療的每個細節。',
    keywords: 'clear aligner FAQ, orthodontic questions, invisible braces FAQ, orthodontic treatment questions, clear aligner safety, orthodontic pricing, 珍舒美, 常見問題, 隱形牙套, 透明牙套, 平價矯正, 微笑矯正, 矯正常見問題, 矯正安全性, 矯正價格',
    url: '/faq',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "name": "Shineville Digital FAQ",
      "description": "Frequently asked questions about clear aligners and orthodontic treatment"
    }
  }
};

// Common keywords used across all pages
export const commonKeywords = [
  'clear aligner',
  'invisible braces',
  'orthodontics',
  'teeth straightening',
  'FDA cleared',
  'AI orthodontics',
  'medical grade',
  'transparent aligners',
  'bite correction',
  'malocclusion treatment',
  'oral health',
  'aesthetics',
  'ISO 13485',
  'GMP certified',
  'orthodontic treatment',
  'clear aligner therapy',
  'teeth alignment',
  'smile correction',
  'orthodontic consultation',
  'dental treatment',
  // 中文关键字（简体）
  '珍舒美',
  '隐形牙套',
  '透明牙套',
  '平价矫正',
  '微笑矫正',
  '隐形矫正',
  '数字化矫正',
  '美国品牌',
  'AI技术',
  '亚洲人数据库',
  '维持器',
  '美国FDA认证',
  '台湾TFDA',
  '台湾医疗器材',
  '台湾制造',
  '国际医疗器材标准',
  '牙齿矫正',
  '矫正治疗',
  '咬合矫正',
  '牙齿整齐',
  '笑容升级',
  '微笑测试',
  '珍舒美旅程',
  '矫正与美',
  // 中文关键字（繁体）
  '隱形牙套',
  '透明牙套',
  '平價矯正',
  '微笑矯正',
  '隱形矯正',
  '數位化矯正',
  '美國品牌',
  'AI技術',
  '亞洲人數據庫',
  '維持器',
  '美國FDA認證',
  '台灣TFDA class II',
  '台灣醫療器材',
  '台灣製造工廠',
  '國際醫療器材標準',
  '牙齒矯正',
  '矯正治療',
  '咬合矯正',
  '牙齒整齊',
  '笑容升級',
  '微笑測試',
  '珍舒美旅程',
  '矯正與美'
];

// Generate keywords string for a page
export const generateKeywords = (pageKeywords = [], includeCommon = true) => {
  const keywords = includeCommon ? [...commonKeywords, ...pageKeywords] : pageKeywords;
  return [...new Set(keywords)].join(', ');
};
