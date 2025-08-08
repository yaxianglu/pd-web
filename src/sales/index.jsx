import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getRoleName } from "../contants/roleRoutes";
import DataTable from "../components/data-table";
import "./index.scss";

const gapSize = 16;

// 左侧导航栏组件
function Sidebar({ activeTab, onTabChange }) {
  return (
    <div className="sidebar">
      <div className="tab-navigation">
        <div 
          className={`tab-item ${activeTab === 'business' ? 'active' : ''}`}
          onClick={() => onTabChange('business')}
        >
          業務端
        </div>
        <div 
          className={`tab-item ${activeTab === 'doctor' ? 'active' : ''}`}
          onClick={() => onTabChange('doctor')}
        >
          醫生/診所
        </div>
      </div>
      
      {/* 账户列表 */}
      <div className="account-list">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => (
          <div key={index} className={`account-item ${index === 0 ? 'active' : ''}`}>
            账户: 郭博士
          </div>
        ))}
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

// 微笑测试表格组件
function SmileTestTable() {
  const tableData = [
    {
      id: "01",
      name: "蒋权",
      location: "台南",
      download: "壓縮包",
      status: "創建患者信息",
      subStatus: "已閱",
      detail: "詳細備註:於2025.06.30日測試,於06.30下午已聯繫患者。"
    },
    {
      id: "02",
      name: "蒋权",
      location: "台南",
      download: "壓縮包",
      status: "創建患者信息",
      subStatus: "已閱",
      detail: ""
    },
    ...Array.from({ length: 6 }).map((_, i) => ({
      id: `0${i + 3}`,
      name: "蒋权",
      location: "台南",
      download: "壓縮包",
      status: "創建患者信息",
      subStatus: "未讀",
      detail: ""
    }))
  ];

  const columns = [
    {
      title: "編號",
      key: "id"
    },
    {
      title: "患者名稱",
      key: "name"
    },
    {
      title: "IP",
      key: "location"
    },
    {
      title: "資料下載",
      key: "download",
      className: "download-link",
      render: (value) => (
        <span className="download-link">{value}</span>
      )
    },
    {
      title: "狀態",
      key: "subStatus",
      className: "status-cell",
      render: (value) => (
        <span className={`status-cell ${value === '已閱' ? 'read' : 'unread'}`}>
          {value} {value === '已閱' ? '▾' : '▸'}
        </span>
      )
    }
  ];

  return (
    <DataTable
      title="微笑測試"
      subtitle="業務ID：32012310010"
      columns={columns}
      data={tableData}
      expandable={true}
      className="smile-test-table"
    />
  );
}

