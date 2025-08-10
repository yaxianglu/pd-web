import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getRoleName } from "../contants/roleRoutes";
import DateSelector from "../components/date-selector";
import AppointmentCard from "../components/appointment-card";
import StatusCard from "../components/status-card";
import TreatmentFlow from "../components/treatment-flow";
import apiService from "../services/api";
import PatientInfoList from "./list";
import Logout from "../components/logout/index";
import "./index.scss";

const gapSize = 16;


// 用户信息卡片
function UserInfoCard({ userInfo }) {
  const account = userInfo?.user_id || "—";
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
      <Logout style={{ marginLeft: 12 }}>退出登录</Logout>

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

  return (
    <div className="doctor-dashboard">
      <div className="main-content">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        </div>
        {/* 用户信息 */}
        <UserInfoCard userInfo={userInfo} />
        {/* 患者列表 */}
        <PatientInfoList patients={patients} />
      </div>
    </div>
  );
}
