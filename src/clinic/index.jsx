import React, { useEffect, useMemo, useState } from "react";
import apiService from "../services/api";
import { Modal, Select, Input, message } from 'antd';
import CryptoJS from 'crypto-js';

function Sidebar({ clinics = [], activeUuid, onSelect, onAddClinic }) {
  return (
    <div style={{ width: 220, background: "#48d2ce", borderRadius: 18, padding: 12, color: "#fff", height: "100%", boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: 12, textAlign: 'center', fontWeight: 600 }}>診所列表</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        {(clinics || []).map((c) => (
          <div
            key={c.uuid || c.id}
            onClick={() => onSelect(c)}
            style={{
              padding: '10px 12px',
              background: activeUuid === c.uuid ? '#2bb3ae' : 'rgba(255,255,255,0.15)',
              borderRadius: 10,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {c.clinic_name || '—'}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 'auto', paddingTop: 12 }}>
        <button 
          onClick={onAddClinic}
          style={{
            width: '100%',
            padding: '10px 12px',
            background: 'rgba(255,255,255,0.2)',
            border: '2px solid #ff6b6b',
            borderRadius: 10,
            color: '#fff',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500
          }}
        >
          新增診所
        </button>
      </div>
    </div>
  );
}

function DoctorRow({ doc }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 240px', padding: '10px 12px', alignItems: 'center' }}>
      <div style={{ fontWeight: 600, textAlign: 'left' }}>{doc.full_name || doc.username || '—'}</div>
      <div style={{ color: '#666', textAlign: 'left' }}>{doc.phone || '—'}</div>
      <div style={{ color: '#666', textAlign: 'left' }}>{doc.email || '—'}</div>
    </div>
  );
}

export default function ClinicDashboard() {
  const [clinics, setClinics] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [activeClinic, setActiveClinic] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ username: '', password: '', phone: '', email: '', clinic_uuid: '' });
  const [addClinicOpen, setAddClinicOpen] = useState(false);
  const [clinicForm, setClinicForm] = useState({ clinic_name: '', address: '', phone: '', city: '', website: '' });

  useEffect(() => {
    apiService.getClinics().then((res) => {
      if (res?.success) {
        setClinics(res.data || []);
        const first = (res.data || [])[0];
        if (first) setActiveClinic(first);
      }
    });
    apiService.getDoctorsWithClinic().then((res) => {
      if (res?.success) setDoctors(res.data || []);
    });
  }, []);

  // 当创建成功时刷新医生列表
  const refreshDoctors = async () => {
    const res = await apiService.getDoctorsWithClinic();
    if (res?.success) setDoctors(res.data || []);
  };

  // 刷新诊所列表
  const refreshClinics = async () => {
    const res = await apiService.getClinics();
    if (res?.success) {
      setClinics(res.data || []);
      // 如果没有选中的诊所，选择第一个
      if (!activeClinic && res.data && res.data.length > 0) {
        setActiveClinic(res.data[0]);
      }
    }
  };

  const doctorsOfClinic = useMemo(() => {
    if (!activeClinic?.uuid) return [];
    return (doctors || []).filter((d) => (d?.clinic?.uuid || d?.department) === activeClinic.uuid);
  }, [activeClinic?.uuid, doctors]);

  return (
    <div style={{ display: 'flex', gap: 16, minHeight: '100%', alignItems: 'flex-start' }}>
      <Sidebar 
        clinics={clinics} 
        activeUuid={activeClinic?.uuid} 
        onSelect={setActiveClinic}
        onAddClinic={() => setAddClinicOpen(true)}
      />
      <div style={{ flex: 1, background: '#fff', borderRadius: 18, padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 18, fontWeight: 700, textAlign: 'left' }}>診所資訊</div>
            <div style={{ color: '#666', textAlign: 'left' }}>{activeClinic?.clinic_name || '—'}</div>
          </div>
          <button 
            onClick={() => setCreateOpen(true)}
            style={{
              padding: '8px 16px',
              background: '#48d2ce',
              border: 'none',
              borderRadius: 8,
              color: '#fff',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span style={{ fontSize: '16px' }}>+</span>
            新增醫生
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 8, columnGap: 20, marginBottom: 18, width: '100%' }}>
          <div style={{ textAlign: 'left' }}>地址：{activeClinic?.address || '—'}</div>
          <div style={{ textAlign: 'left' }}>城市：{activeClinic?.city || '—'}</div>
          <div style={{ textAlign: 'left' }}>電話：{activeClinic?.phone || '—'}</div>
          <div style={{ textAlign: 'left' }}>網站：{activeClinic?.website || '—'}</div>
        </div>

        <div style={{ margin: '10px 0 6px', fontSize: 16, fontWeight: 700, width: '100%', textAlign: 'left' }}>醫生列表</div>
        <div style={{ border: '1px solid #eef2f5', borderRadius: 10, overflow: 'hidden', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 240px', padding: '10px 12px', color: '#8898a8', fontWeight: 600, textAlign: 'left' }}>
            <div style={{ textAlign: 'left' }}>姓名</div>
            <div style={{ textAlign: 'left' }}>聯繫方式</div>
            <div style={{ textAlign: 'left' }}>信箱</div>
          </div>
          {(doctorsOfClinic || []).map((d) => (
            <DoctorRow key={d.uuid || d.id} doc={d} />
          ))}
          {doctorsOfClinic.length === 0 && <div style={{ padding: 12, color: '#999', textAlign: 'left' }}>暫無醫生</div>}
        </div>
      </div>

      {/* 创建账号弹窗 */}
      <Modal
        title={`為 ${activeClinic?.clinic_name || '診所'} 創建醫生帳戶`}
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        onOk={async () => {
          if (!form.username || !form.password) {
            message.error('請填寫帳號與密碼');
            return;
          }
          if (!activeClinic?.uuid) {
            message.error('請先選擇診所');
            return;
          }
          const payload = {
            username: form.username,
            // 使用 SHA-256 加密后发送，后端按 'hashed_' 前缀存储
            password: CryptoJS.SHA256(form.password).toString(CryptoJS.enc.Hex),
            phone: form.phone || undefined,
            email: form.email || undefined,
            role: 'doctor',
            department: activeClinic.uuid, // 自动使用当前选中的诊所
          };
          const res = await apiService.createAdminUser(payload);
          if (res?.success) {
            message.success('創建成功');
            setCreateOpen(false);
            setForm({ username: '', password: '', phone: '', email: '' });
            // 刷新医生列表
            await refreshDoctors();
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
          <div style={{ padding: '8px 12px', background: '#f5f5f5', borderRadius: 6, color: '#666' }}>
            <div style={{ fontSize: '12px', marginBottom: '4px' }}>診所</div>
            <div style={{ fontWeight: 500 }}>{activeClinic?.clinic_name || '—'}</div>
          </div>
        </div>
      </Modal>

      {/* 新增诊所弹窗 */}
      <Modal
        title="新增診所"
        open={addClinicOpen}
        onCancel={() => setAddClinicOpen(false)}
        onOk={async () => {
          if (!clinicForm.clinic_name) {
            message.error('請填寫診所名稱');
            return;
          }
          const payload = {
            clinic_name: clinicForm.clinic_name,
            address: clinicForm.address || undefined,
            phone: clinicForm.phone || undefined,
            city: clinicForm.city || undefined,
            website: clinicForm.website || undefined,
          };
          const res = await apiService.createClinic(payload);
          if (res?.success) {
            message.success('診所創建成功');
            setAddClinicOpen(false);
            setClinicForm({ clinic_name: '', address: '', phone: '', city: '', website: '' });
            // 刷新诊所列表
            await refreshClinics();
          } else {
            message.error(res?.message || '診所創建失敗');
          }
        }}
        okText="保存"
        cancelText="取消"
      >
        <div style={{ display: 'grid', gap: 12 }}>
          <div>
            <div>診所名稱 <span style={{ color: '#ff4d4f' }}>*</span></div>
            <Input 
              value={clinicForm.clinic_name} 
              onChange={(e) => setClinicForm({ ...clinicForm, clinic_name: e.target.value })}
              placeholder="請輸入診所名稱"
            />
          </div>
          <div>
            <div>地址</div>
            <Input 
              value={clinicForm.address} 
              onChange={(e) => setClinicForm({ ...clinicForm, address: e.target.value })}
              placeholder="請輸入診所地址"
            />
          </div>
          <div>
            <div>電話</div>
            <Input 
              value={clinicForm.phone} 
              onChange={(e) => setClinicForm({ ...clinicForm, phone: e.target.value })}
              placeholder="請輸入診所電話"
            />
          </div>
          <div>
            <div>城市</div>
            <Input 
              value={clinicForm.city} 
              onChange={(e) => setClinicForm({ ...clinicForm, city: e.target.value })}
              placeholder="請輸入診所所在城市"
            />
          </div>
          <div>
            <div>網站</div>
            <Input 
              value={clinicForm.website} 
              onChange={(e) => setClinicForm({ ...clinicForm, website: e.target.value })}
              placeholder="請輸入診所網站"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}


