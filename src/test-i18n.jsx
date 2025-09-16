import React from 'react';
import { useLanguage } from './context/LanguageContext';

const TestI18n = () => {
  const { t, currentLanguage, changeLanguage, getAvailableLanguages } = useLanguage();
  const availableLanguages = getAvailableLanguages();

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>多语言测试页面</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>当前语言: {currentLanguage}</h2>
        <div>
          <label>切换语言: </label>
          <select 
            value={currentLanguage} 
            onChange={(e) => changeLanguage(e.target.value)}
            style={{ padding: '5px', marginLeft: '10px' }}
          >
            {availableLanguages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>翻译测试:</h3>
        <ul>
          <li>品牌名称: {t('brand.pearlDigital')}</li>
          <li>标语: {t('brand.tagline')}</li>
          <li>登录: {t('common.login')}</li>
          <li>导航 - 隐形牙套: {t('navigation.invisibleBraces')}</li>
          <li>导航 - 维持器: {t('navigation.maintainer')}</li>
          <li>导航 - 珍舒美旅程: {t('navigation.journey')}</li>
          <li>导航 - 矫正与美: {t('navigation.correction')}</li>
          <li>导航 - 关于我们: {t('navigation.about')}</li>
          <li>导航 - 合作伙伴: {t('navigation.partners')}</li>
          <li>导航 - 微笑测试: {t('navigation.smileTest')}</li>
          <li>产品 - 隐形牙套: {t('products.invisibleBraces')}</li>
          <li>产品 - 维持器: {t('products.maintainer')}</li>
          <li>服务 - 珍舒美旅程: {t('services.journey')}</li>
          <li>服务 - 矫正与美: {t('services.correction')}</li>
          <li>服务 - 笑容升级: {t('services.smileUpgrade')}</li>
          <li>页脚 - 产品: {t('footer.products')}</li>
          <li>页脚 - 服务: {t('footer.services')}</li>
          <li>页脚 - 关于: {t('footer.about')}</li>
          <li>页脚 - 隐私条款: {t('footer.privacyPolicy')}</li>
          <li>页脚 - 网站使用条款: {t('footer.termsOfService')}</li>
          <li>页脚 - Cookie设置: {t('footer.cookieSettings')}</li>
        </ul>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>首页内容测试:</h3>
        <p><strong>标题:</strong> {t('home.title')} {t('home.subtitle')}</p>
        <p><strong>副标题:</strong> {t('brand.tagline')}</p>
        <p><strong>按钮1:</strong> {t('home.button1')}</p>
        <p><strong>按钮2:</strong> {t('home.button2')}</p>
        <p><strong>描述1:</strong> {t('home.description')}</p>
        <p><strong>描述2:</strong> {t('home.description2')}</p>
        <p><strong>Sketch标题:</strong> {t('home.sketchTitle')}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>参数替换测试:</h3>
        <p>最小长度: {t('form.minLength', { min: 8 })}</p>
        <p>最大长度: {t('form.maxLength', { max: 50 })}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>关于页面翻译测试:</h3>
        <ul>
          <li>公司介绍: {t('about.companyIntro')}</li>
          <li>公司描述: {t('about.companyDescription')}</li>
          <li>Dr. David Shen: {t('about.drDavidShen')}</li>
          <li>创新理念标题: {t('about.innovationTitle')}</li>
          <li>创新理念描述: {t('about.innovationDescription')}</li>
          <li>为什么选择标题: {t('about.whyChooseTitle')}</li>
          <li>医疗级软件: {t('about.medicalSoftware')}</li>
          <li>品质稳定标题: {t('about.qualityTitle')}</li>
          <li>医疗级材料标题: {t('about.materialTitle')}</li>
          <li>页面标题: {t('about.pageTitle')}</li>
          <li>页面副标题: {t('about.pageSubtitle')}</li>
          <li>成为合作伙伴: {t('about.becomePartner')}</li>
          <li>精准控制: {t('about.preciseControl')}</li>
          <li>公司使命: {t('about.companyMission')}</li>
          <li>描述文本: {t('about.descriptionText')}</li>
        </ul>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>隐形牙套页面翻译测试:</h3>
        <ul>
          <li>页面标题: {t('invisibleBraces.title')}</li>
          <li>页面副标题: {t('invisibleBraces.subtitle')}</li>
          <li>为什么选择标题: {t('invisibleBraces.whyChooseTitle')}</li>
          <li>美国品牌特色: {t('invisibleBraces.features.usBrand.title')}</li>
          <li>科技辅助特色: {t('invisibleBraces.features.techAssisted.title')}</li>
          <li>高透明度特色: {t('invisibleBraces.features.highTransparency.title')}</li>
          <li>制造工艺标题: {t('invisibleBraces.manufacturing.title')}</li>
          <li>方案选择标题: {t('invisibleBraces.planSelection.title')}</li>
          <li>品牌比较标题: {t('invisibleBraces.brandCompare.title')}</li>
        </ul>
      </div>
    </div>
  );
};

export default TestI18n;
