export async function ensureSmileTestRecord(uuid, api) {
  if (!uuid) {
    return { success: false, initialized: false, record: null };
  }

  try {
    const lookupResult = await api.getSmileTestByUuid(uuid);
    if (lookupResult?.success && lookupResult?.data) {
      return {
        success: true,
        initialized: false,
        record: lookupResult.data,
      };
    }
  } catch (error) {
    // Fall through to initialization so direct step-4 links can recover.
  }

  const initResult = await api.saveOrUpdateSmileTestByUuid(uuid, {
    test_status: 'in_progress',
  });

  if (!initResult?.success) {
    throw new Error(initResult?.message || 'Failed to initialize smile test record');
  }

  return {
    success: true,
    initialized: true,
    record: initResult.data || null,
  };
}
