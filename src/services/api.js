import { API_BASE_URL } from '../contants';
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // 审批合作伙伴申请：创建診所并激活
  async approvePartner(id) {
    const response = await fetch(`${this.baseURL}/api/partners/${id}/approve`, {
      method: 'POST',
      headers: this.getHeaders(true),
    });
    return this.handleResponse(response);
  }

  // 拒絕合作夥伴申請
  async rejectPartner(id) {
    const response = await fetch(`${this.baseURL}/api/partners/${id}/reject`, {
      method: 'POST',
      headers: this.getHeaders(true),
    });
    return this.handleResponse(response);
  }

  // 下載微笑測試 4 張照片的ZIP
  async downloadSmilePhotosZip(uuid) {
    const response = await fetch(`${this.baseURL}/api/smile-test/uuid/${uuid}/photos.zip`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });
    if (response.ok) {
      const blob = await response.blob();
      return blob;
    }
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.message || '下載失敗');
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

  // 更新 smile_test 的備註(bio)
  async updateSmileTestBio(uuid, bio) {
    try {
      const response = await fetch(`${this.baseURL}/api/smile-test/uuid/${uuid}/bio`, {
        method: 'PUT',
        headers: this.getHeaders(true),
        body: JSON.stringify({ bio }),
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to update smile test bio:', error);
      return { success: false, message: '更新失敗' };
    }
  }

  // 獲取所有微笑測試（僅未刪除）
  async getAllSmileTests() {
    try {
      const response = await fetch(`${this.baseURL}/api/smile-test`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to get all smile tests:', error);
      return { success: false, message: '获取数据失败，请检查网络连接' };
    }
  }

  // 根据医生信息获取患者列表（与 uuid 接口结构一致的数组）
  async getPatientsByDoctor({ uuid, email, username }) {
    const params = new URLSearchParams();
    if (uuid) params.append('uuid', uuid);
    if (!uuid && email) params.append('email', email);
    if (!uuid && !email && username) params.append('username', username);

    try {
      const response = await fetch(`${this.baseURL}/api/smile-test/by-doctor?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to get patients by doctor:', error);
      return { success: false, message: '获取数据失败，请检查网络连接' };
    }
  }

  // 同时创建患者与smile_test
  async createPatientWithSmileTest(data) {
    try {
      const response = await fetch(`${this.baseURL}/api/smile-test/with-patient`, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: JSON.stringify(data),
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to create patient with smile test:', error);
      return { success: false, message: '创建失败，请检查网络连接' };
    }
  }

  // 仅创建患者并把现有 smile_test 记录的 patient_uuid 指向它
  async bindExistingSmileTest({ smile_uuid, assigned_doctor_uuid }) {
    try {
      const response = await fetch(`${this.baseURL}/api/smile-test/bind-existing`, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: JSON.stringify({ smile_uuid, assigned_doctor_uuid }),
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to bind existing smile test:', error);
      return { success: false, message: '綁定失敗' };
    }
  }

  // 获取所有医生（去除敏感字段）
  async getDoctors() {
    try {
      const response = await fetch(`${this.baseURL}/auth/doctors`, {
        method: 'GET',
        headers: this.getHeaders(true),
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
      return { success: false, message: '獲取醫師列表失敗' };
    }
  }

  // 获取医生及其诊所信息
  async getDoctorsWithClinic() {
    try {
      const response = await fetch(`${this.baseURL}/auth/doctors-with-clinic`, {
        method: 'GET',
        headers: this.getHeaders(true),
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to fetch doctors with clinic:', error);
      return { success: false, message: '獲取醫師/診所列表失敗' };
    }
  }

  // 创建预约
  async createAppointment(data) {
    return this.post('/api/appointments', data, true);
  }

  // 按月份获取预约
  async getAppointmentsByMonth(year, month) {
    return this.get(`/api/appointments/by-month?year=${year}&month=${month}`, true);
  }

  // 获取诊所列表
  async getClinics() {
    try {
      const response = await fetch(`${this.baseURL}/auth/clinics`, {
        method: 'GET',
        headers: this.getHeaders(true),
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to fetch clinics:', error);
      return { success: false, message: '獲取診所列表失敗' };
    }
  }

  // 创建管理员账号（默认医生角色）
  async createAdminUser(data) {
    try {
      const response = await fetch(`${this.baseURL}/auth/users`, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: JSON.stringify(data),
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to create admin user:', error);
      return { success: false, message: '創建帳戶失敗' };
    }
  }
}

// 创建单例实例
const apiService = new ApiService();

export default apiService; 