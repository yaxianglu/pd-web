const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://54.161.135.238:3001';
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const smileTestApi = {
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

  // 创建微笑测试数据
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

  // 保存或更新数据（通过UUID，如果存在则更新，不存在则创建）
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