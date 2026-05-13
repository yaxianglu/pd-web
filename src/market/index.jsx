import React, { useState, useCallback, useEffect } from 'react';
import Logout from '../components/logout';
import './index.scss';
import apiService from '../services/api';
import { Modal, Pagination, Select, message, Tabs } from 'antd';
import Partners from '../partners';
import ClinicDashboard from '../clinic';
import HistoryModal from '../components/history-modal';
import { useLanguage } from '../context/LanguageContext';
import {
  createSmileTestFilters,
  getSmileTestBindOptions,
  getSmileTestPagination,
  getSmileTestStatusOptions,
  getSmileTestSummaryText,
  mergeSmileTestFilters,
  SMILE_TEST_PAGE_SIZE,
} from '../utils/smile-test-list';

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
  const [filters, setFilters] = useState(() => createSmileTestFilters());
  const [pagination, setPagination] = useState(() => getSmileTestPagination());
  const [createOpen, setCreateOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorUuid, setSelectedDoctorUuid] = useState('');
  const [targetSmileUuid, setTargetSmileUuid] = useState('');
  const [activeTab, setActiveTab] = useState('smile');
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

  const mapSmileTests = useCallback((records = [], page = 1, pageSize = SMILE_TEST_PAGE_SIZE) => {
    const baseIndex = (page - 1) * pageSize;

    return records.map((s, idx) => ({
      ...s,
      id: String(baseIndex + idx + 1).padStart(2, '0'),
      rowKey: s.uuid || String(baseIndex + idx + 1),
      patientName: s.full_name || '—',
      phone: s.phone || '—',
      email: s.email || '—',
      lineId: s.line_id || '—',
      region: s.city || '—',
      downloadUrl: '#',
      teeth_type: s.teeth_type || '',
      considerations: s.considerations || '',
      current_issues: s.current_issues || '',
      statusText: s?.patient_uuid ? s?.uuid : t('admin.table.createPatientInfo'),
      smileUuid: s.uuid,
      createdAt: s.created_at ? new Date(s.created_at).toLocaleString('zh-TW') : '—',
    }));
  }, [t]);

  const setFilterValue = useCallback((patch) => {
    setExpanded({});
    setFilters((prev) => mergeSmileTestFilters(prev, patch));
  }, []);

  const loadSmileTests = useCallback(async () => {
    if (Array.isArray(inputItems) && inputItems.length > 0 && !filters.status && !filters.date_from && !filters.date_to && !filters.account_keyword && filters.bound_state === 'unbound') {
      const localItems = inputItems.filter((s) => !s.patient_uuid);
      const page = filters.page || 1;
      const pageSize = filters.page_size || SMILE_TEST_PAGE_SIZE;
      const total = localItems.length;
      const totalPages = Math.max(1, Math.ceil(total / pageSize));
      const startIndex = (page - 1) * pageSize;
      const pageItems = localItems.slice(startIndex, startIndex + pageSize);

      setPagination({
        page,
        page_size: pageSize,
        total,
        total_pages: totalPages,
      });
      setItems(mapSmileTests(pageItems, page, pageSize));
      return;
    }

    const res = await apiService.getAllSmileTests(filters);
    const nextPagination = getSmileTestPagination(res, filters.page);
    setPagination(nextPagination);

    if (res?.success && Array.isArray(res.data)) {
      setItems(mapSmileTests(res.data, nextPagination.page, nextPagination.page_size));
    } else {
      setItems([]);
    }
  }, [filters, inputItems, mapSmileTests]);

  useEffect(() => {
    loadSmileTests();
  }, [loadSmileTests]);

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

  return (
    <div className="market-dashboard" style={{ height: '100%' }}>
      <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <MarketHeader bizId={bizId} activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'smile' && (
        <>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16, alignItems: 'end' }}>
          <div>
            <div style={{ fontSize: 12, marginBottom: 6 }}>{t('admin.table.status')}</div>
            <Select
              value={filters.status || undefined}
              placeholder={t('admin.table.status')}
              allowClear
              style={{ width: 140 }}
              onChange={(value) => setFilterValue({ status: value || '' })}
              options={getSmileTestStatusOptions(t)}
            />
          </div>
          <div>
            <div style={{ fontSize: 12, marginBottom: 6 }}>{t('admin.table.createdAt')}</div>
            <input
              type="date"
              value={filters.date_from}
              onChange={(e) => setFilterValue({ date_from: e.target.value })}
              style={{ height: 32, padding: '0 8px' }}
            />
          </div>
          <div>
            <div style={{ fontSize: 12, marginBottom: 6 }}>{t('admin.table.to')}</div>
            <input
              type="date"
              value={filters.date_to}
              onChange={(e) => setFilterValue({ date_to: e.target.value })}
              style={{ height: 32, padding: '0 8px' }}
            />
          </div>
          <div>
            <div style={{ fontSize: 12, marginBottom: 6 }}>{t('admin.table.account')}</div>
            <input
              type="text"
              value={filters.account_keyword}
              placeholder={t('admin.table.accountPlaceholder')}
              onChange={(e) => setFilterValue({ account_keyword: e.target.value })}
              style={{ height: 32, padding: '0 8px', width: 220 }}
            />
          </div>
          <div>
            <div style={{ fontSize: 12, marginBottom: 6 }}>{t('admin.table.bind')}</div>
            <Select
              value={filters.bound_state}
              style={{ width: 140 }}
              onChange={(value) => setFilterValue({ bound_state: value })}
              options={getSmileTestBindOptions(t)}
            />
          </div>
        </div>
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
              const isOpen = !!expanded[row.rowKey];
              return (
                <div key={row.rowKey} className={`tr ${isOpen ? 'open' : ''}`}>
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
                    <div className="td caret" onClick={() => onToggle(row.rowKey)}>
                      <span className={`arrow ${isOpen ? 'up' : 'down'}`}>▾</span>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="row-expand" onClick={(e) => e.stopPropagation()}>
                      <div className="user-note-section">
                        <div className="note-label" style={{ textAlign: 'left', marginBottom: 8, fontSize: 14 }}>
                          {t('admin.table.dateOfBirth')}：{row.birth_date || '—'}
                        </div>
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
                          setItems((prev) => prev.map((it) => it.smileUuid === row.smileUuid ? { ...it, current_issues: text } : it));
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginTop: 16 }}>
          <div style={{ fontSize: 13, color: '#6b7280' }}>
            {getSmileTestSummaryText(pagination, t)}
          </div>
          <Pagination
            current={pagination.page}
            pageSize={pagination.page_size}
            total={pagination.total}
            showSizeChanger={false}
            onChange={(page) => {
              setExpanded({});
              setFilters((prev) => ({ ...prev, page, page_size: SMILE_TEST_PAGE_SIZE }));
            }}
            showTotal={(total) => t('admin.pagination.total', { total })}
          />
        </div>
        </>
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
            await loadSmileTests();
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
