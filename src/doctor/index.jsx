import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getRoleName } from "../contants/roleRoutes";
import DateSelector from "../components/date-selector";
import AppointmentCard from "../components/appointment-card";
import StatusCard from "../components/status-card";
import TreatmentFlow from "../components/treatment-flow";
import apiService from "../services/api";
import "./index.scss";

const gapSize = 16;


// 用户信息卡片
function UserInfoCard({ userInfo }) {
  const account = userInfo?.user_id || "—";
  const phone = userInfo?.phone || "—";
  const email = userInfo?.email || "—";
  const address = userInfo?.department || "—";

  return (
    <div className="card user-info-card">
      <div className="user-greeting">
        郭博士 你好
        {userInfo && (
          <span className="user-role">
            ({getRoleName(userInfo.role)} - {userInfo.full_name || userInfo.username})
          </span>
        )}
      </div>
      
      <div className="pill-list">
        <div className="pill"><span className="pill-label">帳戶：</span><span className="pill-value">{account}</span></div>
        <div className="pill"><span className="pill-label">聯繫方式：</span><span className="pill-value">{phone}</span></div>
        <div className="pill"><span className="pill-label">信箱：</span><span className="pill-value">{email}</span></div>
        <div className="pill"><span className="pill-label">地址：</span><span className="pill-value">{address}</span></div>
      </div>
    </div>
  );
}

// 患者信息卡片
function PatientInfoCard({ patientData }) {
  return (
    <div className="card patient-info-card">
      <div className="patient-header">
        <div className="patient-id">{patientData?.patient?.patient_id || '—'}</div>
        <div className="patient-name">{patientData?.patient?.full_name || '—'}</div>
        <div className="patient-user-id">用戶ID: {patientData?.patient?.uuid || '—'}</div>
      </div>
      
      <div className="patient-fields">
        <div className="field-group">
          <label>性别:</label>
          <input type="text" placeholder="请输入性别" defaultValue={patientData?.patient?.gender || ''} />
        </div>
        <div className="field-group">
          <label>生日:</label>
          <input type="text" placeholder="请输入生日" defaultValue={patientData?.patient?.birth_date || ''} />
        </div>
        <div className="field-group search-group">
          <label>搜素:</label>
          <div className="search-input-wrapper">
            <input type="text" placeholder="搜索患者..." />
            <span className="search-icon">🔍</span>
          </div>
        </div>
        <div className="field-group">
          <label>聯繫方式:</label>
          <span className="value">{patientData?.patient?.phone || '—'}</span>
        </div>
        <div className="field-group">
          <label>信箱:</label>
          <span className="value">{patientData?.patient?.email || '—'}</span>
        </div>
        <div className="expand-icon">▲</div>
      </div>
    </div>
  );
}

// 治疗纪要组件
function TreatmentSummary() {
  const [selectedDate, setSelectedDate] = useState(6);
  
  const dates = [
    { day: "Mon", date: 3 },
    { day: "Tue", date: 4 },
    { day: "Wed", date: 5 },
    { day: "Thu", date: 6 },
    { day: "Fri", date: 7 },
    { day: "Sat", date: 8 },
    { day: "Sun", date: 9 },
    { day: "Mon", date: 10 },
    { day: "Tue", date: 11 },
    { day: "Wed", date: 12 }
  ];

  const appointments = [
    {
      time: "8:00 - 8:30",
      type: "Dentist",
      doctor: "Dr. Dianne Fisher",
      clinic: "CityMed Clinic",
      color: "#e3f2fd",
      icon: "🦷"
    },
    {
      time: "9:00 - 9:30",
      type: "Neurologist",
      doctor: "Dr. Paul Collins",
      clinic: "Huston Hospital",
      color: "#fce4ec",
      icon: "🧠"
    },
    {
      time: "18:00 - 18:30",
      type: "Digital X-Ray",
      doctor: "Dr. Betty Woods",
      clinic: "CityMed Clinic",
      color: "#f3e5f5",
      icon: "📷"
    }
  ];

  const handleAppointmentAction = (appointment) => {
    console.log('预约操作:', appointment);
  };

  return (
    <div className="card treatment-summary">
      <div className="card-title">治療紀要</div>
      
      {/* 日期选择器 */}
      <DateSelector 
        dates={dates}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />

      {/* 预约列表 */}
      <div className="appointment-list">
        {appointments.map((appointment, index) => (
          <AppointmentCard
            key={index}
            appointment={appointment}
            onAction={() => handleAppointmentAction(appointment)}
          />
        ))}
      </div>

      {/* 备注和操作按钮 */}
      <div className="notes-section">
        <div className="notes-label">备注:</div>
        <div className="notes-actions">
          <button className="action-btn primary">上傳</button>
          <button className="action-btn secondary">下載</button>
        </div>
      </div>
    </div>
  );
}

