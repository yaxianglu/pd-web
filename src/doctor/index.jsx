import React, { useState, useEffect } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
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
  const { t } = useLanguage();
  // const account = userInfo?.user_id || "—";
  const phone = userInfo?.phone || "—";
  const email = userInfo?.email || "—";
  const address = userInfo?.clinic?.address || "—";
  const fullName = userInfo?.full_name || userInfo?.username || "—";
  
  return (
    <div className="card user-info-card">
      <div className="user-greeting">
        {fullName || ''} {t('doctor.patientInfo.hello')}
      </div>
      
      <div className="pill-list">
        <div className="pill"><span className="pill-label">{t('doctor.patientInfo.account')}：</span><span className="pill-value">{userInfo?.username}</span></div>
        <div className="pill"><span className="pill-label">{t('doctor.patientInfo.contact')}：</span><span className="pill-value">{phone}</span></div>
        <div className="pill"><span className="pill-label">{t('doctor.patientInfo.email')}：</span><span className="pill-value">{email}</span></div>
        <div className="pill"><span className="pill-label">{t('doctor.patientInfo.address')}：</span><span className="pill-value">{address}</span></div>
      </div>
      {isDoctorDetail ? null : <Logout style={{ marginLeft: 12 }}>{t('doctor.logout')}</Logout>}

    </div>
  );
}

export default function DoctorDashboard({ initialPatients = null, doctorUser = null, style = {}, onRefreshPatients = null }) {
  const { t } = useLanguage();
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
          setError(res?.message || t('errors.network'));
        }
      })
      .catch(err => {
        console.error('getPatientsByDoctor error:', err);
        setError(t('errors.network'));
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
        <div>{t('doctor.loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ width: "100vw", height: "100vh", background: "#f6f6f7", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "20px" }}>
        <div style={{ color: "red" }}>{error}</div>
        <button onClick={() => window.location.href = '/login'} style={{ background: "#48d2ce", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 20px", cursor: "pointer" }}>{t('doctor.backToLogin')}</button>
      </div>
    );
  }

  return (
    <div className="doctor-dashboard" style={style}>
      {
        isDoctorDetail ? null : (
          <div className="sidebar" style={{ position: 'sticky', top: 0, width: SIDEBAR_WIDTH }}>
            <div>
              <div style={{ color: '#fff', fontSize: 16, marginBottom: 10 }} onClick={() => setActiveView('patients')}>{t('doctor.patientList')}</div>
              <div className="account-list">
                {[
                  { key: 'all', label: t('doctor.status.all'), progressIndex: null },
                  { key: '0', label: t('doctor.status.waitingAppointment'), progressIndex: 0 },
                  { key: '1', label: t('doctor.status.appointmentCompleted'), progressIndex: 1 },
                  { key: '2', label: t('doctor.status.planConfirmed'), progressIndex: 2 },
                  { key: '3', label: t('doctor.status.paymentCompleted'), progressIndex: 3 },
                  { key: '4', label: t('doctor.status.productionCompleted'), progressIndex: 4 },
                  { key: '5', label: t('doctor.status.inTreatment'), progressIndex: 5 },
                  { key: '6', label: t('doctor.status.treatmentCompleted'), progressIndex: 6 },
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
              <div style={{ color: '#fff', fontSize: 14, margin: '30px 0 16px' }}>{t('doctor.calendarBoard')}</div>
              <div className="account-list">
                <div className={`account-item ${activeView==='calendar' ? 'active' : ''}`} onClick={() => setActiveView('calendar')}>{t('doctor.calendarBoard')}</div>
              </div>
            </div>
            <div>
              <div className="account-list">
                <div className={`account-item ${activeView==='settings' ? 'active' : ''}`} onClick={() => setActiveView('settings')}>{t('doctor.personalSettings')}</div>
                <div className={`account-item ${activeView==='help' ? 'active' : ''}`} onClick={() => setActiveView('help')}>{t('doctor.help.title')}</div>
              </div>
              <Logout style={{ width: '100%' }}>{t('doctor.logout')}</Logout>
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
            doctorUser={doctorUser}
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
      <CreatePatientModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onCreated={() => { 
          setModalOpen(false); 
          // 如果有外部刷新函数，使用外部刷新；否则使用内部load
          if (onRefreshPatients) {
            onRefreshPatients();
          } else {
            load();
          }
        }} 
        doctorUser={displayUser}
      />
    </div>
  );
}
