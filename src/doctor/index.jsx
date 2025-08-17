import React, { useState, useEffect } from "react";
import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiService from "../services/api";
import PatientInfoList from "./list";
import Logout from "../components/logout/index";
import CreatePatientModal from "./CreatePatientModal";
import "./index.scss";
// 狀態標題由列表內部處理


// 用户信息卡片
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
      {isDoctorDetail ? null : <Logout style={{ marginLeft: 12 }}>退出登录</Logout>}

    </div>
  );
}

export default function DoctorDashboard({ initialPatients = null, doctorUser = null, style = {} }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { userInfo } = useAuth();
  const location = useLocation();

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
        <div>加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ width: "100vw", height: "100vh", background: "#f6f6f7", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "20px" }}>
        <div style={{ color: "red" }}>{error}</div>
        <button onClick={() => window.location.href = '/login'} style={{ background: "#48d2ce", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 20px", cursor: "pointer" }}>返回登录页面</button>
      </div>
    );
  }

  const statusFromPath = (() => {
    const match = location.pathname.match(/\/doctor\/patients\/(.+)$/);
    if (match && match[1]) {
      const seg = decodeURIComponent(match[1]);
      return seg === 'all' ? 'all' : seg;
    }
    return 'all';
  })();

  const SIDEBAR_WIDTH = 140;

  return (
    <div className="doctor-dashboard" style={style}>
      <div className="sidebar" style={{ position: 'sticky', top: 0, width: SIDEBAR_WIDTH }}>
        <div>
          <div className="system-title">系統菜單</div>
          <div className="account-list">
            <div className="account-item" style={{ fontWeight: 700 }}>醫師工作台</div>
          </div>
          <div style={{ color: '#fff', fontSize: 14, marginBottom: 10 }}>患者列表</div>
          <div className="account-list">
            <NavLink className="account-item" to="/doctor/patients/all">全部</NavLink>
            <NavLink className="account-item" to={encodeURI('/doctor/patients/等待預約')}>等待預約</NavLink>
            <NavLink className="account-item" to={encodeURI('/doctor/patients/預約完成')}>預約完成</NavLink>
            <NavLink className="account-item" to={encodeURI('/doctor/patients/確認方案')}>確認方案</NavLink>
            <NavLink className="account-item" to={encodeURI('/doctor/patients/付款完成')}>付款完成</NavLink>
            <NavLink className="account-item" to={encodeURI('/doctor/patients/生產完成')}>生產完成</NavLink>
            <NavLink className="account-item" to={encodeURI('/doctor/patients/治療中')}>治療中</NavLink>
            <NavLink className="account-item" to={encodeURI('/doctor/patients/治療完成')}>治療完成</NavLink>
          </div>
          <div style={{ color: '#fff', fontSize: 14, margin: '16px 0 10px' }}>日历看板</div>
          <div className="account-list">
            <NavLink className="account-item" to="/doctor/calendar">日历看板</NavLink>
          </div>
        </div>
        <div>
          <div className="account-list">
            <NavLink className="account-item" to="/doctor/settings">個人設置</NavLink>
            <NavLink className="account-item" to="/doctor/help">尋找幫助</NavLink>
          </div>
          <Logout style={{ width: '100%' }}>退出登录</Logout>
        </div>
      </div>

      <div className="doctor-main-content">
        <UserInfoCard userInfo={displayUser} isDoctorDetail={true} />
        <Routes>
          <Route index element={<PatientInfoList patients={patients} onCreate={() => setModalOpen(true)} statusFromRoute={statusFromPath} />} />
          <Route path="patients/:status" element={<PatientInfoList patients={patients} onCreate={() => setModalOpen(true)} statusFromRoute={statusFromPath} />} />
          <Route path="patients" element={<PatientInfoList patients={patients} onCreate={() => setModalOpen(true)} statusFromRoute={statusFromPath} />} />
          <Route path="calendar" element={<div className="card"><div className="card-title">日曆看板</div><div>此頁面功能待實現。</div></div>} />
          <Route path="settings" element={<div className="card"><div className="card-title">個人設置</div><div>功能待實現。</div></div>} />
          <Route path="help" element={<div className="card"><div className="card-title">尋找幫助</div><div>功能待辦。</div></div>} />
          <Route path="*" element={<PatientInfoList patients={patients} onCreate={() => setModalOpen(true)} statusFromRoute={statusFromPath} />} />
        </Routes>
      </div>
      <CreatePatientModal open={modalOpen} onClose={() => setModalOpen(false)} onCreated={() => { setModalOpen(false); if (!initialPatients) { load(); } }} />
    </div>
  );
}
