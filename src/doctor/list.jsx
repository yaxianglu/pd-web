import React, { useMemo, useState, useCallback } from 'react';
import './list.scss';
import ContactInfo from '../components/contact-info';
import Dashboard from '../patient';

export default function PatientInfoList({ patients = [], onCreate, statusFromRoute = 'all', onStatusChange = () => {} }) {
  const [keyword, setKeyword] = useState('');
  const [expanded, setExpanded] = useState({}); // key: patient.uuid -> boolean
  const statusFilter = statusFromRoute || 'all';

  const onToggle = useCallback((uuid) => {
    setExpanded((prev) => ({ ...prev, [uuid]: !prev[uuid] }));
  }, []);

  const mapProgressToTitle = (progress) => {
    const idx = Math.max(0, Math.min(6, Number(progress) || 0));
    const titles = ['等待預約', '預約完成', '確認方案', '付款完成', '生產完成', '治療中', '治療完成'];
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
      return (
        (pt.full_name || '').toLowerCase().includes(k) ||
        (pt.phone || '').toLowerCase().includes(k) ||
        (pt.email || '').toLowerCase().includes(k) ||
        (pt.patient_id || '').toLowerCase().includes(k) ||
        (pt.uuid || '').toLowerCase().includes(k)
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
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flex: 1 }}>
          <div className="search-bar" style={{ flex: 1 }}>
            <input
              placeholder="搜索姓名 / 用戶ID / 手機 / 信箱"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>篩選狀態：</span>
            <select value={statusFilter} onChange={(e) => onStatusChange(e.target.value)} style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #dcdfe6' }}>
              <option value="all">全部</option>
              <option value="等待預約">等待預約</option>
              <option value="預約完成">預約完成</option>
              <option value="確認方案">確認方案</option>
              <option value="付款完成">付款完成</option>
              <option value="生產完成">生產完成</option>
              <option value="治療中">治療中</option>
              <option value="治療完成">治療完成</option>
            </select>
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
                    { label: '用戶ID', value: pt.uuid || 'N/A' },
                    { label: '性别', value: pt.gender || 'N/A' },
                    { label: '生日', value: pt.birth_date || 'N/A' },
                    { label: '聯繫方式', value: pt.phone || 'N/A' },
                    { label: '信箱', value: pt.email || 'N/A' },
                  ]} style={{ marginBottom: 0, width: '100%' }} />
                </div>
                <div className="col action" style={{ marginRight: 12 }} onClick={() => onToggle(id)}>
                  <span className={`arrow ${isOpen ? 'up' : 'down'}`}>▾</span>
                </div>
              </div>

              {isOpen && (
                <div className="row-expand" onClick={(e)=>e.stopPropagation()}>
                  <Dashboard prefetched={item} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
