// IP地理位置检测服务
class GeoLocationService {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 24 * 60 * 60 * 1000; // 24小时缓存
  }

  // 获取用户IP地址
  async getUserIP() {
    try {
      console.log('Trying to get IP from ipify.org...');
      const response = await fetch('https://api.ipify.org?format=json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('IP from ipify:', data.ip);
      return data.ip;
    } catch (error) {
      console.warn('Failed to get IP from ipify:', error);
      // 备用方案
      try {
        console.log('Trying to get IP from ipapi.co...');
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('IP from ipapi:', data.ip);
        return data.ip;
      } catch (fallbackError) {
        console.warn('Failed to get IP from ipapi:', fallbackError);
        return null;
      }
    }
  }

  // 根据IP获取地理位置信息
  async getLocationByIP(ip) {
    // 检查缓存
    const cacheKey = `ip_${ip}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      console.log('Using cached location data');
      return cached.data;
    }

    try {
      console.log(`Getting location for IP: ${ip}`);
      // 使用ipapi.co服务（免费，支持中文）
      const response = await fetch(`https://ipapi.co/${ip}/json/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.reason || 'Failed to get location data');
      }

      const locationData = {
        country: data.country_name,
        countryCode: data.country_code,
        region: data.region,
        city: data.city,
        timezone: data.timezone,
        latitude: data.latitude,
        longitude: data.longitude
      };

      // 缓存结果
      this.cache.set(cacheKey, {
        data: locationData,
        timestamp: Date.now()
      });

      return locationData;
    } catch (error) {
      console.warn('Failed to get location from ipapi:', error);
      
      // 备用方案：使用ip-api.com
      try {
        const response = await fetch(`http://ip-api.com/json/${ip}?lang=zh-CN`);
        const data = await response.json();
        
        if (data.status === 'fail') {
          throw new Error(data.message || 'Failed to get location data');
        }

        const locationData = {
          country: data.country,
          countryCode: data.countryCode,
          region: data.regionName,
          city: data.city,
          timezone: data.timezone,
          latitude: data.lat,
          longitude: data.lon
        };

        // 缓存结果
        this.cache.set(cacheKey, {
          data: locationData,
          timestamp: Date.now()
        });

        return locationData;
      } catch (fallbackError) {
        console.warn('Failed to get location from ip-api:', fallbackError);
        return null;
      }
    }
  }

  // 根据地理位置推荐语言
  getRecommendedLanguage(locationData) {
    if (!locationData) {
      console.log('No location data available, using default language: zh-TW');
      return 'zh-TW'; // 默认繁体中文
    }

    const { country, countryCode, region } = locationData;
    console.log('Location data:', { country, countryCode, region });

    // 中国大陆
    if (countryCode === 'CN' || country === 'China') {
      console.log('Detected China, recommending zh-CN');
      return 'zh-CN';
    }

    // 台湾
    if (countryCode === 'TW' || country === 'Taiwan') {
      return 'zh-TW';
    }

    // 香港
    if (countryCode === 'HK' || country === 'Hong Kong') {
      return 'zh-TW';
    }

    // 澳门
    if (countryCode === 'MO' || country === 'Macao') {
      return 'zh-TW';
    }

    // 新加坡（华人较多，使用繁体中文）
    if (countryCode === 'SG' || country === 'Singapore') {
      return 'zh-TW';
    }

    // 马来西亚（华人较多，使用繁体中文）
    if (countryCode === 'MY' || country === 'Malaysia') {
      return 'zh-TW';
    }

    // 其他地区默认英文
    return 'en';
  }

  // 检测并推荐语言
  async detectAndRecommendLanguage() {
    try {
      console.log('Starting language detection...');
      const ip = await this.getUserIP();
      console.log('User IP:', ip);
      
      if (!ip) {
        console.log('No IP available, using default language: zh-TW');
        return 'zh-TW'; // 默认繁体中文
      }

      const location = await this.getLocationByIP(ip);
      console.log('Location data:', location);
      
      const recommendedLanguage = this.getRecommendedLanguage(location);
      console.log('Recommended language:', recommendedLanguage);
      
      return recommendedLanguage;
    } catch (error) {
      console.warn('Failed to detect language:', error);
      return 'zh-TW'; // 默认繁体中文
    }
  }

  // 清除缓存
  clearCache() {
    this.cache.clear();
  }
}

// 创建单例实例
const geoLocationService = new GeoLocationService();

export default geoLocationService;
