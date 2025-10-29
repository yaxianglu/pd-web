// SEO Configuration for different pages
export const seoConfig = {
  home: {
    title: 'Pearly Clear Aligners - FDA Cleared Invisible Braces | AI-Powered Orthodontics',
    description: 'Transform your smile with Pearly clear aligners. FDA cleared, AI-powered orthodontic treatment with medical-grade materials. Professional treatment planning with 30+ years experience. Made in Taiwan with ISO 13485 certification.',
    keywords: 'clear aligner, invisible braces, orthodontics, teeth straightening, FDA cleared, AI orthodontics, medical grade, transparent aligners, bite correction, malocclusion treatment, 珍舒美, 隱形牙套, 透明牙套, 平價矯正, 微笑矯正, 隱形矯正, 數位化矯正, 美國品牌, AI技術, 亞洲人數據庫, 維持器, 美國FDA認證, 台灣TFDA class II, 台灣醫療器材, 台灣製造工廠, 國際醫療器材標準',
    url: '/',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "MedicalBusiness",
      "name": "Pearly Digital",
      "description": "AI-powered clear aligner orthodontic treatment with FDA clearance and medical-grade materials",
      "url": "https://pearl-digital.com",
      "medicalSpecialty": "Orthodontics",
      "serviceType": "Clear Aligner Treatment"
    }
  },
  
  invisibleBraces: {
    title: 'Clear Aligners - FDA Cleared Invisible Braces | Pearly Digital',
    description: 'Discover Pearly clear aligners - FDA cleared, AI-powered invisible braces. Medical-grade materials, professional treatment planning, and precise tooth movement simulation for optimal orthodontic results.',
    keywords: 'clear aligner, invisible braces, FDA cleared, AI orthodontics, transparent aligners, teeth straightening, orthodontic treatment, medical grade materials, 珍舒美, 隱形牙套, 透明牙套, 平價矯正, 微笑矯正, 隱形矯正, 數位化矯正, 美國品牌, AI技術, 亞洲人數據庫, 維持器, 美國FDA認證, 台灣TFDA class II, 台灣醫療器材, 台灣製造工廠, 國際醫療器材標準',
    url: '/invisible-braces',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Pearly Clear Aligners",
      "description": "FDA cleared clear aligners with AI-powered treatment planning",
      "brand": {
        "@type": "Brand",
        "name": "Pearly Digital"
      },
      "category": "Orthodontic Treatment",
      "offers": {
        "@type": "Offer",
        "priceRange": "$48,000 - $118,000"
      }
    }
  },

  maintainer: {
    title: 'Clear Retainers - Maintain Your Smile Results | Pearly Digital',
    description: 'Keep your orthodontic results stable with Pearly clear retainers. Medical-grade materials, comfortable fit, and nearly invisible design for long-term smile maintenance.',
    keywords: 'clear retainers, orthodontic retainers, smile maintenance, transparent retainers, post-treatment care, teeth stability, 珍舒美, 維持器, 透明維持器, 矯正維持器, 隱形牙套, 透明牙套, 平價矯正, 微笑矯正, 矯正後維持, 牙齒穩定, 維持器, 透明維持器, 矫正维持器',
    url: '/maintainer',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Pearly Clear Retainers",
      "description": "Medical-grade clear retainers for maintaining orthodontic results",
      "brand": {
        "@type": "Brand",
        "name": "Pearly Digital"
      },
      "category": "Orthodontic Retainers"
    }
  },

  journey: {
    title: 'Your Clear Aligner Journey - Step by Step Process | Pearly Digital',
    description: 'Learn about the complete clear aligner treatment process with Pearly. From initial consultation to final results, discover how our AI-powered treatment planning ensures optimal outcomes.',
    keywords: 'clear aligner journey, orthodontic process, treatment steps, AI treatment planning, orthodontic consultation, smile transformation, 珍舒美, 珍舒美旅程, 隱形牙套, 透明牙套, 平價矯正, 微笑矯正, 矯正流程, 治療過程, 微笑升級, 矯正方案',
    url: '/journey',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "MedicalProcedure",
      "name": "Clear Aligner Treatment Process",
      "description": "Step-by-step clear aligner orthodontic treatment process",
      "provider": {
        "@type": "MedicalBusiness",
        "name": "Pearly Digital"
      }
    }
  },

  correction: {
    title: 'Orthodontic Treatment - Correct Bite & Alignment Issues | Pearly Digital',
    description: 'Comprehensive orthodontic treatment for bite correction and teeth alignment. Address common issues like protrusion, malocclusion, and crowding with our advanced clear aligner system.',
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
    title: 'About Pearly Digital - AI-Powered Orthodontics | Our Story',
    description: 'Learn about Pearly Digital\'s mission to revolutionize orthodontics with AI technology. Founded in Silicon Valley, we combine 30+ years of clinical expertise with cutting-edge AI design.',
    keywords: 'about Pearly Digital, AI orthodontics, Silicon Valley, orthodontic technology, Dr. David Shen, clinical expertise, orthodontic innovation, 珍舒美, 關於珍舒美, 隱形牙套, 透明牙套, 平價矯正, 微笑矯正, 美國品牌, AI技術, 美國矽谷, 矯正專業團隊',
    url: '/about',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "About Pearly Digital",
      "description": "Learn about our AI-powered orthodontic technology and clinical expertise",
      "mainEntity": {
        "@type": "MedicalBusiness",
        "name": "Pearly Digital"
      }
    }
  },

  join: {
    title: 'Partner With Pearly - Join Our Orthodontic Network | Become a Partner',
    description: 'Join Pearly Digital\'s partner network and offer FDA cleared clear aligners to your patients. Marketing support, professional resources, and comprehensive training included.',
    keywords: 'orthodontic partner, dental partner, clear aligner partnership, orthodontic network, dental practice partnership, orthodontic marketing, 珍舒美, 合作夥伴, 隱形牙套, 透明牙套, 平價矯正, 微笑矯正, 診所合作, 醫師合作, 數位行銷支援',
    url: '/join',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Partner With Pearly",
      "description": "Join our orthodontic partner network and offer clear aligner treatments",
      "mainEntity": {
        "@type": "MedicalBusiness",
        "name": "Pearly Digital"
      }
    }
  },

  upload: {
    title: 'Free Smile Quiz - See If Clear Aligners Are Right for You | Pearly Digital',
    description: 'Take our free smile quiz to see if clear aligners are right for you. Upload photos and get personalized recommendations from our orthodontic experts.',
    keywords: 'free smile quiz, clear aligner assessment, orthodontic consultation, smile test, teeth evaluation, orthodontic suitability, 珍舒美, 微笑測試, 免費微笑測試, 隱形牙套, 透明牙套, 平價矯正, 微笑矯正, 線上評估, 矯正諮詢',
    url: '/upload',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Pearly Smile Quiz",
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
    title: 'Frequently Asked Questions - Clear Aligners & Orthodontics | Pearly Digital',
    description: 'Find answers to common questions about clear aligners, orthodontic treatment, safety, pricing, and more. Get expert insights from our orthodontic team.',
    keywords: 'clear aligner FAQ, orthodontic questions, invisible braces FAQ, orthodontic treatment questions, clear aligner safety, orthodontic pricing, 珍舒美, 常見問題, 隱形牙套, 透明牙套, 平價矯正, 微笑矯正, 矯正常見問題, 矯正安全性, 矯正價格',
    url: '/faq',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "name": "Pearly Digital FAQ",
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
