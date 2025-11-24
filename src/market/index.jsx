import React, { useState, useCallback, useEffect } from 'react';
import Logout from '../components/logout';
import './index.scss';
import apiService from '../services/api';
import { Modal, Select, message, Tabs } from 'antd';
import Partners from '../partners';
import ClinicDashboard from '../clinic';
import HistoryModal from '../components/history-modal';
import { useLanguage } from '../context/LanguageContext';

function MarketHeader({ activeTab, onTabChange }) {
  const { t } = useLanguage();
  return (
    <div className="market-header">
      <div className="title" style={{ width: '100%' }}>
        <Tabs
          items={[
            { key: 'smile', label: t('market.tabs.smileTest') },
            { key: 'partners', label: t('market.tabs.partners') },
            { key: 'clinics', label: t('market.tabs.clinics') },
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
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState({});
  const [items, setItems] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorUuid, setSelectedDoctorUuid] = useState('');
  const [targetSmileUuid, setTargetSmileUuid] = useState('');
  const [activeTab, setActiveTab] = useState('smile');
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedSmileUuid, setSelectedSmileUuid] = useState('');

  // 首次进入或依赖变化时，从后端获取 smile_test 列表
  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      if (Array.isArray(inputItems) && inputItems.length > 0) {
        // 过滤掉 patient_uuid 有值的记录
        const filteredInputItems = inputItems.filter((s) => !s.patient_uuid);
        if (isMounted) setItems(filteredInputItems);
        return;
      }
      const res = await apiService.getAllSmileTests();
      if (isMounted) {
        if (res?.success && Array.isArray(res.data)) {
          // 过滤掉 patient_uuid 有值的记录
          const filteredData = res.data.filter((s) => !s.patient_uuid);
          // 适配表格字段
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
            statusText: s?.patient_uuid ? s?.uuid : t('admin.table.createPatientInfo'),
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

  const openHistoryModal = (smileUuid) => {
    setSelectedSmileUuid(smileUuid);
    setHistoryModalOpen(true);
  };

  const onToggle = useCallback((rowId) => {
    setExpanded((prev) => ({ ...prev, [rowId]: !prev[rowId] }));
  }, []);

  const handleDownloadPhotos = useCallback(async (smileUuid) => {
    try {
      if (!smileUuid) {
        message.error(t('admin.messages.missingRecordId'));
        return;
      }
      const key = 'photos-download';
      message.loading({ content: t('admin.messages.generatingPhotos'), key, duration: 0 });
      const blob = await apiService.downloadSmilePhotosZip(smileUuid);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `smile_photos_${smileUuid.slice(0, 8)}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      message.success({ content: t('admin.messages.photosDownloadStarted'), key, duration: 1.5 });
    } catch (err) {
      console.error(err);
      message.error(t('admin.messages.photosDownloadFailed'));
    }
  }, []);

  const handleDownloadFiles = useCallback(async (smileUuid) => {
    try {
      if (!smileUuid) {
        message.error(t('admin.messages.missingRecordId'));
        return;
      }
      const key = 'files-download';
      message.loading({ content: t('admin.messages.generatingFiles'), key, duration: 0 });
      const blob = await apiService.downloadUploadedFilesZip(smileUuid);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `uploaded_files_${smileUuid.slice(0, 8)}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      message.success({ content: t('admin.messages.filesDownloadStarted'), key, duration: 1.5 });
    } catch (err) {
      console.error(err);
      message.error(t('admin.messages.filesDownloadFailed'));
    }
  }, []);

  return (
    <div className="market-dashboard" style={{ height: '100%' }}>
      <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <MarketHeader bizId={bizId} activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'smile' && (
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
                        <div className="note-label" style={{ textAlign: 'left', marginBottom: 8, fontSize: 14 }}>{t('admin.table.userNote')}：{row.improvement_points || '—'}</div>
                      </div>
                      <textarea
                        className="note-input"
                        placeholder={t('admin.table.placeholder')}
                        defaultValue={row.considerations || ''}
                        onBlur={async (e) => {
                          const text = e.target.value || '';
                          if (!row.smileUuid) return;
                          const r = await apiService.updateSmileTestBio(row.smileUuid, text);
                          if (r?.success) {
                          message.success(t('admin.messages.saved'));
                          setItems((prev) => prev.map(it => it.id === row.id ? { ...it, considerations: text } : it));
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
        )}
        {activeTab === 'partners' && <Partners />}
        {activeTab === 'clinics' && <ClinicDashboard />}
      </div>

      <Modal
        title={t('admin.modal.bindDoctorCreatePatient')}
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        onOk={async () => {
          if (!selectedDoctorUuid) {
            message.error(t('admin.messages.selectDoctor'));
            return;
          }
          if (!targetSmileUuid) {
            message.error(t('admin.messages.noTargetRecord'));
            return;
          }
          // 读取 smile_test 詳情拿到患者資料字段，用於創建
          const detail = await apiService.getSmileTestByUuid(targetSmileUuid);
          if (!detail?.success || !detail.data?.smileTest) {
            message.error(t('admin.messages.getRecordFailed'));
            return;
          }
          // const s = detail.data.smileTest;
          const res = await apiService.bindExistingSmileTest({ smile_uuid: targetSmileUuid, assigned_doctor_uuid: selectedDoctorUuid });
          if (res?.success) {
            message.success(t('admin.messages.createSuccess'));
            setCreateOpen(false);
            setSelectedDoctorUuid('');
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
                considerations: s.considerations || '',
                improvementPoints: s.improvement_points || '',
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
            options={(doctors || []).map(d => ({
              value: d.uuid,
              label: `${d.full_name || d.username || '—'}${d.clinic ? `（${d.clinic.clinic_name}）` : ''}`
            }))}
          />
        </div>
      </Modal>

      {/* 历史资料模态框 */}
      <HistoryModal
        open={historyModalOpen}
        onCancel={() => setHistoryModalOpen(false)}
        smileTestUuid={selectedSmileUuid}
        userType="admin" // market路由使用admin权限，显示所有文件类型
      />
    </div>
  );
}


