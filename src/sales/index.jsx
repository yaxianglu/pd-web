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
          <div key={index} className="account-item">
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
      detail: "於2025.06.30日測試,於06.30下午已聯繫患者。"
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
      title: "對應",
      key: "status"
    },
    {
      title: "狀態",
      key: "subStatus",
      className: "status-cell",
      render: (value) => (
        <span className={`status-cell ${value === '已閱' ? 'read' : 'unread'}`}>
          {value}
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

// 医生/诊所内容组件
function DoctorClinicContent() {
  return (
    <div className="doctor-clinic-content">
      <div className="content-header">
        <h2>醫生/診所管理</h2>
        <p>这里是医生和诊所的管理界面</p>
      </div>
      
      <div className="content-body">
        <div className="info-card">
          <h3>功能说明</h3>
          <ul>
            <li>医生账户管理</li>
            <li>诊所信息维护</li>
            <li>患者分配</li>
            <li>治疗进度跟踪</li>
          </ul>
        </div>
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