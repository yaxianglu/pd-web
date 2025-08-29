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

  // 专门下载存储在 allergies 字段中的文件
  async downloadFileFromAllergies(uuid) {
    try {
      const response = await fetch(`${this.baseURL}/api/smile-test/uuid/${uuid}/download-file`, {
        method: 'GET',
        headers: this.getHeaders(true),
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to download file from allergies:', error);
      return { success: false, message: '下载文件失败，请检查网络连接' };
    }
  }

  // 下載微笑測試上傳文件的ZIP
  async downloadUploadedFilesZip(uuid) {
    const response = await fetch(`${this.baseURL}/api/smile-test/uuid/${uuid}/uploaded-files.zip`, {
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

  // 創建診所
  async createClinic(clinicData) {
    const response = await fetch(`${this.baseURL}/api/clinics`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(clinicData),
    });
    const data = await response.json();
    return data;
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
        headers: this.getHeaders(true), // 添加认证头
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

  // 更新预约
  async updateAppointment(idOrUuid, data) {
    const endpoint = isNaN(Number(idOrUuid))
      ? `/api/appointments/${encodeURIComponent(idOrUuid)}`
      : `/api/appointments/${Number(idOrUuid)}`;
    return this.put(endpoint, data, true);
  }

  // 取消预约
  async cancelAppointment(idOrUuid) {
    const endpoint = isNaN(Number(idOrUuid))
      ? `/api/appointments/${encodeURIComponent(idOrUuid)}/cancel`
      : `/api/appointments/${Number(idOrUuid)}/cancel`;
    return this.put(endpoint, {}, true);
  }

  // 更新患者治疗方案
  async updatePatientHobbies(uuid, hobbies) {
    return this.put(`/api/smile-test/patient/${encodeURIComponent(uuid)}/hobbies`, { hobbies }, true);
  }
  // 更新患者進度
  async updatePatientProgress(uuid, progress) {
    return this.put(`/api/smile-test/patient/${encodeURIComponent(uuid)}/progress`, { progress }, true);
  }

  // 按月份获取预约
  async getAppointmentsByMonth(year, month, patientUuid = null, doctorUuid = null) {
    let url = `/api/appointments/by-month?year=${year}&month=${month}`;
    if (patientUuid) {
      url += `&patient_uuid=${encodeURIComponent(patientUuid)}`;
    }
    if (doctorUuid) {
      url += `&doctor_uuid=${encodeURIComponent(doctorUuid)}`;
    }
    return this.get(url, true);
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

  // 修改密码
  async changePassword(data) {
    try {
      const response = await fetch(`${this.baseURL}/auth/change-password`, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: JSON.stringify(data),
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to change password:', error);
      return { success: false, message: '修改密碼失敗' };
    }
  }

  // ========== 账户管理功能 ==========

  // 获取所有用户（根据角色过滤）
  async getUsers(role = null) {
    try {
      const url = role ? `${this.baseURL}/auth/users?role=${encodeURIComponent(role)}` : `${this.baseURL}/auth/users`;
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(true),
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      return { success: false, message: '獲取用戶列表失敗' };
    }
  }

  // 获取所有患者
  async getPatients() {
    try {
      const response = await fetch(`${this.baseURL}/auth/patients`, {
        method: 'GET',
        headers: this.getHeaders(true),
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to fetch patients:', error);
      return { success: false, message: '獲取患者列表失敗' };
    }
  }

  // 创建诊所
  async createClinic(data) {
    try {
      const response = await fetch(`${this.baseURL}/auth/clinics`, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: JSON.stringify(data),
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to create clinic:', error);
      return { success: false, message: '創建診所失敗' };
    }
  }

  // 创建患者
  async createPatient(data) {
    try {
      const response = await fetch(`${this.baseURL}/auth/patients`, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: JSON.stringify(data),
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to create patient:', error);
      return { success: false, message: '創建患者失敗' };
    }
  }

  // 删除/关闭用户账户
  async deleteUser(id) {
    try {
      const response = await fetch(`${this.baseURL}/auth/users/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(true),
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to delete user:', error);
      return { success: false, message: '刪除用戶失敗' };
    }
  }

  // 删除/关闭诊所
  async deleteClinic(id) {
    try {
      const response = await fetch(`${this.baseURL}/auth/clinics/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(true),
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to delete clinic:', error);
      return { success: false, message: '關閉診所失敗' };
    }
  }

  // 删除/关闭患者
  async deletePatient(id) {
    try {
      const response = await fetch(`${this.baseURL}/auth/patients/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(true),
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to delete patient:', error);
      return { success: false, message: '關閉患者失敗' };
    }
  }



  // 获取微笑测试文件列表
  async getSmileTestFiles(smileTestUuid) {
    return this.get(`/api/smile-test-files/smile-test/${encodeURIComponent(smileTestUuid)}`, true);
  }

  // 下载文件
  async downloadFile(fileUuid) {
    try {
      const response = await fetch(`${this.baseURL}/api/smile-test-files/download/${encodeURIComponent(fileUuid)}`, {
        method: 'GET',
        headers: this.getHeaders(true),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      
      // 从响应头中解析文件名
      let filename = null;
      const contentDisposition = response.headers.get('content-disposition');
      console.log('🔍 API响应头调试:', {
        contentDisposition: contentDisposition,
        allHeaders: Object.fromEntries(response.headers.entries())
      });
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename\*=UTF-8''(.+)/);
        if (filenameMatch) {
          filename = decodeURIComponent(filenameMatch[1]);
          console.log('✅ 解析到文件名:', filename);
        } else {
          console.log('❌ 无法匹配文件名模式');
        }
      } else {
        console.log('❌ 没有Content-Disposition头');
      }
      
      console.log('📤 API返回结果:', { success: true, filename });
      return { success: true, data: blob, filename };
    } catch (error) {
      console.error('Download file failed:', error);
      return { success: false, message: error.message || '下載失敗' };
    }
  }

  // 删除文件
  async deleteFile(fileUuid) {
    return this.delete(`/api/smile-test-files/${encodeURIComponent(fileUuid)}`, true);
  }

  // 上传微笑测试图片
  async uploadSmileTestImage(smileTestUuid, imageIndex, fileData) {
    return this.post(`/api/smile-test-files/smile-test/${encodeURIComponent(smileTestUuid)}/image/${imageIndex}`, {
      image_data: fileData
    }, true);
  }

  // 上传微笑测试图片组
  async uploadSmileTestImageGroup(smileTestUuid, imageGroup) {
    return this.post(`/api/smile-test-files/smile-test/${encodeURIComponent(smileTestUuid)}/image-group`, {
      image_group: imageGroup
    }, true);
  }

  // 上传口扫文件
  async uploadOralScanFile(smileTestUuid, fileData, fileName) {
    return this.post(`/api/smile-test-files/smile-test/${encodeURIComponent(smileTestUuid)}/oral-scan`, {
      file_data: fileData,
      file_name: fileName
    }, true);
  }
}

// 创建单例实例
const apiService = new ApiService();

export default apiService; 