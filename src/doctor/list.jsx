import React, { useMemo, useState, useCallback } from 'react';
import './list.scss';

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
          return (
            <div key={id} className={`list-row ${isOpen ? 'open' : ''}`}>
              <div className="row-main" onClick={() => onToggle(id)}>
                <div className="col sequence">{String(index + 1).padStart(2, '0')}</div>
                <div className="col name">{pt.full_name || '—'}</div>
                <div className="col user-id">用戶ID: {pt.uuid || '—'}</div>
                <div className="col contact">聯繫方式: {pt.phone || '—'}</div>
                <div className="col email">{pt.email || '—'}</div>
                <div className="col status">
                  <span className={`status-badge ${st.test_status || ''}`}>{st.test_status || '—'}</span>
                </div>
                <div className="col action">
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
                      <button className="btn primary">上傳</button>
                      <button className="btn secondary">下載</button>
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
