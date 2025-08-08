import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getRoleName } from "../contants/roleRoutes";
import DateSelector from "../components/date-selector";
import AppointmentCard from "../components/appointment-card";
import StatusCard from "../components/status-card";
import TreatmentFlow from "../components/treatment-flow";
import "./index.scss";

const gapSize = 16;

// 左侧导航栏组件
function Sidebar() {
  return (
    <div className="sidebar">
      <div>
        <div className="system-title">巧醫系統</div>
        
        {/* 账户列表 */}
        <div className="account-list">
          {[1, 2, 3, 4, 5].map((item, index) => (
            <div key={index} className="account-item">
              账户: 郭博士
            </div>
          ))}
        </div>
      </div>
      
      {/* 创建账户按钮 */}
      <button className="create-account-btn">
        創建帳戶
      </button>
    </div>
  );
}

// 用户信息卡片
function UserInfoCard({ userInfo }) {
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
      
      <div className="user-details">
        <div className="detail-item">
          <span className="label">账户:</span>
          <span className="value">32012310010</span>
        </div>
        <div className="detail-item">
          <span className="label">聯繫方式:</span>
          <span className="value">13022559203</span>
        </div>
        <div className="detail-item">
          <span className="label">信箱:</span>
          <span className="value">1004735926@qq.com</span>
        </div>
        <div className="detail-item">
          <span className="label">地址:</span>
          <span className="value">台南市</span>
        </div>
      </div>
    </div>
  );
}

// 患者信息卡片
function PatientInfoCard({ patientData }) {
  return (
    <div className="card patient-info-card">
      <div className="patient-header">
        <div className="patient-id">01</div>
        <div className="patient-name">蒋权</div>
        <div className="patient-user-id">用戶ID: 32012310010</div>
      </div>
      
      <div className="patient-fields">
        <div className="field-group">
          <label>性别:</label>
          <input type="text" placeholder="请输入性别" />
        </div>
        <div className="field-group">
          <label>生日:</label>
          <input type="text" placeholder="请输入生日" />
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
          <span className="value">13022559203</span>
        </div>
        <div className="field-group">
          <label>信箱:</label>
          <span className="value">1004735926@qq.com</span>
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
        {patients.map((patient, index) => (
          <div key={index} className="table-row">
            <div className="row-item sequence">{String(index + 1).padStart(2, '0')}</div>
            <div className="row-item name">蒋权</div>
            <div className="row-item user-id">用戶ID: 32012310010</div>
            <div className="row-item contact">聯繫方式: 13022559203</div>
            <div className="row-item email">信箱: 1004735926@qq.com</div>
            <div className="row-item status">
              <span className="status-badge">已下單</span>
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
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout, userInfo } = useAuth();
  const navigate = useNavigate();

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
    }, 1000);
  }, []);

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

  // 模拟患者列表数据
  const patients = [patientData, patientData, patientData];

  return (
    <div className="doctor-dashboard">
      <Sidebar />
      <div className="main-content">
        {/* 用户信息 */}
        <UserInfoCard userInfo={userInfo} />
        
        {/* 患者信息 */}
        <PatientInfoCard patientData={patientData} />

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
