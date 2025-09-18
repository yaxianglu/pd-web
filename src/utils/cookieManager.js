// Cookie管理工具类
class CookieManager {
  constructor() {
    this.preferences = this.getPreferences();
  }

  // 获取Cookie偏好设置
  getPreferences() {
    try {
      const stored = localStorage.getItem('cookieConsent');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to parse cookie preferences:', error);
    }
    
    // 默认设置：只允许必要Cookie
    return {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false
    };
  }

  // 检查是否已设置Cookie偏好
  hasConsent() {
    return localStorage.getItem('cookieConsent') !== null;
  }

  // 获取Cookie设置日期
  getConsentDate() {
    return localStorage.getItem('cookieConsentDate');
  }

  // 更新Cookie偏好
  updatePreferences(preferences) {
    this.preferences = preferences;
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    
    // 根据偏好设置启用/禁用相应的Cookie
    this.applyPreferences();
  }

  // 应用Cookie偏好设置
  applyPreferences() {
    // 必要Cookie - 始终启用
    if (this.preferences.necessary) {
      this.enableNecessaryCookies();
    }

    // 功能Cookie
    if (this.preferences.functional) {
      this.enableFunctionalCookies();
    } else {
      this.disableFunctionalCookies();
    }

    // 分析Cookie
    if (this.preferences.analytics) {
      this.enableAnalyticsCookies();
    } else {
      this.disableAnalyticsCookies();
    }

    // 营销Cookie
    if (this.preferences.marketing) {
      this.enableMarketingCookies();
    } else {
      this.disableMarketingCookies();
    }
  }

  // 启用必要Cookie
  enableNecessaryCookies() {
    // 这些Cookie对于网站基本功能是必需的
    // 例如：语言偏好、用户认证状态等
    console.log('Enabling necessary cookies');
  }

  // 启用功能Cookie
  enableFunctionalCookies() {
    // 功能Cookie：记住用户偏好、设置等
    console.log('Enabling functional cookies');
    
    // 例如：记住用户的语言选择
    // 这里可以添加具体的功能Cookie设置
  }

  // 禁用功能Cookie
  disableFunctionalCookies() {
    console.log('Disabling functional cookies');
    // 清除功能相关的Cookie
  }

  // 启用分析Cookie
  enableAnalyticsCookies() {
    console.log('Enabling analytics cookies');
    
    // 启用Google Analytics
    // eslint-disable-next-line no-undef
    if (typeof gtag !== 'undefined') {
      // eslint-disable-next-line no-undef
      gtag('consent', 'update', {
        analytics_storage: 'granted'
      });
    }
    
    // 这里可以添加其他分析工具
    // 例如：Google Analytics, Adobe Analytics等
  }

  // 禁用分析Cookie
  disableAnalyticsCookies() {
    console.log('Disabling analytics cookies');
    
    // 禁用Google Analytics
    // eslint-disable-next-line no-undef
    if (typeof gtag !== 'undefined') {
      // eslint-disable-next-line no-undef
      gtag('consent', 'update', {
        analytics_storage: 'denied'
      });
    }
  }

  // 启用营销Cookie
  enableMarketingCookies() {
    console.log('Enabling marketing cookies');
    
    // 启用Facebook Pixel
    // eslint-disable-next-line no-undef
    if (typeof fbq !== 'undefined') {
      // eslint-disable-next-line no-undef
      fbq('consent', 'grant');
    }
    
    // 这里可以添加其他营销工具
    // 例如：Facebook Pixel, Google Ads等
  }

  // 禁用营销Cookie
  disableMarketingCookies() {
    console.log('Disabling marketing cookies');
    
    // 禁用Facebook Pixel
    // eslint-disable-next-line no-undef
    if (typeof fbq !== 'undefined') {
      // eslint-disable-next-line no-undef
      fbq('consent', 'revoke');
    }
  }

  // 重置所有Cookie偏好
  resetPreferences() {
    localStorage.removeItem('cookieConsent');
    localStorage.removeItem('cookieConsentDate');
    this.preferences = this.getPreferences();
  }

  // 检查特定类型的Cookie是否被允许
  isAllowed(type) {
    return this.preferences[type] === true;
  }

  // 获取所有Cookie偏好
  getAllPreferences() {
    return { ...this.preferences };
  }

  // 设置Cookie（带权限检查）
  setCookie(name, value, options = {}) {
    const { type = 'necessary', ...cookieOptions } = options;
    
    if (this.isAllowed(type)) {
      // 设置Cookie
      let cookieString = `${name}=${value}`;
      
      if (cookieOptions.expires) {
        cookieString += `; expires=${cookieOptions.expires}`;
      }
      
      if (cookieOptions.path) {
        cookieString += `; path=${cookieOptions.path}`;
      }
      
      if (cookieOptions.domain) {
        cookieString += `; domain=${cookieOptions.domain}`;
      }
      
      if (cookieOptions.secure) {
        cookieString += `; secure`;
      }
      
      if (cookieOptions.sameSite) {
        cookieString += `; samesite=${cookieOptions.sameSite}`;
      }
      
      document.cookie = cookieString;
      return true;
    }
    
    return false;
  }

  // 获取Cookie
  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(';').shift();
    }
    return null;
  }

  // 删除Cookie
  deleteCookie(name, path = '/') {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
  }
}

// 创建单例实例
const cookieManager = new CookieManager();

export default cookieManager;
