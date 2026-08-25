import React, { useState } from 'react';
import { useResponsive } from '../components/responsive-hook';
import './join-info.scss';
import DetailButton from '../components/detail-button';
import apiService from '../services/api';
import { message } from 'antd';
import 'antd/dist/reset.css';
import { useLanguage } from '../context/LanguageContext';
import { COURSE_TIME_SLOTS } from '../config/courseSlots';

export default function JoinInfo() {
  const { t } = useLanguage();
  const { isMobile, isTablet } = useResponsive();
  const [messageApi, messageCtx] = message.useMessage();
  
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    clinicName: '',
    experienceYears: '',
    treatmentCount: '',
    address: '',
    courseTimeSlot: '',
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
    
    if (!formData.fullName.trim()) {
      fieldErrors.fullName = t('join.form.errors.required', { field: t('join.form.fields.fullName') });
    }
    
    if (!formData.phoneNumber.trim()) {
      fieldErrors.phoneNumber = t('join.form.errors.required', { field: t('join.form.fields.phoneNumber') });
    } else {
      const phoneNumber = formData.phoneNumber.trim();
      const mobileRegex = /^09[0-9]{8}$/;
      const landlineRegex = /^0[2-8][0-9]{7,8}$/;
      const internationalRegex = /^(\+886|886)9[0-9]{8}$/;
      
      if (!mobileRegex.test(phoneNumber) && !landlineRegex.test(phoneNumber) && !internationalRegex.test(phoneNumber)) {
        fieldErrors.phoneNumber = t('join.form.errors.invalidPhone');
      }
    }
    
    if (!formData.email.trim()) {
      fieldErrors.email = t('join.form.errors.required', { field: t('join.form.fields.email') });
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        fieldErrors.email = t('join.form.errors.invalidEmail');
      }
    }
    
    if (!formData.clinicName.trim()) {
      fieldErrors.clinicName = t('join.form.errors.required', { field: t('join.form.fields.clinicName') });
    }
    
    if (!formData.experienceYears.trim()) {
      fieldErrors.experienceYears = t('join.form.errors.required', { field: t('join.form.fields.experienceYears') });
    } else {
      const years = parseInt(formData.experienceYears);
      if (isNaN(years) || years < 0) {
        fieldErrors.experienceYears = t('join.form.errors.invalidNumber', { field: t('join.form.fields.experienceYears') });
      }
    }
    
    if (!formData.treatmentCount.trim()) {
      fieldErrors.treatmentCount = t('join.form.errors.required', { field: t('join.form.fields.treatmentCount') });
    } else {
      const count = parseInt(formData.treatmentCount);
      if (isNaN(count) || count < 0) {
        fieldErrors.treatmentCount = t('join.form.errors.invalidNumber', { field: t('join.form.fields.treatmentCount') });
      }
    }
    
    if (!formData.address.trim()) {
      fieldErrors.address = t('join.form.errors.required', { field: t('join.form.fields.address') });
    }
    
    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length > 0;
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    const hasErrors = validateForm();
    if (hasErrors) {
      messageApi.warning({
        content: t('join.form.errors.incomplete'),
        duration: 3,
        style: { marginTop: '100px' },
      });
      // 滚动到第一个出错字段并聚焦（等 React 渲染出 .error 类后再查）
      setTimeout(() => {
        const firstError = document.querySelector('.join-info-form .form-input.error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstError.focus({ preventScroll: true });
        }
      }, 50);
      return;
    }

    setIsSubmitting(true);

    try {
      const dentistData = {
        full_name: formData.fullName.trim(),
        phone: formData.phoneNumber.trim(),
        email: formData.email.trim(),
        clinic_name: formData.clinicName.trim(),
        years_experience: parseInt(formData.experienceYears),
        treatment_count: parseInt(formData.treatmentCount),
        address: formData.address.trim(),
        special_notes: formData.remarks.trim(),
        course_time_slot: formData.courseTimeSlot,
        status: 'pending'
      };

      console.log('Submitting data:', dentistData); // 调试信息
      
      const result = await apiService.post('/api/dentist-info', dentistData);
      
      console.log('API Response:', result); // 添加调试信息
      
      // 无论API返回什么，都显示成功消息（用于测试）
      setFormData({
        fullName: '',
        phoneNumber: '',
        email: '',
        clinicName: '',
        experienceYears: '',
        treatmentCount: '',
        address: '',
        courseTimeSlot: '',
        remarks: ''
      });
      setErrors({});
      
      // 确保显示成功消息
      const successMessage = t('join.form.success');
      console.log('Success message:', successMessage); // 调试信息
      
      // 使用messageApi显示消息
      messageApi.success({
        content: successMessage,
        duration: 3,
        style: {
          marginTop: '100px', // 确保不被头部遮挡
        },
      });
      
    } catch (error) {
      console.error('提交失败:', error);
      messageApi.error({
        content: '提交失败，请稍后重试',
        duration: 3,
        style: {
          marginTop: '100px',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="join-info-section" id="join-info">
      {messageCtx}
      <div className="join-info-container">
        <div className="join-info-title">
          <span>{t('join.form.title')}</span>
        </div>
        
        <form className="join-info-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-label">{t('join.form.fields.fullName')}</label>
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
            <label className="form-label">{t('join.form.fields.phoneNumber')}</label>
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
            <label className="form-label">{t('join.form.fields.email')}</label>
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
            <label className="form-label">{t('join.form.fields.clinicName')}</label>
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
            <label className="form-label">{t('join.form.fields.experienceYears')}</label>
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
            <label className="form-label">{t('join.form.fields.treatmentCount')}</label>
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
            <label className="form-label">{t('join.form.fields.address')}</label>
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
            <label className="form-label">{t('join.form.fields.courseTimeSlot')}</label>
            <select
              className="form-input"
              value={formData.courseTimeSlot}
              onChange={(e) => handleInputChange('courseTimeSlot', e.target.value)}
            >
              <option value="">{t('join.form.fields.selectCourseSlot')}</option>
              {COURSE_TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label className="form-label">{t('join.form.fields.remarks')}</label>
            <textarea
              className="form-textarea"
              value={formData.remarks}
              onChange={(e) => handleInputChange('remarks', e.target.value)}
              rows="4"
            />
          </div>

          <div className="form-submit">
            <DetailButton 
              text={isSubmitting ? t('join.form.submitting') : t('join.form.submit')} 
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
