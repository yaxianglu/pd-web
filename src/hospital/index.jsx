import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { cardTitleSizeStyle, cardPaddingStyle } from "../contants";
import { getRoleName } from "../contants/roleRoutes";
import ContactInfo from "../components/contact-info";
import InfoCardComponent from "../components/info-card";
import apiService from "../services/api";
import DoctorDashboard from "../doctor";
import "./index.scss";

const gapSize = 16;

// 左侧导航栏组件
function Sidebar({ doctors = [], onSelect, activeUuid }) {
  return (
    <div className="sidebar">
      <div>
        <div className="system-title">巧醫系統</div>
        <div className="account-list">
          {doctors.map((doc) => (
            <div key={doc.uuid} className="account-item" onClick={() => onSelect(doc)} style={{ background: activeUuid === doc.uuid ? 'rgba(255,255,255,.2)' : undefined }}>
              醫師: {doc.full_name || doc.username}
            </div>
          ))}
        </div>
      </div>
      <button className="create-account-btn">創建帳戶</button>
    </div>
  );
}

export default function HospitalDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [activeDoctor, setActiveDoctor] = useState(null);
  const [patientsByDoctor, setPatientsByDoctor] = useState([]);
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    apiService.getDoctors().then(res => {
      if (res?.success) {
        setDoctors(res.data || []);
        const first = (res.data || [])[0];
        if (first) setActiveDoctor(first);
      }
    });
  }, []);

  useEffect(() => {
    if (!activeDoctor?.uuid) return;
    apiService.getPatientsByDoctor({ uuid: activeDoctor.uuid }).then(res => {
      if (res?.success) setPatientsByDoctor(res.data || []);
      else setPatientsByDoctor([]);
    });
  }, [activeDoctor?.uuid]);

  return (
    <div className="hospital-dashboard">
      <Sidebar doctors={doctors} onSelect={setActiveDoctor} activeUuid={activeDoctor?.uuid} />
      <div className="hospital-main-content">
        {activeDoctor ? (
          <DoctorDashboard initialPatients={patientsByDoctor} doctorUser={activeDoctor} />
        ) : (
          <div>正在載入醫師資料...</div>
        )}
      </div>
    </div>
  );
}
