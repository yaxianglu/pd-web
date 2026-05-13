import zhTW from './zh-TW';
import zhCN from './zh-CN';
import en from './en';

describe('home page locale copy', () => {
  test('uses the updated learn more heading across locales', () => {
    expect(zhTW.home.learnMore).toBe('想要了解');
    expect(zhCN.home.learnMore).toBe('想要了解');
    expect(en.home.learnMore).toBe('Want to learn more');
  });
});
