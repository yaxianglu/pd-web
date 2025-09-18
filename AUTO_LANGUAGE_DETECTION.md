# 自动语言检测功能

## 功能概述

该功能可以根据用户的IP地址自动检测其所在地区，并推荐相应的语言设置。只有在用户第一次访问时才会自动切换，如果用户已经手动设置过语言，则不会自动切换。

## 支持的语言和地区映射

- **简体中文 (zh-CN)**: 中国大陆
- **繁体中文 (zh-TW)**: 台湾、香港、澳门、新加坡、马来西亚
- **英文 (en)**: 其他地区

## 实现原理

1. **IP获取**: 使用 `ipify.org` 和 `ipapi.co` 作为备用服务获取用户IP
2. **地理位置检测**: 使用 `ipapi.co` 和 `ip-api.com` 作为备用服务获取地理位置信息
3. **语言推荐**: 根据国家代码和地区信息推荐相应语言
4. **用户偏好记忆**: 使用 `localStorage` 记录用户是否手动设置过语言

## 使用方法

### 1. 在组件中使用语言上下文

```jsx
import { useLanguage } from '../context/LanguageContext';

function MyComponent() {
  const { 
    currentLanguage, 
    changeLanguage, 
    isAutoDetecting,
    t 
  } = useLanguage();

  return (
    <div>
      <p>当前语言: {currentLanguage}</p>
      <p>自动检测状态: {isAutoDetecting ? '检测中...' : '未检测'}</p>
      <button onClick={() => changeLanguage('zh-CN')}>
        切换到简体中文
      </button>
    </div>
  );
}
```

### 2. 使用语言选择器组件

```jsx
import LanguageSelector from '../components/LanguageSelector';

function Header() {
  return (
    <div>
      <h1>我的应用</h1>
      <LanguageSelector />
    </div>
  );
}
```

### 3. 测试自动检测功能

```jsx
import LanguageAutoDetectTest from '../components/LanguageAutoDetectTest';

function TestPage() {
  return (
    <div>
      <h1>语言检测测试</h1>
      <LanguageAutoDetectTest />
    </div>
  );
}
```

## 配置说明

### 缓存设置

- IP地理位置信息会缓存24小时
- 用户语言设置会永久保存到 `localStorage`

### 存储键值

- `preferred-language`: 保存用户选择的语言
- `user-set-language`: 标记用户是否手动设置过语言

### 错误处理

- 如果IP获取失败，使用默认语言（繁体中文）
- 如果地理位置检测失败，使用默认语言（繁体中文）
- 所有错误都会在控制台输出警告信息

## 自定义配置

### 修改地区映射

在 `src/services/geoLocationService.js` 中的 `getRecommendedLanguage` 方法中修改：

```javascript
// 添加新的地区映射
if (countryCode === 'JP' || country === 'Japan') {
  return 'ja'; // 需要先在 LanguageContext 中添加日语支持
}
```

### 添加新语言

1. 在 `src/locales/` 目录下创建新的语言文件
2. 在 `src/context/LanguageContext.js` 中导入并添加到 `languages` 对象
3. 在 `geoLocationService.js` 中添加相应的地区映射

## 注意事项

1. **隐私考虑**: 该功能会获取用户的IP地址和地理位置信息
2. **网络依赖**: 需要网络连接才能进行自动检测
3. **性能影响**: 首次访问时会有轻微的延迟（通常1-2秒）
4. **浏览器兼容性**: 需要支持 `fetch` API 的现代浏览器

## 故障排除

### 自动检测不工作

1. 检查网络连接
2. 检查浏览器控制台是否有错误信息
3. 确认用户没有手动设置过语言（检查 `localStorage`）

### 语言推荐不准确

1. 检查IP地理位置服务是否正常工作
2. 考虑添加更精确的地区映射规则
3. 可以添加用户反馈机制来改进推荐算法
