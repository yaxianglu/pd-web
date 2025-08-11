import React, { useMemo, useState, useCallback } from 'react';
import Logout from '../components/logout';
import './index.scss';

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

  const items = useMemo(() => {
    if (Array.isArray(inputItems) && inputItems.length > 0) return inputItems;
    return new Array(8).fill(null).map((_, i) => ({
      id: String(i + 1).padStart(2, '0'),
      patientName: '蒋权',
      region: '台南',
      downloadUrl: '#',
      note: i === 0 ? '詳細備註：於2025.06.30日測試，於06.30下午已聯繫患者。' : '',
      statusText: '創建患者信息',
      readStatus: i === 0 ? '已閱' : '未讀',
    }));
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
            <div className="th region">IP</div>
            <div className="th download">資料下載</div>
            <div className="th status">狀態</div>
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
                      <span className="action">{row.statusText}</span>
                      <span className={`read ${row.readStatus === '已閱' ? 'readed' : 'unread'}`}>{row.readStatus}</span>
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


