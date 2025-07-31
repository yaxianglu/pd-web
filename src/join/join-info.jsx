import React, { useState } from 'react';
import { useResponsive } from '../components/responsive-hook';
import './join-info.scss';
import DetailButton from '../components/detail-button';
import { apiService } from '../services/api';
import { message } from 'antd';
import 'antd/dist/reset.css';

export default function JoinInfo() {
  const { isMobile, isTablet } = useResponsive();
  
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    clinicName: '',
    experienceYears: '',
    treatmentCount: '',
    address: '',
    remarks: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 清除该字段的错误
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const fieldErrors = {};
    const generalErrors = [];
    
    // 检查必填字段
    if (!formData.fullName.trim()) {
      fieldErrors.fullName = '請填寫全名';
    }
    
    if (!formData.phoneNumber.trim()) {
      fieldErrors.phoneNumber = '請填寫電話號碼';
    } else {
      // 台湾手机号和座机号验证
      const phoneNumber = formData.phoneNumber.trim();
      
      // 手机号：09 + 8位数字
      const mobileRegex = /^09[0-9]{8}$/;
      // 座机号：0 + 区域码(2-8) + 7-8位数字
      const landlineRegex = /^0[2-8][0-9]{7,8}$/;
      // 国际格式：+886/886 + 9位数字（去掉0）
      const internationalRegex = /^(\+886|886)9[0-9]{8}$/;
      
      if (!mobileRegex.test(phoneNumber) && !landlineRegex.test(phoneNumber) && !internationalRegex.test(phoneNumber)) {
        fieldErrors.phoneNumber = '請填寫正確的台灣電話號碼格式';
      }
    }
    
    if (!formData.email.trim()) {
      fieldErrors.email = '請填寫電子郵箱';
    } else {
      // 简单的邮箱格式验证
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        fieldErrors.email = '請填寫正確的電子郵箱格式';
      }
    }
    
    if (!formData.clinicName.trim()) {
      fieldErrors.clinicName = '請填寫牙科診所的名稱';
    }
    
    if (!formData.experienceYears.trim()) {
      fieldErrors.experienceYears = '請填寫牙醫經驗年數';
    } else {
      // 检查是否为有效数字
      const years = parseInt(formData.experienceYears);
      if (isNaN(years) || years < 0) {
        fieldErrors.experienceYears = '請填寫有效的牙醫經驗年數';
      }
    }
    
    if (!formData.treatmentCount.trim()) {
      fieldErrors.treatmentCount = '請填寫牙科治療的數量';
    } else {
      // 检查是否为有效数字
      const count = parseInt(formData.treatmentCount);
      if (isNaN(count) || count < 0) {
        fieldErrors.treatmentCount = '請填寫有效的牙科治療數量';
      }
    }
    
    if (!formData.address.trim()) {
      fieldErrors.address = '請填寫地址';
    }
    
    // 设置字段错误
    setErrors(fieldErrors);
    
    // 返回是否有任何错误
    return Object.keys(fieldErrors).length > 0;
  };

  const handleSubmit = async (e) => {
    // 如果有事件对象，阻止默认行为
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    // 表单验证
    const hasErrors = validateForm();
    console.log('验证错误:', errors);
    if (hasErrors) {
      return;
    }
    
    setIsSubmitting(true);

    try {
      // 转换表单数据为后端期望的格式
      const dentistData = {
        full_name: formData.fullName.trim(),
        phone: formData.phoneNumber.trim(),
        email: formData.email.trim(),
        clinic_name: formData.clinicName.trim(),
        years_experience: parseInt(formData.experienceYears),
        treatment_count: parseInt(formData.treatmentCount),
        address: formData.address.trim(),
        special_notes: formData.remarks.trim(),
        status: 'pending' // 设置初始状态为待审核
      };

      console.log('提交数据:', dentistData);
      
      const result = await apiService.submitDentistInfo(dentistData);
      
      if (result.success) {
        // 清空表单
        setFormData({
          fullName: '',
          phoneNumber: '',
          email: '',
          clinicName: '',
          experienceYears: '',
          treatmentCount: '',
          address: '',
          remarks: ''
        });
        message.success('提交成功！我们会尽快与您联系。');
      } else {
        message.error('提交失败：' + (result.message || '未知错误'));
      }
    } catch (error) {
      console.error('提交失败:', error);
      message.error('提交失败：网络错误，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="join-info-section" id="join-info">
      <div className="join-info-container">
        <div className="join-info-title">
          <span>成為珍舒美的合作夥伴</span>
        </div>
        
        <form className="join-info-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-label">全名</label>
            <input
              type="text"
              className={`form-input ${errors.fullName ? 'error' : ''}`}
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              required
            />
            {errors.fullName && <div className="error-message">{errors.fullName}</div>}
          </div>

          <div className="form-field">
            <label className="form-label">電話號碼</label>
            <input
              type="tel"
              className={`form-input ${errors.phoneNumber ? 'error' : ''}`}
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              required
            />
            {errors.phoneNumber && <div className="error-message">{errors.phoneNumber}</div>}
          </div>

          <div className="form-field">
            <label className="form-label">電子郵箱</label>
            <input
              type="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>

          <div className="form-field">
            <label className="form-label">牙科診所的名稱</label>
            <input
              type="text"
              className={`form-input ${errors.clinicName ? 'error' : ''}`}
              value={formData.clinicName}
              onChange={(e) => handleInputChange('clinicName', e.target.value)}
              required
            />
            {errors.clinicName && <div className="error-message">{errors.clinicName}</div>}
          </div>

          <div className="form-field">
            <label className="form-label">幾年的牙醫經驗</label>
            <input
              type="number"
              className={`form-input ${errors.experienceYears ? 'error' : ''}`}
              value={formData.experienceYears}
              onChange={(e) => handleInputChange('experienceYears', e.target.value)}
              required
            />
            {errors.experienceYears && <div className="error-message">{errors.experienceYears}</div>}
          </div>

          <div className="form-field">
            <label className="form-label">牙科治療的數量</label>
            <input
              type="number"
              className={`form-input ${errors.treatmentCount ? 'error' : ''}`}
              value={formData.treatmentCount}
              onChange={(e) => handleInputChange('treatmentCount', e.target.value)}
              required
            />
            {errors.treatmentCount && <div className="error-message">{errors.treatmentCount}</div>}
          </div>

          <div className="form-field">
            <label className="form-label">您的地址</label>
            <input
              type="text"
              className={`form-input ${errors.address ? 'error' : ''}`}
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              required
            />
            {errors.address && <div className="error-message">{errors.address}</div>}
          </div>

          <div className="form-field">
            <label className="form-label">有什麼特別備註的嗎?</label>
            <textarea
              className="form-textarea"
              value={formData.remarks}
              onChange={(e) => handleInputChange('remarks', e.target.value)}
              rows="4"
            />
          </div>

          <div className="form-submit">
            <DetailButton 
              text={isSubmitting ? "提交中..." : "提交"} 
              size="small" 
              disabled={isSubmitting}
              onClick={handleSubmit}
            />
          </div>
        </form>
      </div>
    </div>
  );
}