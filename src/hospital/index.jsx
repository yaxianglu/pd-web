import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { cardTitleSizeStyle, cardPaddingStyle } from "../contants";
import { getRoleName } from "../contants/roleRoutes";
import ContactInfo from "../components/contact-info";
import InfoCardComponent from "../components/info-card";
import apiService from "../services/api";
import DoctorDashboard from "../doctor";
import "./index.scss";
import { Modal, Select, Input, message } from 'antd';
import CryptoJS from 'crypto-js';

const gapSize = 16;

// 左侧导航栏组件
function Sidebar({ doctors = [], onSelect, activeUuid, onCreate }) {
  return (
    <div className="sidebar">
      <div>
        <div className="system-title">巧醫系統</div>
        <div className="account-list">
          {doctors.map((doc) => (
            <div key={doc.uuid} className="account-item" onClick={() => onSelect(doc)} style={{ background: activeUuid === doc.uuid ? 'rgba(255,255,255,.2)' : undefined }}>
              醫師: {doc.full_name || doc.username}
            </div>
          ))}
        </div>
      </div>
      <button className="create-account-btn" onClick={onCreate}>創建帳戶</button>
    </div>
  );
}

export default function HospitalDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [activeDoctor, setActiveDoctor] = useState(null);
  const [patientsByDoctor, setPatientsByDoctor] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [clinics, setClinics] = useState([]);
  const [form, setForm] = useState({ username: '', password: '', phone: '', email: '', clinic_uuid: '' });
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    apiService.getDoctors().then(res => {
      if (res?.success) {
        setDoctors(res.data || []);
        const first = (res.data || [])[0];
        if (first) setActiveDoctor(first);
      }
    });
  }, []);

  useEffect(() => {
    // 预加载诊所列表供下拉框使用
    apiService.getClinics().then(res => {
      if (res?.success) setClinics(res.data || []);
    });
  }, []);

  useEffect(() => {
    if (!activeDoctor?.uuid) return;
    apiService.getPatientsByDoctor({ uuid: activeDoctor.uuid }).then(res => {
      if (res?.success) setPatientsByDoctor(res.data || []);
      else setPatientsByDoctor([]);
    });
  }, [activeDoctor?.uuid]);

  return (
    <div className="hospital-dashboard">
      <Sidebar doctors={doctors} onSelect={setActiveDoctor} activeUuid={activeDoctor?.uuid} onCreate={() => setCreateOpen(true)} />
      <div className="hospital-main-content">
        {activeDoctor ? (
          <DoctorDashboard initialPatients={patientsByDoctor} doctorUser={activeDoctor} />
        ) : (
          <div>正在載入醫師資料...</div>
        )}
      </div>

      {/* 创建账号弹窗 */}
      <Modal
        title="創建帳戶"
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        onOk={async () => {
          if (!form.username || !form.password) {
            message.error('請填寫帳號與密碼');
            return;
          }
          const payload = {
            username: form.username,
            // 使用 SHA-256 加密后发送，后端按 'hashed_' 前缀存储
            password: CryptoJS.SHA256(form.password).toString(CryptoJS.enc.Hex),
            phone: form.phone || undefined,
            email: form.email || undefined,
            role: 'doctor',
            department: form.clinic_uuid || undefined,
          };
          const res = await apiService.createAdminUser(payload);
          if (res?.success) {
            message.success('創建成功');
            setCreateOpen(false);
            setForm({ username: '', password: '', phone: '', email: '', clinic_uuid: '' });
            // 刷新医生列表
            const d = await apiService.getDoctors();
            if (d?.success) setDoctors(d.data || []);
          } else {
            message.error(res?.message || '創建失敗');
          }
        }}
        okText="保存"
        cancelText="取消"
      >
        <div style={{ display: 'grid', gap: 12 }}>
          <div>
            <div>帳號</div>
            <Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          </div>
          <div>
            <div>密碼</div>
            <Input.Password value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <div>
            <div>聯繫方式</div>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <div>信箱</div>
            <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <div>診所</div>
            <Select
              placeholder="選擇診所"
              value={form.clinic_uuid || undefined}
              onChange={(v) => setForm({ ...form, clinic_uuid: v })}
              options={(clinics || []).map(c => ({ value: c.uuid, label: c.clinic_name }))}
              allowClear
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
