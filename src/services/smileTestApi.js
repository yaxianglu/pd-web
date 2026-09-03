import { API_BASE_URL } from '../contants';

export const smileTestApi = {
  // 验证微笑测试 UUID 是否可继续使用
  async validateSmileTestUuid(uuid) {
    // 加超时：请求卡住时快速失败，避免上传页永久停留在“载入中”
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(`${API_BASE_URL}/api/smile-test/validate-uuid/${uuid}`, { signal: controller.signal });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Failed to validate smile test UUID:', error);
      throw error;
    } finally {
      clearTimeout(timer);
    }
  },

  // 通过UUID获取微笑测试数据
  async getSmileTestByUuid(uuid) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/smile-test/uuid/${uuid}`);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Failed to fetch smile test data by UUID:', error);
      throw error;
    }
  },

  // 通过Test ID获取微笑测试数据
  async getSmileTestByTestId(testId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/smile-test/test-id/${testId}`);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Failed to fetch smile test data by Test ID:', error);
      throw error;
    }
  },

  // 創建微笑测试数据
  async createSmileTest(data) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/smile-test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Failed to create smile test data:', error);
      throw error;
    }
  },

  // 通过UUID更新微笑测试数据
  async updateSmileTestByUuid(uuid, data) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/smile-test/uuid/${uuid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Failed to update smile test data by UUID:', error);
      throw error;
    }
  },

  // 通过Test ID更新微笑测试数据
  async updateSmileTestByTestId(testId, data) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/smile-test/test-id/${testId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Failed to update smile test data by Test ID:', error);
      throw error;
    }
  },

  // 通过UUID删除微笑测试数据
  async deleteSmileTestByUuid(uuid) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/smile-test/uuid/${uuid}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Failed to delete smile test data by UUID:', error);
      throw error;
    }
  },

  // 通过Test ID删除微笑测试数据
  async deleteSmileTestByTestId(testId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/smile-test/test-id/${testId}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Failed to delete smile test data by Test ID:', error);
      throw error;
    }
  },

  // 刷新上传会话活动时间（切 tab 心跳）
  async touchSmileTestUuid(uuid) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/smile-test/uuid/${uuid}/touch`, {
        method: 'POST',
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to touch smile test UUID:', error);
      return { success: false, error_code: 'network_error' };
    }
  },

  // 保存或更新数据（通过UUID，如果存在则更新，不存在则創建）
  async saveOrUpdateSmileTestByUuid(uuid, data) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/smile-test/uuid/${uuid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Failed to save or update smile test data by UUID:', error);
      throw error;
    }
  }
}; 
