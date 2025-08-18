import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProgressTracker, { l } from "../components/progress";
import { cardTitleSizeStyle } from "../contants";
import ContactInfo from "../components/contact-info";
import InfoCardComponent from "../components/info-card";
import apiService from "../services/api";
import p1 from './imgs/1.png';
import p2 from './imgs/2.png';
import p3 from './imgs/3.png';
import p4 from './imgs/4.png';
import p5 from './imgs/5.png';
import p6 from './imgs/6.png';
// import png13 from "../asserts/13.png";
import ScheduleCard from "../components/schedule-card";
import Logout from "../components/logout";
import { message } from "antd";
const list = {
  1: p1,
  2: p2,
  3: p3,
  4: p4,
  5: p5,
  6: p6,
};

const gapSize = 16;

function InfoCard({ patientData, doctor, patientInfo, clinic, isInput = false, currentStepFromProgress }) {
  console.info("patientInfo", patientInfo)
  return (
    <div style={{ background: "#fff", borderRadius: "18px", padding: "30px", boxSizing: "border-box", marginBottom: gapSize, flex: 3 }}>
      {
        isInput ? null : (
          <>
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
          </>
        )
      }
      <InfoCardComponent 
        doctorName={doctor?.full_name}
        clinicAddress={clinic?.address}
        contact={doctor?.phone || clinic?.phone || patientData?.phone}
        treatmentProgress={currentStepFromProgress}
        hobbies={Number(patientInfo?.hobbies || '')}
        onUpdate={(updateId) => {
          apiService.updatePatientHobbies(patientInfo?.uuid, updateId).then(res => {
            if (res.success) {
              message.success('更新成功');
            } else {
              message.error(res.message);
            }
          });
        }}
      />
    </div>
  );
}


function PlanConfirmCard({ currentStepFromProgress, patientData }) {
  // const ddd = l[currentStepFromProgress] || {};
  const hobbies = patientData?.hobbies || '';
  return (
    <div style={{
      background: "#fff", borderRadius: "18px",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", marginBottom: gapSize,
      flex: 1,
    }}>
      {
        hobbies ? (
          <div style={{ width: '100%', height: '100%' }}>
            <img style={{ width: '100%', borderRadius: 20 }} src={list[Number(hobbies)]} alt=""/>
          </div>
        ) : <span style={{ lineHeight: 1.3 }}>請選擇<br/>治療方案</span>
      }
      {/* {ddd.icon && <img src={ddd.icon} alt="icon" style={{ width: 108 }} />}
      <div style={{ marginTop: 20 }}>
        <button style={{
          background: "#48d2ce", color: "#fff",
          border: "none", borderRadius: "18px",
          padding: "13px 44px", fontSize: 14,
          fontWeight: 600, letterSpacing: 1.1, cursor: "pointer"
        }}>
          {ddd.title}
        </button>
      </div> */}
    </div>
  );
}

// 旧的周历与列表 UI 已被统一替换为 components/schedule-card

export default function Dashboard({ prefetched = null }) {
  const [patientData, setPatientData] = useState(null); // smileTest
  const [patientInfo, setPatientInfo] = useState(null); // patient
  const [doctorData, setDoctorData] = useState(null);
  const [clinicData, setClinicData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout } = useAuth(); // eslint-disable-line no-unused-vars
  const navigate = useNavigate(); // eslint-disable-line no-unused-vars
  const isInput = !!prefetched;

  // 進度數字(0-6) → 步驟(0-6)
  const mapProgressToStep = (progress) => {
    const p = Number(progress || 0);
    return Math.max(0, Math.min(6, p));
  };

  useEffect(() => {
    // 如果外部已传入数据，直接使用
    if (prefetched) {
      setPatientData(prefetched.smileTest || prefetched);
      setDoctorData(prefetched.doctor || null);
      setClinicData(prefetched.clinic || null);
      setPatientInfo(prefetched.patient || null);
      setLoading(false);
      return;
    }

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
  }, [prefetched]);

  if (loading) {
    return (
      <div style={{
        width: "100%",
        minHeight: "200px",
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
        width: "100%",
        minHeight: "200px",
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
      </div>
    );
  }

  const currentStepFromProgress = mapProgressToStep((patientInfo || {}).treatment_progress);

  // Mock events for calendar — 模拟与截图类似的两天多条记录（8号、15号）
  const monthBase = dayjs().startOf('month');
  const mockEvents = [
    { id: "w8", date: monthBase.date(8).toISOString(), title: "This is warning.", status: "warning" },
    { id: "s8", date: monthBase.date(8).toISOString(), title: "This is usual.", status: "success" },
    { id: "w15", date: monthBase.date(15).toISOString(), title: "This is warning.", status: "warning" },
    { id: "v15", date: monthBase.date(15).toISOString(), title: "This is very usual.", status: "success" },
    { id: "e15", date: monthBase.date(15).toISOString(), title: "This is error.", status: "error" },
  ];

  return (
    <div style={{
      width: "100%",
      background: "#f6f6f7",
      padding: gapSize,
      boxSizing: "border-box"
    }}>
      <div style={{ display: "flex", gap: gapSize, alignItems: "flex-start" }}>
        <div style={{ flex: 2 }}>
          <div style={{ display: "flex", gap: gapSize }}>
            <InfoCard patientData={patientData} patientInfo={patientInfo} doctor={doctorData} clinic={clinicData} isInput={isInput} currentStepFromProgress={currentStepFromProgress} />
            <PlanConfirmCard currentStepFromProgress={currentStepFromProgress || 0} patientData={patientInfo}/>
          </div>
          <ProgressTracker
            currentStep={currentStepFromProgress} uuid={(patientInfo || {}).uuid}
            onUpdate={(next_progress) => {
              setPatientInfo((prev) => ({ ...(prev || {}), treatment_progress: next_progress || 0 }));
            }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <ScheduleCard
            title="治療日誌"
            initialEvents={mockEvents}
            defaultMonth={dayjs().startOf('month')}
            currentPatient={{ uuid: (patientInfo || {}).uuid, full_name: (patientInfo || {}).full_name }}
            smileTestUuid={(patientData || {}).uuid}
            onAppointmentCreated={async () => {
              // 预约创建成功后，将“等待預約”切换为“預約完成”
              // ProgressTracker 的 currentStep 显示由 mapProgressToStep 控制；
              // 这里简单把本地 patientInfo 的 progress 推到至少 1
              setPatientInfo((prev) => ({ ...(prev || {}), treatment_progress: Math.max(1, (prev?.treatment_progress || 0)) }));
              // 同步落庫，刷新後也保持“預約完成”
              try {
                const puid = (patientInfo || {}).uuid;
                if (puid) {
                  await apiService.updatePatientProgress(puid, 1);
                }
              } catch {}
            }}
          />
        </div>
      </div>
      <div style={{ position: "fixed", bottom: "20px", left: "50%", transform: "translateX(-50%)", zIndex: 10 }}>
      </div>
    </div>
  );
}
