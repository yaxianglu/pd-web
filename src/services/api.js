const API_BASE_URL = 'http://18.232.58.243:3001/api';
// const API_BASE_URL = 'http://localhost:3001/api';
// const API_BASE_URL = 'http://172.31.44.33:3001/api';

export const apiService = {
  // 健康检查
  async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'error', message: 'Service unavailable' };
    }
  },

  // 获取FAQ数据
  async getFaqData() {
    try {
      const response = await fetch(`${API_BASE_URL}/faq`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch FAQ data:', error);
      return { success: false, message: 'Failed to fetch FAQ data' };
    }
  },

  // 提交用户信息
  async submitUserInfo(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/user-info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to submit user info:', error);
      return { success: false, message: 'Failed to submit user info' };
    }
  },

  // 提交牙医信息
  async submitDentistInfo(dentistData) {
    try {
      const response = await fetch(`${API_BASE_URL}/dentist-info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dentistData),
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to submit dentist info:', error);
      return { success: false, message: 'Failed to submit dentist info' };
    }
  },

  // 获取合作夥伴列表
  async getPartners() {
    try {
      const response = await fetch(`${API_BASE_URL}/partners`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch partners:', error);
      return { success: false, message: 'Failed to fetch partners' };
    }
  }
}; 