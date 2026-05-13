import {
  SMILE_TEST_PAGE_SIZE,
  createSmileTestFilters,
  getSmileTestSummaryText,
  mergeSmileTestFilters,
  getSmileTestPagination,
} from './smile-test-list';

describe('smile-test-list utils', () => {
  it('creates default filters with fixed first page and page size', () => {
    expect(createSmileTestFilters()).toEqual({
      status: '',
      date_from: '',
      date_to: '',
      account_keyword: '',
      bound_state: 'unbound',
      page: 1,
      page_size: SMILE_TEST_PAGE_SIZE,
    });
  });

  it('resets page to 1 when merging filter changes', () => {
    expect(mergeSmileTestFilters({
      ...createSmileTestFilters(),
      page: 3,
      account_keyword: 'old',
    }, {
      account_keyword: 'new',
    })).toEqual({
      status: '',
      date_from: '',
      date_to: '',
      account_keyword: 'new',
      bound_state: 'unbound',
      page: 1,
      page_size: SMILE_TEST_PAGE_SIZE,
    });
  });

  it('reads pagination metadata from api responses', () => {
    expect(getSmileTestPagination({
      data: [{ uuid: '1' }],
      pagination: {
        page: 2,
        page_size: 50,
        total: 107,
        total_pages: 3,
      },
    })).toEqual({
      page: 2,
      page_size: 50,
      total: 107,
      total_pages: 3,
    });
  });

  it('falls back to response length when pagination metadata is missing', () => {
    expect(getSmileTestPagination({
      data: [{ uuid: '1' }, { uuid: '2' }],
    })).toEqual({
      page: 1,
      page_size: SMILE_TEST_PAGE_SIZE,
      total: 2,
      total_pages: 1,
    });
  });

  it('formats total summary text from pagination data', () => {
    expect(getSmileTestSummaryText({ total: 107 }, (key, vars) => `${key}:${vars.total}`)).toBe(
      'admin.pagination.total:107',
    );
  });
});
