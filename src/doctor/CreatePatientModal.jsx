import React, { useState } from 'react';
import apiService from '../services/api';
import BirthdayPicker from '../components/birthday';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const CITIES = [
  '台北市','新北市','桃園市','台中市','台南市','高雄市','基隆市','新竹市','嘉義市','新竹縣','苗栗縣','彰化縣','南投縣','雲林縣','嘉義縣','屏東縣','宜蘭縣','花蓮縣','台東縣','澎湖縣','金門縣','連江縣'
];

export default function CreatePatientModal({ open, onClose, onCreated, doctorUser = null }) {
  const { t } = useLanguage();
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
    if (!form.full_name) return alert(t('doctor.createPatient.nameRequired'));

    setSubmitting(true);
    try {
      // 优先使用传入的doctorUser，如果没有则使用当前登录用户
      const assignedDoctorUuid = doctorUser?.uuid || userInfo?.uuid;
      
      const payload = {
        ...form,
        assigned_doctor_uuid: assignedDoctorUuid,
      };
      const res = await apiService.createPatientWithSmileTest(payload);
      if (res?.success) {
        alert(t('doctor.createPatient.createSuccess'));
        onCreated && onCreated(res.data);
        onClose && onClose();
      } else {
        alert(res?.message || t('doctor.createPatient.createFailed'));
      }
    } catch (err) {
      console.error(err);
      alert(t('doctor.createPatient.networkError'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">{t('doctor.createPatient.title')}</div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              className="input"
              placeholder={t('doctor.createPatient.name')}
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
              <option value="">{t('doctor.createPatient.gender')}</option>
              <option value="male">{t('user.male')}</option>
              <option value="female">{t('user.female')}</option>
              <option value="other">{t('user.other')}</option>
            </select>
          </div>
          <div className="form-group">
            <input
              className="input"
              placeholder={t('doctor.createPatient.phone')}
              value={form.phone}
              onChange={(e) => setField('phone', e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              className="input"
              placeholder={t('doctor.createPatient.email')}
              type="email"
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              className="input"
              placeholder={t('doctor.createPatient.lineId')}
              value={form.line_id}
              onChange={(e) => setField('line_id', e.target.value)}
            />
          </div>
          <div className="form-group">
            <select className="input" value={form.city} onChange={(e) => setField('city', e.target.value)}>
              <option value="">{t('doctor.createPatient.city')}</option>
              {CITIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn secondary" onClick={onClose}>{t('common.cancel')}</button>
            <button type="submit" className="btn primary" disabled={submitting}>{submitting ? t('doctor.createPatient.submitting') : t('doctor.createPatient.submit')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
