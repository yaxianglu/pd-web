export const SMILE_TEST_PAGE_SIZE = 50;

export function createSmileTestFilters() {
  return {
    status: '',
    date_from: '',
    date_to: '',
    account_keyword: '',
    bound_state: 'unbound',
    page: 1,
    page_size: SMILE_TEST_PAGE_SIZE,
  };
}

export function mergeSmileTestFilters(currentFilters, patch) {
  return {
    ...currentFilters,
    ...patch,
    page: 1,
    page_size: SMILE_TEST_PAGE_SIZE,
  };
}

export function getSmileTestPagination(response, fallbackPage = 1) {
  const page = Number(response?.pagination?.page) || fallbackPage || 1;
  const pageSize = Number(response?.pagination?.page_size) || SMILE_TEST_PAGE_SIZE;
  const total = Number.isFinite(Number(response?.pagination?.total))
    ? Number(response?.pagination?.total)
    : Array.isArray(response?.data) ? response.data.length : 0;
  const totalPages = Number(response?.pagination?.total_pages) || Math.max(1, Math.ceil(total / pageSize));

  return {
    page,
    page_size: pageSize,
    total,
    total_pages: totalPages,
  };
}

export function getSmileTestSummaryText(pagination, t) {
  return t('admin.pagination.total', { total: Number(pagination?.total) || 0 });
}

export function getSmileTestStatusOptions(t) {
  return [
    { value: 'pending', label: t('admin.table.statusPending') },
    { value: 'in_progress', label: t('admin.table.statusInProgress') },
    { value: 'completed', label: t('admin.table.statusCompleted') },
    { value: 'cancelled', label: t('admin.table.statusCancelled') },
  ];
}

export function getSmileTestBindOptions(t) {
  return [
    { value: 'unbound', label: t('admin.table.unbound') },
    { value: 'bound', label: t('admin.table.bound') },
  ];
}
