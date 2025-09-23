// SEO Configuration for different pages
export const seoConfig = {
  home: {
    title: 'Pearly Clear Aligners - FDA Cleared Invisible Braces | AI-Powered Orthodontics',
    description: 'Transform your smile with Pearly clear aligners. FDA cleared, AI-powered orthodontic treatment with medical-grade materials. Professional treatment planning with 30+ years experience. Made in Taiwan with ISO 13485 certification.',
    keywords: 'clear aligner, invisible braces, orthodontics, teeth straightening, FDA cleared, AI orthodontics, medical grade, transparent aligners, bite correction, malocclusion treatment, 珍舒美，隱形牙套，隱形矯正，數位化矯正，美國品牌，AI技術，亞洲人數據庫，維持器， 美國FDA認證，台灣TFDA class II，台灣醫療器材，台灣製造工廠，國際醫療器材標準',
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
    keywords: 'clear aligner, invisible braces, FDA cleared, AI orthodontics, transparent aligners, teeth straightening, orthodontic treatment, medical grade materials, 珍舒美，隱形牙套，隱形矯正，數位化矯正，美國品牌，AI技術，亞洲人數據庫，維持器， 美國FDA認證，台灣TFDA class II，台灣醫療器材，台灣製造工廠，國際醫療器材標準',
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
    keywords: 'clear retainers, orthodontic retainers, smile maintenance, transparent retainers, post-treatment care, teeth stability',
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
    keywords: 'clear aligner journey, orthodontic process, treatment steps, AI treatment planning, orthodontic consultation, smile transformation',
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
    keywords: 'orthodontic treatment, bite correction, teeth alignment, malocclusion, protrusion, crowding, orthodontics, dental correction',
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
    keywords: 'about Pearly Digital, AI orthodontics, Silicon Valley, orthodontic technology, Dr. David Shen, clinical expertise, orthodontic innovation',
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
    keywords: 'orthodontic partner, dental partner, clear aligner partnership, orthodontic network, dental practice partnership, orthodontic marketing',
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
    keywords: 'free smile quiz, clear aligner assessment, orthodontic consultation, smile test, teeth evaluation, orthodontic suitability',
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
    keywords: 'clear aligner FAQ, orthodontic questions, invisible braces FAQ, orthodontic treatment questions, clear aligner safety, orthodontic pricing',
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
  'dental treatment'
];

// Generate keywords string for a page
export const generateKeywords = (pageKeywords = [], includeCommon = true) => {
  const keywords = includeCommon ? [...commonKeywords, ...pageKeywords] : pageKeywords;
  return [...new Set(keywords)].join(', ');
};
