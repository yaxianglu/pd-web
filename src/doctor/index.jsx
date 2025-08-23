import React, { useState, useEffect } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiService from "../services/api";
import PatientInfoList from "./list";
import PersonalSettings from "./PersonalSettings";
import Help from "./Help";
import Calendar from "./Calendar";
import Logout from "../components/logout/index";
import CreatePatientModal from "./CreatePatientModal";
import "./index.scss";
// 狀態標題由列表內部處理


// 用戶信息卡片
function UserInfoCard({ userInfo, isDoctorDetail = false }) {
  // const account = userInfo?.user_id || "—";
  const phone = userInfo?.phone || "—";
  const email = userInfo?.email || "—";
  const address = userInfo?.clinic?.address || "—";
  const fullName = userInfo?.full_name || userInfo?.username || "—";
  
  return (
    <div className="card user-info-card">
      <div className="user-greeting">
        {fullName || ''} 你好
      </div>
      
      <div className="pill-list">
        <div className="pill"><span className="pill-label">帳戶：</span><span className="pill-value">{userInfo?.username}</span></div>
        <div className="pill"><span className="pill-label">聯繫方式：</span><span className="pill-value">{phone}</span></div>
        <div className="pill"><span className="pill-label">信箱：</span><span className="pill-value">{email}</span></div>
        <div className="pill"><span className="pill-label">地址：</span><span className="pill-value">{address}</span></div>
      </div>
      {isDoctorDetail ? null : <Logout style={{ marginLeft: 12 }}>退出登錄</Logout>}

    </div>
  );
}

export default function DoctorDashboard({ initialPatients = null, doctorUser = null, style = {} }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const SIDEBAR_WIDTH = 140;
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeView, setActiveView] = useState('patients'); // patients | calendar | settings | help
  const { userInfo } = useAuth();

  const isDoctorDetail = !!doctorUser;

  const displayUser = doctorUser || userInfo;

  const normalizePatients = (list) => {
    if (!Array.isArray(list)) return [];
    return list.map((item, index) => {
      const smile = item?.smileTest || {};
      const pt = item?.patient || {};
      const ensuredUuid = pt.uuid || smile.patient_uuid || smile.uuid || `row-${index}`;
      return {
        ...item,
        patient: {
          ...pt,
          uuid: ensuredUuid,
          full_name: pt.full_name || smile.full_name || pt.name,
          phone: pt.phone || smile.phone,
          email: pt.email || smile.email,
          gender: pt.gender || smile.gender,
          birth_date: pt.birth_date || smile.birth_date,
        },
        smileTest: smile,
      };
    });
  };

  const load = () => {
    const uuidFromUser = displayUser?.uuid || userInfo?.uuid;
    setLoading(true);
    apiService.getPatientsByDoctor({ uuid: uuidFromUser })
      .then(res => {
      console.info('res', res);
      if (res?.success) {
          const normalized = normalizePatients(res.data);
          setPatients(normalized);
        } else {
          setError(res?.message || '獲取患者資料失敗');
        }
      })
      .catch(err => {
        console.error('getPatientsByDoctor error:', err);
        setError('網路錯誤，請稍後再試');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (Array.isArray(initialPatients)) {
      const normalized = normalizePatients(initialPatients);
      setPatients(normalized);
      setLoading(false);
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayUser?.uuid, initialPatients]);

  // 狀態篩選移至列表內處理

  if (loading) {
    return (
      <div style={{ width: "100vw", height: "100vh", background: "#f6f6f7", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div>載入中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ width: "100vw", height: "100vh", background: "#f6f6f7", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "20px" }}>
        <div style={{ color: "red" }}>{error}</div>
        <button onClick={() => window.location.href = '/login'} style={{ background: "#48d2ce", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 20px", cursor: "pointer" }}>返回登錄頁面</button>
      </div>
    );
  }

  return (
    <div className="doctor-dashboard" style={style}>
      {
        isDoctorDetail ? null : (
          <div className="sidebar" style={{ position: 'sticky', top: 0, width: SIDEBAR_WIDTH }}>
            <div>
              <div style={{ color: '#fff', fontSize: 16, marginBottom: 10 }} onClick={() => setActiveView('patients')}>患者列表</div>
              <div className="account-list">
                {[
                  { key: 'all', label: '全部' },
                  { key: '等待預約', label: '等待預約' },
                  { key: '預約完成', label: '預約完成' },
                  { key: '確認方案', label: '確認方案' },
                  { key: '付款完成', label: '付款完成' },
                  { key: '生產完成', label: '生產完成' },
                  { key: '治療中', label: '治療中' },
                  { key: '治療完成', label: '治療完成' },
                ].map(item => (
                  <div
                    key={item.key}
                    className={`account-item ${selectedStatus === item.key ? 'active' : ''}`}
                    onClick={() => { setActiveView('patients'); setSelectedStatus(item.key); }}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
              <div style={{ color: '#fff', fontSize: 14, margin: '30px 0 16px' }}>日曆看板</div>
              <div className="account-list">
                <div className={`account-item ${activeView==='calendar' ? 'active' : ''}`} onClick={() => setActiveView('calendar')}>日曆看板</div>
              </div>
            </div>
            <div>
              <div className="account-list">
                <div className={`account-item ${activeView==='settings' ? 'active' : ''}`} onClick={() => setActiveView('settings')}>個人設置</div>
                <div className={`account-item ${activeView==='help' ? 'active' : ''}`} onClick={() => setActiveView('help')}>尋找幫助</div>
              </div>
              <Logout style={{ width: '100%' }}>退出登錄</Logout>
            </div>
          </div>
        )
      }

      <div className="doctor-main-content">
        {/* <UserInfoCard userInfo={displayUser} isDoctorDetail={true} /> */}
        {activeView === 'patients' && (
          <PatientInfoList
            patients={patients}
            onCreate={() => setModalOpen(true)}
            statusFromRoute={selectedStatus}
            onStatusChange={setSelectedStatus}
          />
        )}
        {activeView === 'calendar' && (
          <Calendar />
        )}
        {activeView === 'settings' && (
          <PersonalSettings />
        )}
        {activeView === 'help' && (
          <Help />
        )}
      </div>
      <CreatePatientModal open={modalOpen} onClose={() => setModalOpen(false)} onCreated={() => { setModalOpen(false); if (!initialPatients) { load(); } }} />
    </div>
  );
}