// 治疗状态组件
function TreatmentStatus() {
  const statusCards = [
    {
      title: "牙套類型",
      value: "輕度",
      note: "(平均治療週期3-9個月)",
      type: "brace-type"
    },
    {
      title: "目前進度",
      value: "付款完成",
      icon: "💰",
      type: "current-progress"
    },
    {
      title: "治療階段",
      value: "第一週",
      type: "treatment-phase"
    },
    {
      title: "創建帳單",
      type: "create-bill"
    }
  ];

  const flowSteps = [
    { name: "口掃完成", status: "completed", icon: "📋" },
    { name: "確認治療方案", status: "completed", icon: "📋" },
    { name: "付款完成", status: "current", icon: "📋" },
    { name: "生產完成", status: "pending", icon: "📋" },
    { name: "治療中", status: "pending", icon: "📋" },
    { name: "治療完成", status: "pending", icon: "📋" }
  ];

  return (
    <div className="card treatment-status">
      {/* 四个状态卡片 */}
      <div className="status-cards">
        {statusCards.map((card, index) => (
          <StatusCard
            key={index}
            title={card.title}
            value={card.value}
            note={card.note}
            icon={card.icon}
            type={card.type}
          />
        ))}
      </div>

      {/* 治疗流程步骤 */}
      <TreatmentFlow steps={flowSteps} />

      {/* 更新按钮 */}
      <button className="update-btn">
        更新并发送患者资料卡
      </button>
    </div>
  );
}

// 患者列表表格
function PatientTable({ patients }) {
  return (
    <div className="card patient-table">
      <div className="table-header">
        <div className="card-title">患者列表</div>
      </div>

      {/* 表格数据行 */}
      <div className="table-rows">
        {patients.map((p, index) => (
          <div key={index} className="table-row">
            <div className="row-item sequence">{String(index + 1).padStart(2, '0')}</div>
            <div className="row-item name">{p?.patient?.full_name || '—'}</div>
            <div className="row-item user-id">用戶ID: {p?.patient?.uuid || '—'}</div>
            <div className="row-item contact">聯繫方式: {p?.patient?.phone || '—'}</div>
            <div className="row-item email">信箱: {p?.patient?.email || '—'}</div>
            <div className="row-item status">
              <span className="status-badge">{p?.smileTest?.test_status || '—'}</span>
            </div>
            <div className="row-item action">
              <span className="action-icon">▼</span>
            </div>
          </div>
        ))}
      </div>

      {/* 底部按钮 */}
      <div className="table-footer">
        <button className="create-patient-btn">
          創建患者资料卡
        </button>
      </div>
    </div>
  );
}

export default function DoctorDashboard() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout, userInfo } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const uuidFromUser = userInfo?.uuid || '550e8400-e29b-41d4-a716-446655440001';
    setLoading(true);
    apiService.getPatientsByDoctor({ uuid: uuidFromUser })
      .then(res => {
        if (res?.success) {
          setPatients(Array.isArray(res.data) ? res.data : []);
        } else {
          setError(res?.message || '獲取患者資料失敗');
        }
      })
      .catch(err => {
        console.error('getPatientsByDoctor error:', err);
        setError('網路錯誤，請稍後再試');
      })
      .finally(() => setLoading(false));
  }, [userInfo]);

  if (loading) {
    return (
      <div style={{
        width: "100vw",
        height: "100vh",
        background: "#f6f6f7",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div>加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        width: "100vw",
        height: "100vh",
        background: "#f6f6f7",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "20px"
      }}>
        <div style={{ color: "red" }}>{error}</div>
        <button 
          onClick={() => window.location.href = '/login'}
          style={{
            background: "#48d2ce",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "10px 20px",
            cursor: "pointer"
          }}
        >
          返回登录页面
        </button>
      </div>
    );
  }

  return (
    <div className="doctor-dashboard">
      <div className="main-content">
        {/* 用户信息 */}
        <UserInfoCard userInfo={userInfo} />
        
        {/* 患者信息 */}
        <PatientInfoCard patientData={patients?.[0]} />

        {/* 主要内容区域 */}
        <div className="content-layout">
          {/* 左侧内容 */}
          <div className="left-panel">
            <TreatmentSummary />
          </div>
          
          {/* 右侧状态面板 */}
          <div className="right-panel">
            <TreatmentStatus />
          </div>
        </div>

        {/* 患者列表 */}
        <PatientTable patients={patients} />
      </div>
    </div>
  );
}
