describe('API_BASE_URL', () => {
  const originalApiUrl = process.env.REACT_APP_API_URL;

  afterEach(() => {
    if (originalApiUrl === undefined) {
      delete process.env.REACT_APP_API_URL;
    } else {
      process.env.REACT_APP_API_URL = originalApiUrl;
    }

    jest.resetModules();
  });

  test('defaults to same-origin when no production API url is configured', () => {
    delete process.env.REACT_APP_API_URL;

    jest.isolateModules(() => {
      const { API_BASE_URL } = require('./index');
      expect(API_BASE_URL).toBe('');
    });
  });
});
