import React, { useState, useEffect, useCallback } from "react";
import { Tabs, Modal, Select, message } from "antd";
import Logout from "../components/logout";
import Partners from "../partners";
import HospitalDashboard from "../hospital";
import ClinicDashboard from "../clinic";
import AccountManagement from "./account-management";
import HistoryModal from "../components/history-modal";
import apiService from "../services/api";
import { useLanguage } from "../context/LanguageContext";
import "../market/index.scss";

// const gapSize = 16;

// 顶部 Tab 与市场页面统一风格
function HeaderTabs({ activeKey, onChange, userRole }) {
  const { t } = useLanguage();
  // 根据用户角色显示相应的标签页
  const getTabItems = () => {
    const baseTabs = [
      { key: 'smile', label: t('admin.tabs.smileTest') },
      { key: 'partners', label: t('admin.tabs.becomePartner') }
    ];

    // 管理員可以管理所有賬戶
    if (userRole === 'admin' || userRole === 'super_admin') {
      baseTabs.push(
        { key: 'doctors', label: t('admin.tabs.doctors') },
        { key: 'clinics', label: t('admin.tabs.clinics') },
        { key: 'accounts', label: t('admin.tabs.accounts') }
      );
    }
    // 業務可以管理診所、醫生、患者
    else if (userRole === 'market') {
      baseTabs.push(
        { key: 'doctors', label: t('admin.tabs.doctors') },
        { key: 'clinics', label: t('admin.tabs.clinics') },
        { key: 'accounts', label: t('admin.tabs.accounts') }
      );
    }
    // 醫生只能管理患者
    else if (userRole === 'doctor') {
      baseTabs.push(
        { key: 'accounts', label: t('admin.tabs.patientManagement') }
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
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState({});
  const [items, setItems] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorUuid, setSelectedDoctorUuid] = useState('');
  const [targetSmileUuid, setTargetSmileUuid] = useState('');
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedSmileUuid, setSelectedSmileUuid] = useState('');

  // 格式化牙齿类型显示
  const formatTeethType = (teethType) => {
    if (!teethType || typeof teethType !== 'string') return '—';
    const teethTypeMap = {
      'crowded': t('upload.step2Form.teethOptions.crowded'),
      'overbite': t('upload.step2Form.teethOptions.overbite'),
      'spaced': t('upload.step2Form.teethOptions.spaced'),
      'other': t('upload.step2Form.teethOptions.other'),
      'normal': '正常',
      'underbite': '下颚前突',
      'crossbite': '交叉咬合'
    };
    const types = teethType.split(/[,，]\s*/).map(s => s.trim()).filter(Boolean);
    return types.map(type => teethTypeMap[type] || type).join('、') || '—';
  };

  // 判断是否是患者填写的多选选项（格式：price, pain 等）
  const isPatientConsiderations = (considerations) => {
    if (!considerations || typeof considerations !== 'string') return false;
    const validOptions = ['price', 'procedure', 'duration', 'pain', 'none'];
    const items = considerations.split(/[,，]\s*/).map(s => s.trim()).filter(Boolean);
    // 如果所有项都是有效的多选选项，则认为是患者填写的
    return items.length > 0 && items.every(item => validOptions.includes(item));
  };

  // 格式化考量显示（仅显示患者填写的多选选项）
  const formatConsiderations = (considerations) => {
    if (!considerations || typeof considerations !== 'string') return '—';
    // 如果不是患者填写的多选选项格式，不显示（可能是管理员备注）
    if (!isPatientConsiderations(considerations)) return '—';
    const considerationMap = {
      'price': t('upload.step2Form.considerationOptions.price'),
      'procedure': t('upload.step2Form.considerationOptions.procedure'),
      'duration': t('upload.step2Form.considerationOptions.duration'),
      'pain': t('upload.step2Form.considerationOptions.pain'),
      'none': t('upload.step2Form.considerationNone')
    };
    const items = considerations.split(/[,，]\s*/).map(s => s.trim()).filter(Boolean);
    return items.map(item => considerationMap[item] || item).join('、') || '—';
  };

  // 获取管理员备注（从 current_issues 字段获取）
  const getAdminNote = (currentIssues) => {
    return currentIssues || '';
  };

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
            teeth_type: s.teeth_type || '',
            considerations: s.considerations || '', // 患者填写的多选选项
            current_issues: s.current_issues || '', // 管理员备注
            statusText: s?.patient_uuid ? s?.uuid : t('admin.table.createPatientInfo'),
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
          <div className="th seq">{t('admin.table.seq')}</div>
          <div className="th name">{t('admin.table.patientName')}</div>
          <div className="th phone">{t('admin.table.phone')}</div>
          <div className="th email">{t('admin.table.email')}</div>
          <div className="th line_id">{t('admin.table.lineId')}</div>
          <div className="th region">{t('admin.table.region')}</div>
          <div className="th created_at">{t('admin.table.createdAt')}</div>
          <div className="th download">{t('admin.table.download')}</div>
          <div className="th status">{t('admin.table.status')}</div>
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
                      >{t('admin.table.historyData')}</button>
                  </div>
                  <div className="td status">
                    {row.statusText === t('admin.table.createPatientInfo') ? (
                      <button className="create-patient-info-button" onClick={(e) => { e.stopPropagation(); openBindPatientModal(row.smileUuid); }}>{t('admin.table.createPatientInfo')}</button>
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
                      <div className="note-label" style={{ textAlign: 'left', marginBottom: 8, fontSize: 14 }}>
                        {t('admin.table.teethType')}：{formatTeethType(row.teeth_type)}
                      </div>
                      <div className="note-label" style={{ textAlign: 'left', marginBottom: 8, fontSize: 14 }}>
                        {t('admin.table.considerations')}：{formatConsiderations(row.considerations)}
                      </div>
                      <div className="note-label" style={{ textAlign: 'left', marginBottom: 8, fontSize: 14 }}>
                        {t('admin.table.userNote')}：{row.improvement_points || '—'}
                      </div>
                    </div>
                    <textarea
                      className="note-input"
                      placeholder={t('admin.table.placeholder')}
                      defaultValue={getAdminNote(row.current_issues)}
                      onBlur={async (e) => {
                        const text = e.target.value || '';
                        if (!row.smileUuid) return;
                        const r = await apiService.updateSmileTestBio(row.smileUuid, text);
                        if (r?.success) {
                          message.success(t('admin.messages.saved'));
                          // 更新本地状态，保存管理员备注到 current_issues 字段
                          setItems((prev) => prev.map(it => it.id === row.id ? { ...it, current_issues: text } : it));
                        } else {
                          message.error(r?.message || t('admin.messages.saveFailed'));
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
        title={t('admin.modal.bindDoctorCreatePatient')}
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        onOk={async () => {
          if (!selectedDoctorUuid) { message.error(t('admin.messages.selectDoctor')); return; }
          if (!targetSmileUuid) { message.error(t('admin.messages.noTargetRecord')); return; }
          const detail = await apiService.getSmileTestByUuid(targetSmileUuid);
          if (!detail?.success || !detail.data?.smileTest) { message.error(t('admin.messages.getRecordFailed')); return; }
          const res = await apiService.bindExistingSmileTest({ smile_uuid: targetSmileUuid, assigned_doctor_uuid: selectedDoctorUuid });
          if (res?.success) {
            message.success(t('admin.messages.createSuccess'));
            setCreateOpen(false); setSelectedDoctorUuid('');
            // 重新拉取列表，只显示等待指定的患者信息（patient_uuid 为 null）
            const again = await apiService.getAllSmileTests();
            if (again?.success && Array.isArray(again.data)) {
              // 过滤掉 patient_uuid 有值的记录
              const filteredData = again.data.filter((s) => !s.patient_uuid);
              const mapped = filteredData.map((s, idx) => ({
                ...s,
                id: String(idx + 1).padStart(2, '0'),
                patientName: s.full_name || '—',
                phone: s.phone || '—',
                email: s.email || '—',
                lineId: s.line_id || '—',
                region: s.city || '—',
                downloadUrl: '#',
                teeth_type: s.teeth_type || '',
                considerations: s.considerations || '', // 患者填写的多选选项
                current_issues: s.current_issues || '', // 管理员备注
                statusText: s?.patient_uuid ? s?.uuid : t('admin.table.createPatientInfo'),
                smileUuid: s.uuid,
                createdAt: s.created_at ? new Date(s.created_at).toLocaleString('zh-TW') : '—',
              }));
              setItems(mapped);
            }
          } else {
            message.error(res?.message || t('admin.messages.createFailed'));
          }
        }}
        okText={t('admin.modal.save')}
        cancelText={t('admin.modal.cancel')}
      >
        <div>
          <div style={{ marginBottom: 8 }}>{t('admin.modal.selectDoctor')}</div>
          <Select
            style={{ width: '100%' }}
            placeholder={t('admin.modal.selectDoctorPlaceholder')}
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