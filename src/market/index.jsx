import React, { useMemo, useState, useCallback, useEffect } from 'react';
import Logout from '../components/logout';
import './index.scss';
import apiService from '../services/api';

function MarketHeader() {
  return (
    <div className="market-header">
      <div className="title">微笑測試</div>
      <div className="biz-id">
        <Logout />
      </div>
    </div>
  );
}

export default function MarketDashboard({ items: inputItems = null, bizId = '320123010010' }) {
  const [expanded, setExpanded] = useState({});
  const [items, setItems] = useState([]);

  // 首次进入或依赖变化时，从后端获取 smile_test 列表
  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      if (Array.isArray(inputItems) && inputItems.length > 0) {
        if (isMounted) setItems(inputItems);
        return;
      }
      const res = await apiService.getAllSmileTests();
      if (isMounted) {
        if (res?.success && Array.isArray(res.data)) {
          // 适配表格字段
          const mapped = res.data.map((s, idx) => ({
            id: String(idx + 1).padStart(2, '0'),
            patientName: s.full_name || '—',
            region: s.city || '—',
            downloadUrl: '#',
            note: '',
            statusText: s?.patient_uuid || '創建患者信息',
          }));
          setItems(mapped);
        } else {
          // 失败时给出空数组
          setItems([]);
        }
      }
    };
    load();
    return () => { isMounted = false; };
  }, [inputItems]);

  const onToggle = useCallback((rowId) => {
    setExpanded((prev) => ({ ...prev, [rowId]: !prev[rowId] }));
  }, []);

  return (
    <div className="market-dashboard">
      <div className="card">
        <MarketHeader bizId={bizId} />

        <div className="table">
          <div className="thead">
            <div className="th seq">編號</div>
            <div className="th name">患者名稱</div>
            <div className="th region">地址</div>
            <div className="th download">資料下載</div>
            <div className="th status">患者卡</div>
            <div className="th caret" />
          </div>

          <div className="tbody">
            {items.map((row, idx) => {
              const isOpen = !!expanded[row.id];
              return (
                <div key={row.id} className={`tr ${isOpen ? 'open' : ''}`}>
                  <div className="row-main" onClick={() => onToggle(row.id)}>
                    <div className="td seq">{row.id}</div>
                    <div className="td name">{row.patientName || '—'}</div>
                    <div className="td region">{row.region || '—'}</div>
                    <div className="td download">
                      {row.downloadUrl ? (
                        <a href={row.downloadUrl} onClick={(e) => e.stopPropagation()} className="link">壓縮包</a>
                      ) : '—'}
                    </div>
                    <div className="td status">
                      {
                        row.statusText === '創建患者信息' ? (
                          <button className="create-patient-info-button">創建患者信息</button>
                        ) : (
                          row.statusText
                        )
                      }
                    </div>
                    <div className="td caret">
                      <span className={`arrow ${isOpen ? 'up' : 'down'}`}>▾</span>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="row-expand" onClick={(e) => e.stopPropagation()}>
                      <div className="note">{row.note || '—'}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}


