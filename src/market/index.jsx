import React, { useState, useCallback, useEffect } from 'react';
import Logout from '../components/logout';
import './index.scss';
import apiService from '../services/api';
import { Modal, Select, message, Tabs } from 'antd';
import Partners from '../partners';
import ClinicDashboard from '../clinic';

function MarketHeader({ activeTab, onTabChange }) {
  return (
    <div className="market-header">
      <div className="title" style={{ width: '100%' }}>
        <Tabs
          items={[
            { key: 'smile', label: '微笑測試' },
            { key: 'partners', label: '合作夥伴' },
            { key: 'clinics', label: '診所' },
          ]}
          activeKey={activeTab}
          onChange={onTabChange}
        />
      </div>
      <div className="biz-id">
        <Logout />
      </div>
    </div>
  );
}

export default function MarketDashboard({ items: inputItems = null, bizId = '320123010010' }) {
  const [expanded, setExpanded] = useState({});
  const [items, setItems] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorUuid, setSelectedDoctorUuid] = useState('');
  const [targetSmileUuid, setTargetSmileUuid] = useState('');
  const [activeTab, setActiveTab] = useState('smile');

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
          // 失败时给出空数组
          setItems([]);
        }
      }
    };
    load();
    return () => { isMounted = false; };
  }, [inputItems]);

  // 预取醫生+診所
  useEffect(() => {
    apiService.getDoctorsWithClinic().then((res) => {
      if (res?.success) setDoctors(res.data || []);
    });
  }, []);

  const openBindPatientModal = (smileTestUuid) => {
    setTargetSmileUuid(smileTestUuid);
    setCreateOpen(true);
  };

  const onToggle = useCallback((rowId) => {
    setExpanded((prev) => ({ ...prev, [rowId]: !prev[rowId] }));
  }, []);

  const handleDownloadPhotos = useCallback(async (smileUuid) => {
    try {
      if (!smileUuid) {
        message.error('缺少記錄標識');
        return;
      }
      const key = 'photos-download';
      message.loading({ content: '正在生成照片壓縮包…', key, duration: 0 });
      const blob = await apiService.downloadSmilePhotosZip(smileUuid);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `smile_photos_${smileUuid.slice(0, 8)}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      message.success({ content: '照片下載已開始', key, duration: 1.5 });
    } catch (err) {
      console.error(err);
      message.error('照片下載失敗');
    }
  }, []);

  const handleDownloadFiles = useCallback(async (smileUuid) => {
    try {
      if (!smileUuid) {
        message.error('缺少記錄標識');
        return;
      }
      const key = 'files-download';
      message.loading({ content: '正在生成文件壓縮包…', key, duration: 0 });
      const blob = await apiService.downloadUploadedFilesZip(smileUuid);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `uploaded_files_${smileUuid.slice(0, 8)}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      message.success({ content: '文件下載已開始', key, duration: 1.5 });
    } catch (err) {
      console.error(err);
      message.error('文件下載失敗');
    }
  }, []);

  return (
    <div className="market-dashboard" style={{ height: '100%' }}>
      <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <MarketHeader bizId={bizId} activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'smile' && (
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
            {items.map((row, idx) => {
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
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleDownloadPhotos(row.smileUuid); }}
                          className="link"
                          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: '12px' }}
                        >照片包</button>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleDownloadFiles(row.smileUuid); }}
                          className="link"
                          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: '12px' }}
                        >文件包</button>
                      </div>
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
        )}
        {activeTab === 'partners' && <Partners />}
        {activeTab === 'clinics' && <ClinicDashboard />}
      </div>

      <Modal
        title="綁定醫師並創建患者"
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        onOk={async () => {
          if (!selectedDoctorUuid) {
            message.error('請選擇醫師');
            return;
          }
          if (!targetSmileUuid) {
            message.error('未選擇目標記錄');
            return;
          }
          // 读取 smile_test 詳情拿到患者資料字段，用於創建
          const detail = await apiService.getSmileTestByUuid(targetSmileUuid);
          if (!detail?.success || !detail.data?.smileTest) {
            message.error('獲取記錄失敗');
            return;
          }
          // const s = detail.data.smileTest;
          const res = await apiService.bindExistingSmileTest({ smile_uuid: targetSmileUuid, assigned_doctor_uuid: selectedDoctorUuid });
          if (res?.success) {
            message.success('創建成功');
            setCreateOpen(false);
            setSelectedDoctorUuid('');
            // 重新拉取列表
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
            options={(doctors || []).map(d => ({
              value: d.uuid,
              label: `${d.full_name || d.username || '—'}${d.clinic ? `（${d.clinic.clinic_name}）` : ''}`
            }))}
          />
        </div>
      </Modal>
    </div>
  );
}


