import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProgressTracker, { l } from "../components/progress";
import { cardTitleSizeStyle, cardPaddingStyle } from "../contants";
import ContactInfo from "../components/contact-info";
import InfoCardComponent from "../components/info-card";
import apiService from "../services/api";
import png13 from "../asserts/13.png";
import Logout from "../components/logout";

const gapSize = 16;

function InfoCard({ patientData, doctor, clinic }) {
  return (
    <div style={{ background: "#fff", borderRadius: "18px", padding: "30px", boxSizing: "border-box", marginBottom: gapSize, flex: 3, overflow: 'hidden' }}>
      <div style={{ ...cardTitleSizeStyle }}>
        {patientData?.full_name || '患者'}　您好 <Logout style={{ float: 'right' }}>退出登录</Logout>
      </div>
      <ContactInfo 
        list={[
          {
            label: '用戶ID',
            value: patientData?.uuid || 'N/A'
          },
          {
            label: '聯繫方式',
            value: patientData?.phone || 'N/A'
          },
          {
            label: '信箱',
            value: patientData?.email || 'N/A'
          }
        ]}
      />
      <hr style={{ border: "none", borderTop: "1.5px solid #e3eaf0", margin: "18px 0" }} />
      <InfoCardComponent 
        doctorName={doctor?.full_name}
        clinicAddress={clinic?.address}
        contact={doctor?.phone || clinic?.phone || patientData?.phone}
        treatmentProgress={patientData?.treatment_progress || 0}
        hobbies={patientData?.hobbies || ''}
      />
    </div>
  );
}


function PlanConfirmCard({ currentStepFromProgress }) {
  const ddd = l[currentStepFromProgress] || {};
  return (
    <div style={{
      background: "#fff", borderRadius: "18px",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", marginBottom: gapSize,
      flex: 1,
    }}>
      {ddd.icon && <img src={ddd.icon} alt="icon" style={{ width: 108 }} />}
      <div style={{ marginTop: 20 }}>
        <button style={{
          background: "#48d2ce", color: "#fff",
          border: "none", borderRadius: "18px",
          padding: "13px 44px", fontSize: 14,
          fontWeight: 600, letterSpacing: 1.1, cursor: "pointer"
        }}>
          {ddd.title}
        </button>
      </div>
    </div>
  );
}

function ScheduleCard({ images = [] }) {
  const downloadBase64Image = (data, filename) => {
    if (!data) return;
    try {
      const hasHeader = typeof data === 'string' && data.startsWith('data:');
      const dataUrl = hasHeader ? data : `data:image/jpeg;base64,${data}`;
      const [header, body] = dataUrl.split(',');
      const mimeMatch = header.match(/data:(.*?);/);
      const mime = (mimeMatch && mimeMatch[1]) || 'image/jpeg';
      const binary = atob(body);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.warn('Download failed:', e);
    }
  };

  const handleDownloadAll = () => {
    const list = Array.isArray(images) ? images : [];
    list.forEach((img, idx) => {
      if (img) downloadBase64Image(img, `teeth_image_${idx + 1}.jpg`);
    });
  };

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
          }} onClick={handleDownloadAll}>下載</button>
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
  const [patientData, setPatientData] = useState(null); // smileTest
  const [patientInfo, setPatientInfo] = useState(null); // patient
  const [doctorData, setDoctorData] = useState(null);
  const [clinicData, setClinicData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // 百分比(0-100) → 步骤(1-6)
  const mapProgressToStep = (progress) => {
    return progress || 0;
  };

  useEffect(() => {
    // 从sessionStorage获取UUID
    const uuid = sessionStorage.getItem('patient_uuid');
    
    if (uuid) {
      setLoading(true);
      apiService.getSmileTestByUuid(uuid)
        .then(response => {
          if (response.success) {
            const smileTestData = (response && response.data && response.data.smileTest) ? response.data.smileTest : (response && response.data ? response.data : null);
            setPatientData(smileTestData);
            setDoctorData(response && response.data ? response.data.doctor || null : null);
            setClinicData(response && response.data ? response.data.clinic || null : null);
            setPatientInfo(response && response.data ? response.data.patient || null : null);
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

  const currentStepFromProgress = mapProgressToStep(patientInfo?.treatment_progress);

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
            <InfoCard patientData={patientData} doctor={doctorData} clinic={clinicData} />
            <PlanConfirmCard currentStepFromProgress={currentStepFromProgress || 0} />
          </div>
          <ProgressTracker currentStep={currentStepFromProgress} />
        </div>
        <div style={{ flex: 1 }}>
          <ScheduleCard images={[patientData?.teeth_image_1, patientData?.teeth_image_2, patientData?.teeth_image_3, patientData?.teeth_image_4]} />
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
