import React, { useMemo, useState, useCallback } from 'react';
import './list.scss';
import ContactInfo from '../components/contact-info';

export default function PatientInfoList({ patients = [] }) {
  const [keyword, setKeyword] = useState('');
  const [expanded, setExpanded] = useState({}); // key: patient.uuid -> boolean

  const onToggle = useCallback((uuid) => {
    setExpanded((prev) => ({ ...prev, [uuid]: !prev[uuid] }));
  }, []);

  const filtered = useMemo(() => {
    const k = keyword.trim().toLowerCase();
    if (!k) return patients;
    return patients.filter((p) => {
      const pt = p?.patient || {};
      return (
        (pt.full_name || '').toLowerCase().includes(k) ||
        (pt.phone || '').toLowerCase().includes(k) ||
        (pt.email || '').toLowerCase().includes(k) ||
        (pt.patient_id || '').toLowerCase().includes(k) ||
        (pt.uuid || '').toLowerCase().includes(k)
      );
    });
  }, [patients, keyword]);

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
        <div className="search-bar">
          <input
            placeholder="搜索姓名 / 用戶ID / 手機 / 信箱"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
      </div>

      <div className="list-rows">
        {filtered.map((item, index) => {
          const pt = item?.patient || {};
          const st = item?.smileTest || {};
          const id = pt.uuid || `row-${index}`;
          const isOpen = !!expanded[id];
          const userId = pt.patient_id || pt.uuid || '—';
          const statusText = mapStatusToText(st.test_status);
          return (
            <div key={id} className={`list-row ${isOpen ? 'open' : ''}`}>
              <div className="row-main" onClick={() => onToggle(id)}>
                <div className="col sequence">{String(index + 1).padStart(2, '0')}</div>
                <div className="col name">{st.full_name || '—'}</div>
                <div className="col info" style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                  <ContactInfo list={[
                    {
                      label: '用戶ID',
                      value: pt.uuid || 'N/A'
                    },
                    {
                      label: '性别',
                      value: pt.gender || 'N/A'
                    },
                    {
                      label: '生日',
                      value: pt.birth_date || 'N/A'
                    },
                    {
                      label: '聯繫方式',
                      value: pt.phone || 'N/A'
                    },
                    {
                      label: '信箱',
                      value: pt.email || 'N/A'
                    }
                  ]} 
                  style={{ marginBottom: 0 }}
                  />
                </div>
                {/* <div className="col status">
                  <span className={`status-badge ${st.test_status || ''}`}>{statusText}</span>
                </div> */}
                <div className="col action" style={{ marginRight: 12 }}>
                  <span className={`arrow ${isOpen ? 'up' : 'down'}`}>▾</span>
                </div>
              </div>

              {isOpen && (
                <div className="row-expand">
                  <div className="expand-grid">
                    <div className="expand-item"><span className="label">牙套類型：</span><span className="value">{st.teeth_type || '—'}</span></div>
                    <div className="expand-item"><span className="label">治療方案：</span><span className="value">{st.confidence_level || '—'}</span></div>
                    <div className="expand-item"><span className="label">治療階段：</span><span className="value">{pt.treatment_phase || '—'}</span></div>
                    <div className="expand-item"><span className="label">目前進度：</span><span className="value">{pt.treatment_progress ?? '—'}%</span></div>
                    <div className="expand-item"><span className="label">支付狀態：</span><span className="value">{pt.payment_status || '—'}</span></div>
                    <div className="expand-item"><span className="label">下一次预约：</span><span className="value">{(pt.next_appointment_date || '').toString().replace('T', ' ').slice(0, 16) || '—'}</span></div>
                  </div>
                  <div className="expand-notes">
                    <span className="label">備註：</span>
                    <div className="notes-actions">
                      <button className="btn primary" onClick={(e)=>e.stopPropagation()}>上傳</button>
                      <button className="btn secondary" onClick={(e)=>e.stopPropagation()}>下載</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
