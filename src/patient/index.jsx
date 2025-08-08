import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProgressTracker from "../components/progress";
import { cardTitleSizeStyle, cardPaddingStyle } from "../contants";
import ContactInfo from "../components/contact-info";
import InfoCardComponent from "../components/info-card";
import apiService from "../services/api";
import png13 from "../asserts/13.png";

const gapSize = 16;

function InfoCard({ patientData }) {
  return (
    <div style={{ background: "#fff", borderRadius: "18px", padding: "30px", boxSizing: "border-box", marginBottom: gapSize }}>
      <div style={{ ...cardTitleSizeStyle }}>
        {patientData?.full_name || '患者'}　您好
      </div>
      <ContactInfo 
        id={patientData?.test_id || 'N/A'} 
        phone={patientData?.phone || 'N/A'} 
        email={patientData?.email || 'N/A'} 
      />
      <hr style={{ border: "none", borderTop: "1.5px solid #e3eaf0", margin: "18px 0" }} />
      <InfoCardComponent />
    </div>
  );
}


function PlanConfirmCard() {
  return (
    <div style={{
      background: "#fff", borderRadius: "18px",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", marginBottom: gapSize,
      flex: 1,
    }}>
      <svg width="108" height="108" fill="none">
        <rect x="14" y="20" width="80" height="62" rx="16" stroke="#48d2ce" strokeWidth="4" fill="#fff"/>
        <rect x="27" y="27" width="54" height="7" rx="3.5" fill="#aef4ec"/>
        <rect x="27" y="39" width="54" height="7" rx="3.5" fill="#aef4ec"/>
        <rect x="27" y="51" width="33" height="7" rx="3.5" fill="#aef4ec"/>
        <circle cx="80" cy="69" r="15" stroke="#48d2ce" strokeWidth="3" fill="#fff"/>
        <path d="M73 69l5 5 10-10" stroke="#48d2ce" strokeWidth="2.5" fill="none"/>
      </svg>
      <div style={{ marginTop: 20 }}>
        <button style={{
          background: "#48d2ce", color: "#fff",
          border: "none", borderRadius: "18px",
          padding: "13px 44px", fontSize: 14,
          fontWeight: 600, letterSpacing: 1.1, cursor: "pointer"
        }}>
          已確認治療方案
        </button>
      </div>
    </div>
  );
}

function ScheduleCard() {
  return (
    <div style={{
      background: "#fff", borderRadius: "18px", height: "97%",
      minWidth: 367, boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "space-between",
      ...cardPaddingStyle,
    }}>
      <div>
        <div style={{ ...cardTitleSizeStyle, marginBottom: 10 }}>治療日誌</div>
        {/* 周历 */}
        <div style={{ display: "flex", gap: gapSize, alignItems:"center", marginBottom: 15 }}>
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"].map((d, i) => (
            <div key={d+i} style={{
              textAlign: "center", fontSize: 15, width: 32, color: i === 3 ? "#fff" : "#666",
              fontWeight: i === 3 ? "bold" : "normal",
              background: i === 3 ? "#f19b43" : "none",
              borderRadius: i === 3 ? "14px" : 0,
              padding: i === 3 ? "5px 0" : "8px 0 0"
            }}>
              <div style={{ fontSize: 15, marginBottom: 4 }}>{d}</div>
              <div style={{ fontSize: 20, fontWeight: 500 }}>{3+i}</div>
            </div>
          ))}
        </div>
        {/* 日程列表 */}
        <div style={{margin:"8px 0 20px 0"}}>
          <TimeItem
            color="#ffe7cf"
            icon="🦷"
            title="Dentist"
            doctor="Dr. Dianne Fisher"
            org="CityMed Clinic"
            time="8:00 - 8:30"
          />
          <TimeItem
            color="#dbf6f6"
            icon="🧠"
            title="Neurologist"
            doctor="Dr. Paul Collins"
            org="Huston Hospital"
            time="9:00 - 9:30"
          />
          <TimeItem
            color="#fdebf3"
            icon="💻"
            title="Digital X-Ray"
            doctor="Dr. Betty Woods"
            org="CityMed Clinic"
            time="18:00 - 18:30"
          />
        </div>
      </div>
      {/* 二维码、上传下载 */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:"18px"}}>
        <div style={{ width: "120px", height: "120px", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* 用于二维码占位 */}
          <img src={png13} alt="QR" style={{width: 100, height:100}} />
        </div>
        <div>
          <button style={{
            width: 68,
            background: "#fff",
            border: "1.6px solid #e3eae8",
            color: "#888",
            fontWeight: "bold",
            fontSize: 18,
            borderRadius: 12,
            padding: "7px 0",
            marginBottom: 16,
            cursor: "pointer"
          }}>上傳</button>
          <br />
          <button style={{
            width: 68,
            background: "#fff",
            border: "1.6px solid #e3eae8",
            color: "#888",
            fontWeight: "bold",
            fontSize: 18,
            borderRadius: 12,
            padding: "7px 0",
            cursor: "pointer"
          }}>下載</button>
        </div>
      </div>
    </div>
  );
}

function TimeItem({ color, icon, title, doctor, org, time }) {
  return (
    <div style={{
      minHeight: 53, borderRadius: 14, background: color, marginBottom: 10, display: "flex",
      alignItems: "center", padding: "0 16px", fontSize: 16, fontWeight: 500, justifyContent: "space-between"
    }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ fontSize: 27, marginRight: 12 }}>{icon}</span>
        <div>
          <div style={{ fontWeight: 600 }}>{title}</div>
          <div style={{ fontSize: 14, color: "#636476", fontWeight: 400 }}>{doctor}</div>
        </div>
      </div>
      <div style={{ fontSize: 13, color: "#A0A0A9", flex: 1, textAlign: "right" }}>{org}</div>
      <div style={{
        marginLeft: 14,
        fontSize: 15,
        color: "#6d6e7a",
        minWidth: 100,
        whiteSpace: "nowrap"
      }}>{time}</div>
      <div style={{
        fontSize: 26,
        marginLeft: 8,
        color: "#bbb"
      }}>…</div>
    </div>
  );
}

export default function Dashboard() {
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 从sessionStorage获取UUID
    const uuid = sessionStorage.getItem('patient_uuid');
    
    if (uuid) {
      setLoading(true);
      apiService.getSmileTestByUuid(uuid)
        .then(response => {
          if (response.success) {
            setPatientData(response.data);
          } else {
            setError(response.message || '获取患者数据失败');
          }
        })
        .catch(error => {
          console.error("Error fetching patient data:", error);
          setError('网络错误，请稍后重试');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setError('未找到患者信息，请重新登录');
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div style={{
        width: "100vw",
        minHeight: "100vh",
        background: "#f6f6f7",
        padding: gapSize,
        boxSizing: "border-box",
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
        minHeight: "100vh",
        background: "#f6f6f7",
        padding: gapSize,
        boxSizing: "border-box",
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
    <div style={{
      width: "100vw",
      minHeight: "100vh",
      background: "#f6f6f7",
      padding: gapSize,
      boxSizing: "border-box"
    }}>
      <div style={{ display: "flex", gap: gapSize, alignItems: "flex-start" }}>
        <div style={{ flex: 2 }}>
          <div style={{ display: "flex", gap: gapSize }}>
            <InfoCard patientData={patientData} />
            <PlanConfirmCard />
          </div>
          <ProgressTracker currentStep={3} title="等待確認支付" />
        </div>
        <div style={{ flex: 1 }}>
          <ScheduleCard />
        </div>
      </div>
      <div style={{
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 10,
      }}>
      </div>
    </div>
  );
}
