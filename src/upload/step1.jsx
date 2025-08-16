import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import BirthdayPicker from '../components/birthday';
import { smileTestApi } from '../services/smileTestApi';
import './step1.scss';

export default function Step1({ onNext, style, setStep }) {
  const location = useLocation();
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
        const data = (result.data && result.data.smileTest) ? result.data.smileTest : result.data;
        setFormData({
          full_name: data?.full_name || '',
          birth_date: data?.birth_date ? new Date(data.birth_date).toISOString().split('T')[0] : '',
          phone: data?.phone || '',
          email: data?.email || '',
          line_id: data?.line_id || '',
          city: data?.city || ''
        });
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
  }, []);

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
      setPhoneError('請輸入正確的台灣手機號碼格式 (09xxxxxxxx)');
      return;
    }
    
    if (agreed) {
      // 保存数据到API
      await saveData(formData);
      
      // 调用原有的onNext回调
      onNext && onNext(formData);
    }
  };

  const cities = [
    '台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市',
    '基隆市', '新竹市', '新竹縣', '苗栗縣', '彰化縣', '南投縣',
    '雲林縣', '嘉義市', '嘉義縣', '屏東縣', '宜蘭縣', '花蓮縣',
    '台東縣', '澎湖縣', '金門縣', '連江縣'
  ];

  if (loading) {
    return (
      <div className="step1-wrapper" style={style}>
        <div className="step1-content">
          <div className="loading">載入中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="step1-wrapper" style={style}>
      <div className="step1-content">
        <div className="step1-header">
          <h1 className="step1-title">
            留下簡單資訊，讓我們更了解你！
          </h1>
          <p className="step1-subtitle">
            只需幾分鐘，即可分享您的詳細訊息和4張微笑照片
          </p>
        </div>

        <form className="step1-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              placeholder="名字"
              required
            />
          </div>

          <div className="form-group">
            <BirthdayPicker
              value={formData.birth_date}
              onChange={handleBirthdayChange}
              placeholder="生日"
            />
          </div>

          <div className="form-group">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="手機號碼"
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
              placeholder="電子信箱"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="line_id"
              value={formData.line_id}
              onChange={handleInputChange}
              placeholder="LINE ID"
            />
          </div>

          <div className="form-group">
            <select
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
            >
              <option value="">選擇縣市</option>
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
                點擊此處即表示你接受我們的使用者條款和隱私權條款，並同意根據隱私權條款內之內容，透過LINE、SMS 或其他管道聯繫我
              </span>
            </label>
          </div>
          <div className="step1-button-wrapper">
            <button 
              type="submit" 
              className="next-button"
              disabled={!agreed}
              onClick={() => setStep(pre => pre + 1)}
            >
              下一步
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
