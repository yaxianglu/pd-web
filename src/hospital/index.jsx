import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiService from "../services/api";
import DoctorDashboard from "../doctor";
import "./index.scss";
import Logout from "../components/logout";

// 左侧导航栏组件
function Sidebar({ doctors = [], onSelect, activeUuid }) {
  return (
    <div className="sidebar">
      <div>
        <div className="account-list">
          {doctors.map((doc) => (
            <div
              key={doc.uuid}
              className={`account-item ${activeUuid === doc.uuid ? 'active' : ''}`}
              onClick={() => onSelect(doc)}
            >
              {doc.full_name || doc.username}
            </div>
          ))}
        </div>
      </div>
      <div>
        <Logout />
      </div>
    </div>
  );
}

export default function HospitalDashboard({ isSub }) {
  const [doctors, setDoctors] = useState([]);
  const [activeDoctor, setActiveDoctor] = useState(null);
  const [patientsByDoctor, setPatientsByDoctor] = useState([]);
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  // 刷新当前医生的患者数据
  const refreshPatients = () => {
    if (!activeDoctor?.uuid) return;
    apiService.getPatientsByDoctor({ uuid: activeDoctor.uuid }).then(res => {
      console.info('refreshed patients', res);
      if (res?.success) setPatientsByDoctor(res.data || []);
      else setPatientsByDoctor([]);
    });
  };

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
      console.info('res', res);
      if (res?.success) setPatientsByDoctor(res.data || []);
      else setPatientsByDoctor([]);
    });
  }, [activeDoctor?.uuid]);

  return (
    <div className="hospital-dashboard">
      <Sidebar
        doctors={doctors}
        onSelect={setActiveDoctor}
        activeUuid={activeDoctor?.uuid}
      />
      <div className="hospital-main-content">
        {/* {isSub ? null : (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Logout />
          </div>
        )} */}
        {activeDoctor ? (
          <DoctorDashboard 
            style={{ height: 'calc(100vh - 40px)' }} 
            initialPatients={patientsByDoctor} 
            doctorUser={activeDoctor}
            onRefreshPatients={refreshPatients}
          />
        ) : (
          <div>正在載入醫師資料...</div>
        )}
      </div>


    </div>
  );
}
