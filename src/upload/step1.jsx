import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import BirthdayPicker from '../components/birthday';
import { smileTestApi } from '../services/smileTestApi';
import './step1.scss';

export default function Step1({ onNext, style, setStep }) {
  const location = useLocation();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    full_name: '',
    birth_date: '',
    phone: '',
    email: '',
    line_id: '',
    city: ''
  });
  const [agreed, setAgreed] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [loading, setLoading] = useState(false);

  // 从URL获取UUID
  const getTestUuid = () => {
    const urlParams = new URLSearchParams(location.search);
    return urlParams.get('id');
  };

  // 从API获取数据
  const fetchData = async () => {
    const testUuid = getTestUuid();
    if (!testUuid) return;

    try {
      setLoading(true);
      const result = await smileTestApi.getSmileTestByUuid(testUuid);

      if (result.success && result.data) {
        const smile = (result.data && result.data.smileTest) ? result.data.smileTest : (result.data || {});
        const patient = (result.data && result.data.patient) ? result.data.patient : {};

        const birthDateRaw = smile?.birth_date || patient?.birth_date;
        const birthDateNormalized = birthDateRaw
          ? new Date(birthDateRaw).toISOString().split('T')[0]
          : '';

        setFormData({
          full_name: smile?.full_name || patient?.full_name || '',
          birth_date: birthDateNormalized,
          phone: smile?.phone || patient?.phone || '',
          email: smile?.email || patient?.email || '',
          line_id: smile?.line_id || patient?.line_id || '',
          city: smile?.city || patient?.city || ''
        });
      } else {
        // 若記錄不存在，先創建一筆空記錄，避免後續步驟查不到資料
        try {
          await smileTestApi.saveOrUpdateSmileTestByUuid(testUuid, { test_status: 'in_progress' });
        } catch (e) {
          console.error('Failed to initialize smile test record:', e);
        }
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 保存数据到API
  const saveData = async (data) => {
    const testUuid = getTestUuid();
    if (!testUuid) return;

    try {
      // 确保birth_date是正确的格式
      let birthDate = null;
      if (data.birth_date) {
        // 如果已经是YYYY-MM-DD格式，直接使用
        if (data.birth_date.includes('-') && data.birth_date.split('-').length === 3) {
          birthDate = data.birth_date;
        } else {
          // 如果是其他格式，尝试转换
          const date = new Date(data.birth_date);
          if (!isNaN(date.getTime())) {
            birthDate = date.toISOString().split('T')[0];
          }
        }
      }

      const result = await smileTestApi.saveOrUpdateSmileTestByUuid(testUuid, {
        ...data,
        test_status: 'in_progress',
        birth_date: birthDate
      });
      
      if (!result.success) {
        console.error('Failed to save data:', result.message);
      }
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  };

  // 组件加载时获取数据
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBirthdayChange = (value) => {
    setFormData(prev => ({
      ...prev,
      birth_date: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 清除之前的错误信息
    setPhoneError('');
    
    // 验证手机号码
    if (formData.phone && !/^09\d{8}$/.test(formData.phone)) {
      setPhoneError(t('upload.step1Form.phoneError'));
      return;
    }
    
    if (agreed) {
      // 保存数据到API
      await saveData(formData);
      
      // 保存成功後再跳下一步，避免資料尚未寫入導致下一步無法回顯
      setStep((pre) => Math.max(2, pre + 1));
      // 可選：通知外部
      onNext && onNext(formData);
    }
  };

  const cities = t('upload.step1Form.cities');

  if (loading) {
    return (
      <div className="step1-wrapper" style={style}>
        <div className="step1-content">
          <div className="loading">{t('upload.step1Form.loading')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="step1-wrapper" style={style}>
      <div className="step1-content">
        <div className="step1-header">
          <h1 className="step1-title">
            {t('upload.step1Form.title')}
          </h1>
          <p className="step1-subtitle">
            {t('upload.step1Form.subtitle')}
          </p>
        </div>

        <form className="step1-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              placeholder={t('upload.step1Form.name')}
              required
            />
          </div>

          <div className="form-group">
            <BirthdayPicker
              value={formData.birth_date}
              onChange={handleBirthdayChange}
              placeholder={t('upload.step1Form.birthday')}
            />
          </div>

          <div className="form-group">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder={t('upload.step1Form.phone')}
              required
              className={phoneError ? 'error' : ''}
            />
            {phoneError && <div className="error-message">{phoneError}</div>}
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={t('upload.step1Form.email')}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="line_id"
              value={formData.line_id}
              onChange={handleInputChange}
              placeholder={t('upload.step1Form.lineId')}
            />
          </div>

          <div className="form-group">
            <select
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
            >
              <option value="">{t('upload.step1Form.city')}</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div className="consent-group">
            <label className="consent-label">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="consent-checkbox"
              />
              <span className="consent-text">
                {t('upload.step1Form.consent')}
              </span>
            </label>
          </div>
          <div className="step1-button-wrapper">
            <button 
              type="submit" 
              className="next-button"
              disabled={!agreed}
            >
              {t('upload.step1Form.nextButton')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
