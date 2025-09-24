import React, { useMemo, useState, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './list.scss';
import ContactInfo from '../components/contact-info';
import Dashboard from '../patient';

export default function PatientInfoList({ patients = [], onCreate, statusFromRoute = 'all', onStatusChange = () => {}, doctorUser = null }) {
  const { t } = useLanguage();
  const [keyword, setKeyword] = useState('');
  const [expanded, setExpanded] = useState({}); // key: patient.uuid -> boolean
  const statusFilter = statusFromRoute || 'all';

  const onToggle = useCallback((uuid) => {
    setExpanded((prev) => ({ ...prev, [uuid]: !prev[uuid] }));
  }, []);

  const mapProgressToTitle = (progress) => {
    const idx = Math.max(0, Math.min(6, Number(progress) || 0));
    const titles = [
      t('doctor.status.waitingAppointment'),
      t('doctor.status.appointmentCompleted'),
      t('doctor.status.planConfirmed'),
      t('doctor.status.paymentCompleted'),
      t('doctor.status.productionCompleted'),
      t('doctor.status.inTreatment'),
      t('doctor.status.treatmentCompleted')
    ];
    return titles[idx] || '';
  };

  const filtered = useMemo(() => {
    const k = keyword.trim().toLowerCase();
    const listByStatus = (statusFilter === 'all') ? patients : (patients || []).filter((p) => {
      const progress = p?.patient?.treatment_progress ?? p?.smileTest?.treatment_progress ?? 0;
      return mapProgressToTitle(progress) === statusFilter;
    });

    if (!k) return listByStatus;
    return listByStatus.filter((p) => {
      const pt = p?.patient || {};
      const st = p?.smileTest || {};
      return (
        (pt.full_name || st.full_name || '').toLowerCase().includes(k) ||
        (pt.phone || st.phone || '').toLowerCase().includes(k) ||
        (pt.email || st.email || '').toLowerCase().includes(k) ||
        (pt.patient_id || '').toLowerCase().includes(k) ||
        (pt.uuid || '').toLowerCase().includes(k) ||
        (st.uuid || '').toLowerCase().includes(k)
      );
    });
  }, [patients, keyword, statusFilter]);

  const mapStatusToText = (status) => {
    switch (status) {
      case 'pending': return '待處理';
      case 'in_progress': return '處理中';
      case 'completed': return '已完成';
      case 'cancelled': return '已取消';
      default: return status || '—';
    }
  };

  return (
    <div className="card patient-list">
      <div className="list-header">
        <div className="card-title">患者列表</div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flex: 1, justifyContent: 'end' }}>
          <div className="search-bar">
            <input
              placeholder="搜索姓名 / 用戶ID / 手機 / 信箱"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          {onCreate ? (
            <button className="btn primary" onClick={onCreate}>創建患者資料卡</button>
          ) : null}
        </div>
      </div>

      <div className="list-rows">
        {filtered.map((item, index) => {
          const pt = item?.patient || {};
          const st = item?.smileTest || {};
          const id = pt.uuid || `row-${index}`;
          const isOpen = !!expanded[id];
          return (
            <div key={id} className={`list-row ${isOpen ? 'open' : ''}`}>
              <div className="row-main">
                <div className="col sequence">{String(index + 1).padStart(2, '0')}</div>
                <div className="col name">{st.full_name || '—'}</div>
                <div className="col info" style={{ flex: 1, display: 'flex', alignItems: 'center', marginRight: 12, overflow: 'hidden' }}>
                  <ContactInfo list={[
                    { label: t('doctor.patientInfo.userId'), value: st.uuid || 'N/A' },
                    { label: t('doctor.patientInfo.gender'), value: pt.gender || st.gender || 'N/A' },
                    { label: t('doctor.patientInfo.birthday'), value: pt.birth_date || st.birth_date || 'N/A' },
                    { label: t('doctor.patientInfo.contact'), value: pt.phone || st.phone || 'N/A' },
                    { label: t('doctor.patientInfo.email'), value: pt.email || st.email || 'N/A' },
                  ]} style={{ marginBottom: 0, width: '100%' }} />
                </div>
                <div className="col action" style={{ marginRight: 12 }} onClick={() => onToggle(id)}>
                  <span className={`arrow ${isOpen ? 'up' : 'down'}`}>▾</span>
                </div>
              </div>

              {isOpen && (
                <div className="row-expand" onClick={(e)=>e.stopPropagation()}>
                  <Dashboard prefetched={item} doctorUser={doctorUser} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
