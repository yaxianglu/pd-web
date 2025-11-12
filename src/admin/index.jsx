import React, { useState, useEffect, useCallback } from "react";
import { Tabs, Modal, Select, message } from "antd";
import Logout from "../components/logout";
import Partners from "../partners";
import HospitalDashboard from "../hospital";
import ClinicDashboard from "../clinic";
import AccountManagement from "./account-management";
import HistoryModal from "../components/history-modal";
import apiService from "../services/api";
import "../market/index.scss";

// const gapSize = 16;

// 顶部 Tab 与市场页面统一风格
function HeaderTabs({ activeKey, onChange, userRole }) {
  // 根据用户角色显示相应的标签页
  const getTabItems = () => {
    const baseTabs = [
      { key: 'smile', label: '微笑測試' },
      { key: 'partners', label: '成為夥伴' }
    ];

    // 管理員可以管理所有賬戶
    if (userRole === 'admin' || userRole === 'super_admin') {
      baseTabs.push(
        { key: 'doctors', label: '醫生' },
        { key: 'clinics', label: '診所' },
        { key: 'accounts', label: '賬戶管理' }
      );
    }
    // 業務可以管理診所、醫生、患者
    else if (userRole === 'market') {
      baseTabs.push(
        { key: 'doctors', label: '醫生' },
        { key: 'clinics', label: '診所' },
        { key: 'accounts', label: '賬戶管理' }
      );
    }
    // 醫生只能管理患者
    else if (userRole === 'doctor') {
      baseTabs.push(
        { key: 'accounts', label: '患者管理' }
      );
    }

    return baseTabs;
  };

  return (
    <div className="market-header">
      <div className="title" style={{ width: '100%' }}>
        <Tabs
          items={getTabItems()}
          activeKey={activeKey}
          onChange={onChange}
        />
      </div>
      <div className="biz-id"><Logout /></div>
    </div>
  );
}

