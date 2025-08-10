import React, { useState } from 'react';
import apiService from '../services/api';
import BirthdayPicker from '../components/birthday';
import { useAuth } from '../context/AuthContext';

const CITIES = [
  '台北市','新北市','桃園市','台中市','台南市','高雄市','基隆市','新竹市','嘉義市','新竹縣','苗栗縣','彰化縣','南投縣','雲林縣','嘉義縣','屏東縣','宜蘭縣','花蓮縣','台東縣','澎湖縣','金門縣','連江縣'
];

export default function CreatePatientModal({ open, onClose, onCreated }) {
  const { userInfo } = useAuth();
  const [form, setForm] = useState({
    full_name: '',
    birth_date: '',
    gender: '',
    phone: '',
    email: '',
    line_id: '',
    city: '',
  });
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const setField = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name) return alert('請輸入名字');

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        assigned_doctor_uuid: userInfo?.uuid,
      };
      const res = await apiService.createPatientWithSmileTest(payload);
      if (res?.success) {
        alert('創建成功');
        onCreated && onCreated(res.data);
        onClose && onClose();
      } else {
        alert(res?.message || '創建失敗');
      }
    } catch (err) {
      console.error(err);
      alert('網路錯誤，請稍後再試');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">創建患者資料卡</div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              className="input"
              placeholder="名字"
              value={form.full_name}
              onChange={(e) => setField('full_name', e.target.value)}
            />
          </div>
          <div className="form-group">
            <BirthdayPicker
              valueStyle={{ color: 'rgba(0,0,0,.5)' }}
              style={{ border: '1.5px solid #cfd8e3', background: '#f8fafc' }}
              value={form.birth_date}
              onChange={(v) => setField('birth_date', v)}
            />
          </div>
          <div className="form-group">
            <select className="input" value={form.gender} onChange={(e) => setField('gender', e.target.value)}>
              <option value="">性別</option>
              <option value="male">男</option>
              <option value="female">女</option>
              <option value="other">其他</option>
            </select>
          </div>
          <div className="form-group">
            <input
              className="input"
              placeholder="手機號碼"
              value={form.phone}
              onChange={(e) => setField('phone', e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              className="input"
              placeholder="電子信箱"
              type="email"
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              className="input"
              placeholder="LINE ID"
              value={form.line_id}
              onChange={(e) => setField('line_id', e.target.value)}
            />
          </div>
          <div className="form-group">
            <select className="input" value={form.city} onChange={(e) => setField('city', e.target.value)}>
              <option value="">選擇縣市</option>
              {CITIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn secondary" onClick={onClose}>取消</button>
            <button type="submit" className="btn primary" disabled={submitting}>{submitting ? '提交中...' : '送出'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
