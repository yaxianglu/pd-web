import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { cardTitleSizeStyle, cardPaddingStyle } from "../contants";
import { getRoleName } from "../contants/roleRoutes";
import ContactInfo from "../components/contact-info";
import InfoCardComponent from "../components/info-card";
import apiService from "../services/api";
import "./index.scss";

const gapSize = 16;

// 左侧导航栏组件
function Sidebar({ doctors = [] }) {
  return (
    <div className="sidebar">
      <div>
        <div className="system-title">巧醫系統</div>
        {/* 账户列表 */}
        <div className="account-list">
          {doctors.map((doc, index) => (
            <div key={doc.uuid || index} className="account-item">
              醫師: {doc.full_name || doc.username}
            </div>
          ))}
        </div>
      </div>
      <button className="create-account-btn">創建帳戶</button>
    </div>
  );
}

// 患者信息卡片
function PatientInfoCard({ patientData }) {
  return (
    <div className="card patient-info-card">
      <div className="patient-details">
        <div className="patient-avatar">01</div>
        <div>
          <div className="patient-name">
            {patientData?.full_name || '蒋权'}
          </div>
          <div className="patient-id">
            用戶ID: {patientData?.test_id || '32012310010'}
          </div>
        </div>
      </div>
      <div className="patient-meta">
        <div>性别: {patientData?.gender || ''}</div>
        <div>生日: {patientData?.birth_date || ''}</div>
        <div>聯繫方式: {patientData?.phone || '13022559203'}</div>
        <div>信箱: {patientData?.email || '1004735926@qq.com'}</div>
        <div style={{ cursor: "pointer", fontSize: "18px" }}>▲</div>
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
      time: "8:00-8:30",
      type: "Dentist",
      doctor: "Dr. Dianne Fisher",
      clinic: "CityMed Clinic",
      color: "#ffe7cf",
      icon: "🦷"
    },
    {
      time: "9:00-9:30",
      type: "Neurologist",
      doctor: "Dr. Paul Collins",
      clinic: "Huston Hospital",
      color: "#dbf6f6",
      icon: "🧠"
    },
    {
      time: "18:00-18:30",
      type: "Digital X-Ray",
      doctor: "Dr. Betty Woods",
      clinic: "CityMed Clinic",
      color: "#fdebf3",
      icon: "💻"
    }
  ];

  return (
    <div className="card treatment-summary">
      <div className="card-title">治療紀要</div>
      
      {/* 日期选择器 */}
      <div className="date-selector">
        {dates.map((item, index) => (
          <div
            key={index}
            onClick={() => setSelectedDate(item.date)}
            className={`date-item ${selectedDate === item.date ? 'selected' : ''}`}
          >
            <div className="day">{item.day}</div>
            <div className="date">{item.date}</div>
          </div>
        ))}
      </div>

      {/* 预约列表 */}
      <div className="appointment-list">
        {appointments.map((appointment, index) => (
          <div
            key={index}
            className="appointment-item"
            style={{ '--appointment-color': appointment.color }}
          >
            <div className="appointment-info">
              <span className="appointment-icon">{appointment.icon}</span>
              <div className="appointment-details">
                <div className="appointment-type">{appointment.type}</div>
                <div className="appointment-doctor">{appointment.doctor}</div>
              </div>
            </div>
            <div className="appointment-clinic">{appointment.clinic}</div>
            <div className="appointment-time">{appointment.time}</div>
          </div>
        ))}
      </div>

      {/* 备注和操作按钮 */}
      <div className="notes-section">
        <div style={{ fontSize: "14px", color: "#666" }}>备注:</div>
        <input
          type="text"
          placeholder="添加备注..."
          className="notes-input"
        />
        <button className="action-btn primary">上傳</button>
        <button className="action-btn secondary">下載</button>
      </div>
    </div>
  );
}