// 患者列表组件
function PatientList() {
  const patients = [
    {
      id: "01",
      name: "蒋权",
      userId: "32012310010",
      gender: "",
      birthday: "",
      contact: "13022559203",
      email: "1004735926@qq.com",
      status: "已下單"
    },
    {
      id: "02",
      name: "蒋权",
      userId: "32012310010",
      gender: "",
      birthday: "",
      contact: "13022559203",
      email: "1004735926@qq.com",
      status: "已下單"
    },
    {
      id: "03",
      name: "蒋权",
      userId: "32012310010",
      gender: "",
      birthday: "",
      contact: "13022559203",
      email: "1004735926@qq.com",
      status: "已下單"
    }
  ];

  return (
    <div className="card patient-list-card">
      <div className="card-header">
        <h3>患者列表</h3>
        <div className="search-container">
          <label>搜素:</label>
          <input type="text" placeholder="搜索患者..." />
        </div>
      </div>
      
      <div className="patient-table">
        <table>
          <thead>
            <tr>
              <th>01</th>
              <th>蒋权</th>
              <th>用戶ID</th>
              <th>性别</th>
              <th>生日</th>
              <th>聯繫方式</th>
              <th>信箱</th>
              <th>狀態</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient, index) => (
              <tr key={index} className={index === 0 ? 'highlighted' : ''}>
                <td>{patient.id}</td>
                <td>{patient.name}</td>
                <td>用戶ID: {patient.userId}</td>
                <td>{patient.gender || '-'}</td>
                <td>{patient.birthday || '-'}</td>
                <td>聯繫方式: {patient.contact}</td>
                <td>信箱: {patient.email}</td>
                <td>{patient.status}</td>
                <td className="dropdown-icon">▾</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 日历组件
function Calendar() {
  const days = [
    { day: 'Mon', date: '3' },
    { day: 'Tue', date: '4' },
    { day: 'Wed', date: '5' },
    { day: 'Thu', date: '6', active: true },
    { day: 'Fri', date: '7' },
    { day: 'Sat', date: '8' },
    { day: 'Sun', date: '9' },
    { day: 'Mon', date: '10' },
    { day: 'Tue', date: '11' },
    { day: 'Wed', date: '12' }
  ];

  return (
    <div className="calendar">
      <div className="calendar-header">
        {days.map((item, index) => (
          <div key={index} className={`calendar-day ${item.active ? 'active' : ''}`}>
            <div className="day-name">{item.day}</div>
            <div className="day-date">{item.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 日程安排组件
function Schedule() {
  const appointments = [
    {
      time: "8:00-8:30 AM",
      type: "Dentist",
      doctor: "Dr. Dianne Fisher",
      clinic: "CityMed Clinic",
      icon: "🦷"
    },
    {
      time: "9:00-9:30 AM",
      type: "Neurologist",
      doctor: "Dr. Paul Collins",
      clinic: "Huston Hospital",
      icon: "🧠"
    },
    {
      time: "18:00-18:30 PM",
      type: "Digital X-Ray",
      doctor: "Dr. Betty Woods",
      clinic: "CityMed Clinic",
      icon: "📷"
    }
  ];

  return (
    <div className="schedule">
      {appointments.map((appointment, index) => (
        <div key={index} className="appointment-item">
          <div className="appointment-time">{appointment.time}</div>
          <div className="appointment-icon">{appointment.icon}</div>
          <div className="appointment-details">
            <div className="appointment-type">{appointment.type}</div>
            <div className="appointment-doctor">{appointment.doctor}</div>
            <div className="appointment-clinic">{appointment.clinic}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// 治疗概览卡片
function TreatmentOverview() {
  const cards = [
    {
      type: "blue",
      title: "牙套類型",
      value: "輕度",
      subtitle: "平均治療週期3-9個月"
    },
    {
      type: "yellow",
      title: "目前進度",
      value: "$ 付款完成",
      icon: "$"
    },
    {
      type: "red",
      title: "治療階段",
      value: "第一週"
    },
    {
      type: "orange",
      title: "付款",
      value: "創建帳單"
    }
  ];

  return (
    <div className="treatment-overview">
      {cards.map((card, index) => (
        <div key={index} className={`overview-card ${card.type}`}>
          <div className="card-title">{card.title}</div>
          <div className="card-value">
            {card.icon && <span className="card-icon">{card.icon}</span>}
            {card.value}
          </div>
          {card.subtitle && <div className="card-subtitle">{card.subtitle}</div>}
        </div>
      ))}
    </div>
  );
}

// 治疗进度时间线
function TreatmentTimeline() {
  const steps = [
    { name: "口掃完成", completed: true },
    { name: "確認治療方案", completed: true },
    { name: "付款完成", completed: true },
    { name: "生產完成", completed: false },
    { name: "治療中", completed: false },
    { name: "治療完成", completed: false }
  ];

  return (
    <div className="treatment-timeline">
      {steps.map((step, index) => (
        <div key={index} className={`timeline-step ${step.completed ? 'completed' : ''}`}>
          <div className="step-icon">
            {step.completed ? '✓' : '○'}
          </div>
          <div className="step-name">{step.name}</div>
        </div>
      ))}
    </div>
  );
}

// 医生/诊所内容组件
function DoctorClinicContent() {
  return (
    <div className="doctor-clinic-content">
      {/* 患者列表 */}
      <PatientList />
      
      {/* 治疗记录 */}
      <div className="card treatment-record-card">
        <h3>治療紀要</h3>
        
        {/* 日历 */}
        <Calendar />
        
        {/* 日程安排 */}
        <Schedule />
        
        {/* 治疗概览 */}
        <TreatmentOverview />
        
        {/* 治疗进度时间线 */}
        <TreatmentTimeline />
        
        {/* 备注区域 */}
        <div className="notes-section">
          <label>备注:</label>
          <div className="notes-actions">
            <button className="upload-btn">上傳</button>
            <button className="download-btn">下載</button>
          </div>
        </div>
      </div>
      
      {/* 底部按钮 */}
      <div className="bottom-actions">
        <button className="action-btn primary">更新并发送患者资料卡</button>
        <button className="action-btn secondary">創建患者資料卡</button>
      </div>
    </div>
  );
}

export default function SalesDashboard() {
  const [activeTab, setActiveTab] = useState('business');
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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

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
    <div className="sales-dashboard">
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
      <div className="main-content">
        {/* 用户信息 */}
        <UserInfoCard userInfo={userInfo} />
        
        {/* 根据选中的tab显示不同内容 */}
        {activeTab === 'business' ? (
          <>
            {/* 患者信息 */}
            <PatientInfoCard patientData={patientData} />
            
            {/* 微笑测试表格 */}
            <SmileTestTable />
          </>
        ) : (
          <DoctorClinicContent />
        )}
      </div>
    </div>
  );
} 