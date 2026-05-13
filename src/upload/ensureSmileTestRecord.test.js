import { ensureSmileTestRecord } from './ensureSmileTestRecord';

describe('ensureSmileTestRecord', () => {
  test('creates a smile test record when none exists', async () => {
    const api = {
      getSmileTestByUuid: jest.fn().mockResolvedValue({ success: false, data: null }),
      saveOrUpdateSmileTestByUuid: jest.fn().mockResolvedValue({ success: true, data: { uuid: 'abc' } }),
    };

    const result = await ensureSmileTestRecord('abc', api);

    expect(api.getSmileTestByUuid).toHaveBeenCalledWith('abc');
    expect(api.saveOrUpdateSmileTestByUuid).toHaveBeenCalledWith('abc', { test_status: 'in_progress' });
    expect(result).toEqual({ success: true, initialized: true, record: { uuid: 'abc' } });
  });

  test('does not create a record when one already exists', async () => {
    const api = {
      getSmileTestByUuid: jest.fn().mockResolvedValue({ success: true, data: { smileTest: { uuid: 'abc' } } }),
      saveOrUpdateSmileTestByUuid: jest.fn(),
    };

    const result = await ensureSmileTestRecord('abc', api);

    expect(api.getSmileTestByUuid).toHaveBeenCalledWith('abc');
    expect(api.saveOrUpdateSmileTestByUuid).not.toHaveBeenCalled();
    expect(result).toEqual({ success: true, initialized: false, record: { smileTest: { uuid: 'abc' } } });
  });

  test('creates a record when the lookup request throws', async () => {
    const api = {
      getSmileTestByUuid: jest.fn().mockRejectedValue(new Error('network down')),
      saveOrUpdateSmileTestByUuid: jest.fn().mockResolvedValue({ success: true, data: { uuid: 'abc' } }),
    };

    const result = await ensureSmileTestRecord('abc', api);

    expect(api.saveOrUpdateSmileTestByUuid).toHaveBeenCalledWith('abc', { test_status: 'in_progress' });
    expect(result).toEqual({ success: true, initialized: true, record: { uuid: 'abc' } });
  });
});