// 治疗状态组件
function TreatmentStatus() {
  return (
    <div className="card treatment-status">
      {/* 牙套类型 */}
      <div className="brace-type">
        <div className="brace-type-title">牙套類型: 輕度</div>
        <div className="brace-type-subtitle">(平均治療週期3-9個月)</div>
      </div>

      {/* 进度指示器 */}
      <div className="progress-indicators">
        <div className="progress-item payment-completed">
          <div className="progress-icon">💰</div>
          <div className="progress-text">付款完成</div>
        </div>
        <div className="progress-item first-week">
          <div className="progress-icon">📅</div>
          <div className="progress-text">第一週</div>
        </div>
        <div className="progress-item create-bill">
          <div className="progress-icon">💳</div>
          <div className="progress-text">創建帳單</div>
        </div>
        <div className="progress-item brace-type">
          <div className="progress-icon">🦷</div>
          <div className="progress-text">牙套類型</div>
        </div>
      </div>

      {/* 治疗流程步骤 */}
      <div className="treatment-flow">
        <div className="flow-title">治療流程</div>
        <div className="flow-steps">
          {[
            { name: "預約完成", status: "completed" },
            { name: "確認治療方案", status: "completed" },
            { name: "付款完成", status: "completed" },
            { name: "生產完成", status: "completed" },
            { name: "治療中", status: "current" },
            { name: "治療完成", status: "pending" }
          ].map((step, index) => (
            <div key={index} className="flow-step">
              <div className={`step-indicator ${step.status}`}>
                {step.status === "completed" ? "✓" : 
                 step.status === "current" ? "L" : ""}
              </div>
              <div className="step-name">{step.name}</div>
              {index < 5 && <div className="step-connector" />}
            </div>
          ))}
        </div>
      </div>

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
        <div className="search-section">
          <span style={{ fontSize: "14px", color: "#666" }}>搜索:</span>
          <input
            type="text"
            placeholder="搜索患者..."
            className="search-input"
          />
        </div>
      </div>

      {/* 表格头部 */}
      <div className="table-grid">
        <div>序號</div>
        <div>姓名</div>
        <div>用戶ID</div>
        <div>聯繫方式</div>
        <div>信箱</div>
        <div>狀態</div>
        <div>操作</div>
      </div>

      {/* 表格数据行 */}
      {patients.map((patient, index) => (
        <div key={index} className="table-grid table-row">
          <div>{String(index + 1).padStart(2, '0')}</div>
          <div>{patient.full_name || '蒋权'}</div>
          <div>{patient.test_id || '32012310010'}</div>
          <div>{patient.phone || '13022559203'}</div>
          <div>{patient.email || '1004735926@qq.com'}</div>
          <div className="status-badge">已下單</div>
          <div className="action-icon">▼</div>
        </div>
      ))}
    </div>
  );
}

export default function HospitalDashboard() {
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const { logout, userInfo } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 获取医生列表
    apiService.getDoctors().then(res => {
      if (res?.success) setDoctors(res.data || []);
    });
  }, []);

  useEffect(() => {
    // 模拟获取患者数据
    setLoading(true);
    setTimeout(() => {
      setPatientData({
        full_name: '蒋权',
        test_id: '32012310010',
        phone: '13022559203',
        email: '1004735926@qq.com',
        gender: '',
        birth_date: ''
      });
      setLoading(false);
    }, 500);
  }, []);

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

  const patients = [patientData, patientData, patientData];

  return (
    <div className="hospital-dashboard">
      <Sidebar doctors={doctors} />
      <div className="main-content">
        <div className="greeting">
          巧醫 你好
          {userInfo && (
            <span style={{ fontSize: "16px", color: "#666", marginLeft: "10px", fontWeight: "normal" }}>
              ({getRoleName(userInfo.role)} - {userInfo.full_name || userInfo.username})
            </span>
          )}
        </div>
        <div className="content-layout">
          <div className="left-panel">
            <PatientInfoCard patientData={patientData} />
            <TreatmentSummary />
            <PatientTable patients={patients} />
          </div>
          <div className="right-panel">
            <TreatmentStatus />
          </div>
        </div>
      </div>
    </div>
  );
}