// Admin 内的微笑測試視圖（與 market 一致的資料與交互，僅移除內部頁面 Tab）
function AdminSmileView() {
  const [expanded, setExpanded] = useState({});
  const [items, setItems] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorUuid, setSelectedDoctorUuid] = useState('');
  const [targetSmileUuid, setTargetSmileUuid] = useState('');
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedSmileUuid, setSelectedSmileUuid] = useState('');

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      const res = await apiService.getAllSmileTests();
      if (isMounted) {
        if (res?.success && Array.isArray(res.data)) {
          // 过滤掉 patient_uuid 有值的记录
          const filteredData = res.data.filter((s) => !s.patient_uuid);
          const mapped = filteredData.map((s, idx) => ({
            ...s,
            id: String(idx + 1).padStart(2, '0'),
            patientName: s.full_name || '—',
            phone: s.phone || '—',
            email: s.email || '—',
            lineId: s.line_id || '—',
            region: s.city || '—',
            downloadUrl: '#',
            considerations: s.considerations || '',
            statusText: s?.patient_uuid ? s?.uuid : '創建患者信息',
            smileUuid: s.uuid,
            createdAt: s.created_at ? new Date(s.created_at).toLocaleString('zh-TW') : '—',
          }));
          setItems(mapped);
        } else {
          setItems([]);
        }
      }
    };
    load();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    apiService.getDoctorsWithClinic().then((res) => {
      if (res?.success) setDoctors(res.data || []);
    });
  }, []);

  const openBindPatientModal = (smileTestUuid) => {
    setTargetSmileUuid(smileTestUuid);
    setCreateOpen(true);
  };

  const openHistoryModal = (smileUuid) => {
    setSelectedSmileUuid(smileUuid);
    setHistoryModalOpen(true);
  };

  const onToggle = useCallback((rowId) => {
    setExpanded((prev) => ({ ...prev, [rowId]: !prev[rowId] }));
  }, []);


  return (
    <>
      <div className="table">
        <div className="thead">
          <div className="th seq">編號</div>
          <div className="th name">患者名稱</div>
          <div className="th phone">手機號碼</div>
          <div className="th email">電子信箱</div>
          <div className="th line_id">Line ID</div>
          <div className="th region">地址</div>
          <div className="th created_at">創建時間</div>
          <div className="th download">資料下載</div>
          <div className="th status">患者卡</div>
          <div className="th caret" />
        </div>

        <div className="tbody">
          {items.map((row) => {
            const isOpen = !!expanded[row.id];
            return (
              <div key={row.id} className={`tr ${isOpen ? 'open' : ''}`}>
                <div className="row-main">
                  <div className="td seq">{row.id}</div>
                  <div className="td name">{row.patientName || '—'}</div>
                  <div className="td phone">{row.phone || '—'}</div>
                  <div className="td email">{row.email || '—'}</div>
                  <div className="td line_id">{row.lineId || '—'}</div>
                  <div className="td region">{row.region || '—'}</div>
                  <div className="td created_at">{row.createdAt || '—'}</div>
                  <div className="td download">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); openHistoryModal(row.smileUuid); }}
                      className="link"
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: '12px' }}
                    >歷史資料</button>
                  </div>
                  <div className="td status">
                    {row.statusText === '創建患者信息' ? (
                      <button className="create-patient-info-button" onClick={(e) => { e.stopPropagation(); openBindPatientModal(row.smileUuid); }}>創建患者信息</button>
                    ) : (
                      row.statusText
                    )}
                  </div>
                  <div className="td caret" onClick={() => onToggle(row.id)}>
                    <span className={`arrow ${isOpen ? 'up' : 'down'}`}>▾</span>
                  </div>
                </div>
                {isOpen && (
                  <div className="row-expand" onClick={(e) => e.stopPropagation()}>

<div className="user-note-section">
                        <div className="note-label" style={{ textAlign: 'left', marginBottom: 8, fontSize: 14 }}>用戶備註：{row.improvement_points || '—'}</div>
                      </div>
                    <textarea
                      className="note-input"
                      placeholder="備註"
                      defaultValue={row.considerations || ''}
                      onBlur={async (e) => {
                        const text = e.target.value || '';
                        if (!row.smileUuid) return;
                        const r = await apiService.updateSmileTestBio(row.smileUuid, text);
                        if (r?.success) {
                          message.success('已保存');
                          setItems((prev) => prev.map(it => it.id === row.id ? { ...it, considerations: text } : it));
                        } else {
                          message.error(r?.message || '保存失敗');
                        }
                      }}
                      rows={3}
                      style={{ width: '100%' }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Modal
        title="綁定醫師並創建患者"
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        onOk={async () => {
          if (!selectedDoctorUuid) { message.error('請選擇醫師'); return; }
          if (!targetSmileUuid) { message.error('未選擇目標記錄'); return; }
          const detail = await apiService.getSmileTestByUuid(targetSmileUuid);
          if (!detail?.success || !detail.data?.smileTest) { message.error('獲取記錄失敗'); return; }
          const res = await apiService.bindExistingSmileTest({ smile_uuid: targetSmileUuid, assigned_doctor_uuid: selectedDoctorUuid });
          if (res?.success) {
            message.success('創建成功');
            setCreateOpen(false); setSelectedDoctorUuid('');
            const again = await apiService.getAllSmileTests();
            if (again?.success && Array.isArray(again.data)) {
              const mapped = again.data.map((s, idx) => ({
                id: String(idx + 1).padStart(2, '0'),
                patientName: s.full_name || '—',
                phone: s.phone || '—',
                email: s.email || '—',
                lineId: s.line_id || '—',
                region: s.city || '—',
                downloadUrl: '#',
                note: '',
                statusText: s?.patient_uuid ? s?.uuid : '創建患者信息',
                smileUuid: s.uuid,
                createdAt: s.created_at ? new Date(s.created_at).toLocaleString('zh-TW') : '—',
              }));
              setItems(mapped);
            }
          } else {
            message.error(res?.message || '創建失敗');
          }
        }}
        okText="保存"
        cancelText="取消"
      >
        <div>
          <div style={{ marginBottom: 8 }}>選擇醫師</div>
          <Select
            style={{ width: '100%' }}
            placeholder="選擇醫師"
            value={selectedDoctorUuid || undefined}
            onChange={(v) => setSelectedDoctorUuid(v)}
            options={(doctors || []).map(d => ({ value: d.uuid, label: `${d.full_name || d.username || '—'}${d.clinic ? `（${d.clinic.clinic_name}）` : ''}` }))}
          />
        </div>
      </Modal>

      {/* 历史资料模态框 */}
      <HistoryModal
        open={historyModalOpen}
        onCancel={() => setHistoryModalOpen(false)}
        smileTestUuid={selectedSmileUuid}
        userType="admin" // admin路由使用admin权限，显示所有文件类型
      />
    </>
  );
}
// 用户信息卡片
// 旧信息卡片暂不展示，改为顶部登出

// 微笑测试表格组件（未使用）
function SmileTestTable() {
  return (
    <div className="table">
      <div className="thead">
        <div className="th seq">編號</div>
        <div className="th name">患者名稱</div>
        <div className="th phone">IP</div>
        <div className="th status">狀態</div>
      </div>
      <div className="tbody">
        {Array.from({ length: 5 }).map((_, i) => (
          <div className="tr" key={i}>
            <div className="row-main">
              <div className="td seq">0{i + 1}</div>
              <div className="td name">蒋权</div>
              <div className="td phone">台南</div>
              <div className="td status">—</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-unused-vars */
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
      
      <div className="create-patient-btn">
        <button className="action-btn">創建患者資料卡</button>
      </div>
    </div>
  );
}

// 日历组件（未使用）
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

// 日程安排组件（未使用）
function Schedule() {
  const appointments = [
    {
      time: "8:00-8:30 AM",
      type: "Dentist",
      doctor: "Dr. Dianne Fisher",
      clinic: "CityMed Clinic",
      icon: "🦷",
      color: "#ffe7cf"
    },
    {
      time: "9:00-9:30 AM",
      type: "Neurologist",
      doctor: "Dr. Paul Collins",
      clinic: "Huston Hospital",
      icon: "🧠",
      color: "#dbf6f6"
    },
    {
      time: "18:00-18:30 PM",
      type: "Digital X-Ray",
      doctor: "Dr. Betty Woods",
      clinic: "CityMed Clinic",
      icon: "📷",
      color: "#fdebf3"
    }
  ];

  return (
    <div className="schedule">
      {appointments.map((appointment, index) => (
        <div key={index} className="appointment-item" style={{ backgroundColor: appointment.color }}>
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

// 治疗概览卡片（未使用）
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
      value: "付款完成",
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

// 治疗进度時間线（未使用）
function TreatmentTimeline() {
  const steps = [
    { name: "預約完成", completed: true },
    { name: "確認方案", completed: true },
    { name: "付款完成", completed: true },
    { name: "生產完成", completed: true },
    { name: "治療中", completed: true },
    { name: "治療完成", completed: true }
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

// 業務端内容组件（未使用）
function BusinessContent() { return null; }

    // 醫生/診所內容組件
    // 舊醫生內容不再使用

export default function AdminDashboard() {
  const [active, setActive] = useState('smile');
  const [userRole, setUserRole] = useState(null);

  // 获取当前用户信息
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
    setUserRole(userInfo.role);
    
    // 根据用户角色设置默认标签页
    if (userInfo.role === 'doctor') {
      setActive('accounts');
    }
  }, []);

  return (
    <div className="market-dashboard" style={{ height: '100%' }}>
      <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <HeaderTabs activeKey={active} onChange={setActive} userRole={userRole} />
        {active === 'smile' && <AdminSmileView />}
        {active === 'partners' && <Partners />}
        {active === 'doctors' && <HospitalDashboard isSub={true}/>}
        {active === 'clinics' && <ClinicDashboard />}
        {active === 'accounts' && <AccountManagement />}
      </div>
    </div>
  );
}