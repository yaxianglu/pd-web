import { API_BASE_URL } from '../contants';
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // 获取请求头
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // 处理响应
  async handleResponse(response) {
    if (response.status === 401) {
      // Token过期，尝试刷新
      const refreshSuccess = await this.refreshToken();
      if (!refreshSuccess) {
        // 刷新失败，清除登录状态
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_info');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userType');
        
        // 重定向到登录页
        window.location.href = '/login';
        throw new Error('認證失敗，請重新登入');
      }
      
      // 刷新成功，重新发送原请求
      const newToken = localStorage.getItem('auth_token');
      const newHeaders = this.getHeaders();
      newHeaders['Authorization'] = `Bearer ${newToken}`;
      
      // 这里需要重新发送原请求，但为了简化，我们抛出错误让调用方处理
      throw new Error('請重新嘗試請求');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // 刷新token
  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      return false;
    }

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('auth_token', data.data.token);
        localStorage.setItem('refresh_token', data.data.refresh_token);
        localStorage.setItem('user_info', JSON.stringify(data.data.user));
        return true;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
    }

    return false;
  }

  // GET请求
  async get(endpoint, includeAuth = true) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(includeAuth),
    });

    return this.handleResponse(response);
  }

  // POST请求
  async post(endpoint, data, includeAuth = true) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(includeAuth),
      body: JSON.stringify(data),
    });

    return this.handleResponse(response);
  }

  // PUT请求
  async put(endpoint, data, includeAuth = true) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(includeAuth),
      body: JSON.stringify(data),
    });

    return this.handleResponse(response);
  }

  // DELETE请求
  async delete(endpoint, includeAuth = true) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(includeAuth),
    });

    return this.handleResponse(response);
  }

  // 文件上传
  async upload(endpoint, formData, includeAuth = true) {
    const headers = {};
    
    if (includeAuth) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    return this.handleResponse(response);
  }

  // 获取合作伙伴列表
  async getPartners() {
    try {
      const response = await fetch(`${this.baseURL}/api/partners`, {
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

  // 验证患者UUID
  async validatePatientUuid(uuid) {
    try {
      const response = await fetch(`${this.baseURL}/api/smile-test/validate-uuid/${uuid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to validate UUID:', error);
      return { success: false, message: '验证失败，请检查网络连接' };
    }
  }

  // 根据UUID获取smile test数据
  async getSmileTestByUuid(uuid) {
    try {
      const response = await fetch(`${this.baseURL}/api/smile-test/uuid/${uuid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to get smile test data:', error);
      return { success: false, message: '获取数据失败，请检查网络连接' };
    }
  }
}

// 创建单例实例
const apiService = new ApiService();

export default apiService; 