export const SMILE_TEST_PAGE_SIZE = 50;

export function createSmileTestFilters() {
  return {
    status: '',
    date_from: '',
    date_to: '',
    account_keyword: '',
    bound_state: 'unbound',
    sort_by: 'created_at',
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
  const hasTotal = Number.isFinite(Number(response?.pagination?.total));
  const page = Number(response?.pagination?.page) || fallbackPage || 1;
  const pageSize = Number(response?.pagination?.page_size) || SMILE_TEST_PAGE_SIZE;
  const total = hasTotal
    ? Number(response?.pagination?.total)
    : Array.isArray(response?.data) ? response.data.length : 0;
  const totalPages = Number(response?.pagination?.total_pages) || Math.max(1, Math.ceil(total / pageSize));

  return {
    page,
    page_size: pageSize,
    total,
    total_pages: totalPages,
    has_total: hasTotal,
  };
}

export function getSmileTestSummaryText(pagination, t) {
  if (!pagination?.has_total) {
    return t('admin.pagination.currentPageCount', { count: Number(pagination?.total) || 0 });
  }

  return t('admin.pagination.total', { total: Number(pagination?.total) || 0 });
}

export function getSmileTestSortOptions(t) {
  return [
    { value: 'created_at', label: t('admin.table.sortCreatedAtDesc') },
    { value: 'image_upload_time', label: t('admin.table.sortImageUploadTimeDesc') },
    { value: 'updated_at', label: t('admin.table.sortUpdatedAtDesc') },
  ];
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

export function formatSmileTestDateTime(value) {
  return value ? new Date(value).toLocaleString('zh-TW') : '—';
}
