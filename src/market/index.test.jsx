import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import MarketDashboard from './index';
import apiService from '../services/api';

jest.mock('../components/logout', () => () => <div>logout</div>);
jest.mock('../partners', () => () => <div>partners</div>);
jest.mock('../clinic', () => () => <div>clinic</div>);
jest.mock('../components/history-modal', () => () => null);
jest.mock('../context/LanguageContext', () => ({
  useLanguage: () => ({
    t: (key, params = {}) => {
      if (key === 'admin.pagination.total') {
        return `共 ${params.total || 0} 条记录`;
      }

      return key;
    },
  }),
}));
jest.mock('../components/smile-test-table', () => ({ loading }) => (
  <div data-testid="smile-table-loading">{String(loading)}</div>
));
jest.mock('../services/api', () => ({
  __esModule: true,
  default: {
    getAllSmileTests: jest.fn(),
    getDoctorsWithClinic: jest.fn(),
    updateSmileTestBio: jest.fn(),
    getSmileTestByUuid: jest.fn(),
    bindExistingSmileTest: jest.fn(),
  },
}));

function createDeferred() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

describe('MarketDashboard', () => {
  beforeAll(() => {
    window.matchMedia = window.matchMedia || function matchMedia() {
      return {
        matches: false,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      };
    };

    global.ResizeObserver = global.ResizeObserver || class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
    apiService.getDoctorsWithClinic.mockResolvedValue({ success: false, data: [] });
  });

  it('passes loading=true to the smile test table while requests are in flight', async () => {
    const deferred = createDeferred();
    apiService.getAllSmileTests.mockReturnValue(deferred.promise);

    render(<MarketDashboard />);

    expect(screen.getByTestId('smile-table-loading')).toHaveTextContent('true');

    deferred.resolve({
      success: true,
      data: [],
      pagination: {
        page: 1,
        page_size: 50,
        total: 0,
        total_pages: 1,
      },
    });

    await waitFor(() => {
      expect(screen.getByTestId('smile-table-loading')).toHaveTextContent('false');
    });
  });
});
