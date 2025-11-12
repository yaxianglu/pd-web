import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { seoConfig, generateKeywords } from '../components/SEO/seoConfig';
import { useLanguage } from '../context/LanguageContext';
import { getPageTitle } from '../config/pageTitles';

// Hook to automatically set SEO based on current route
export const useSEO = (pageKey, customSEO = {}) => {
  const location = useLocation();
  const { currentLanguage } = useLanguage();
  
  useEffect(() => {
    const pageSEO = seoConfig[pageKey] || {};
    const mergedSEO = { ...pageSEO, ...customSEO };
    
    // 优先使用 pageTitles 配置中的多语言标题（如果存在）
    // 这样可以确保标题能够根据语言动态切换
    const dynamicTitle = getPageTitle(location.pathname, currentLanguage);
    const titleToUse = dynamicTitle || mergedSEO.title;
    
    // Update document title
    if (titleToUse) {
      document.title = titleToUse;
    }
    
    // Update meta description
    if (mergedSEO.description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', mergedSEO.description);
      }
    }
    
    // Update meta keywords
    if (mergedSEO.keywords) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', mergedSEO.keywords);
      } else {
        // Create keywords meta tag if it doesn't exist
        const keywordsMeta = document.createElement('meta');
        keywordsMeta.name = 'keywords';
        keywordsMeta.content = mergedSEO.keywords;
        document.head.appendChild(keywordsMeta);
      }
    }
    
    // Update canonical URL
    if (mergedSEO.url) {
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.setAttribute('href', `https://pearl-digital.com${mergedSEO.url}`);
      }
    }
    
    // Update Open Graph tags
    if (mergedSEO.title) {
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', mergedSEO.title);
      }
    }
    
    if (mergedSEO.description) {
      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        ogDescription.setAttribute('content', mergedSEO.description);
      }
    }
    
    if (mergedSEO.url) {
      const ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) {
        ogUrl.setAttribute('content', `https://pearl-digital.com${mergedSEO.url}`);
      }
    }
    
    // Update Twitter tags
    if (mergedSEO.title) {
      const twitterTitle = document.querySelector('meta[property="twitter:title"]');
      if (twitterTitle) {
        twitterTitle.setAttribute('content', mergedSEO.title);
      }
    }
    
    if (mergedSEO.description) {
      const twitterDescription = document.querySelector('meta[property="twitter:description"]');
      if (twitterDescription) {
        twitterDescription.setAttribute('content', mergedSEO.description);
      }
    }
    
    if (mergedSEO.url) {
      const twitterUrl = document.querySelector('meta[property="twitter:url"]');
      if (twitterUrl) {
        twitterUrl.setAttribute('content', `https://pearl-digital.com${mergedSEO.url}`);
      }
    }
    
  }, [location.pathname, pageKey, customSEO, currentLanguage]);
  
  return seoConfig[pageKey] || {};
};

// Hook for custom SEO data
export const useCustomSEO = (seoData) => {
  useEffect(() => {
    if (seoData.title) {
      document.title = seoData.title;
    }
    
    if (seoData.description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', seoData.description);
      }
    }
    
    if (seoData.keywords) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', seoData.keywords);
      }
    }
  }, [seoData]);
};

export { generateKeywords };
