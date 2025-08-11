import React, { useMemo, useState, useCallback, useEffect } from 'react';
import Logout from '../components/logout';
import './index.scss';
import apiService from '../services/api';
import { Modal, Select, message } from 'antd';

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
  const [createOpen, setCreateOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorUuid, setSelectedDoctorUuid] = useState('');
  const [targetSmileUuid, setTargetSmileUuid] = useState('');

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

  // 预取医生+诊所
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
                      {row.statusText === '創建患者信息' ? (
                        <button className="create-patient-info-button" onClick={(e) => { e.stopPropagation(); openBindPatientModal(row.smileUuid); }}>創建患者信息</button>
                      ) : (
                        row.statusText
                      )}
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
          const s = detail.data.smileTest;
          const payload = {
            full_name: s.full_name,
            birth_date: s.birth_date,
            gender: s.gender,
            phone: s.phone,
            email: s.email,
            line_id: s.line_id,
            city: s.city,
            assigned_doctor_uuid: selectedDoctorUuid,
          };
          const res = await apiService.createPatientWithSmileTest(payload);
          if (res?.success) {
            message.success('創建成功');
            // 将当条 smile_test 的 patient_uuid 标记为新创建患者
            try {
              if (res.data?.smileTest?.uuid && res.data?.patient?.uuid) {
                await apiService.put(`/api/smile-test/uuid/${res.data.smileTest.uuid}`, { patient_uuid: res.data.patient.uuid });
              }
            } catch {}
            setCreateOpen(false);
            setSelectedDoctorUuid('');
            // 重新拉取列表
            const again = await apiService.getAllSmileTests();
            if (again?.success && Array.isArray(again.data)) {
              const mapped = again.data.map((s, idx) => ({
                id: String(idx + 1).padStart(2, '0'),
                patientName: s.full_name || '—',
                region: s.city || '—',
                downloadUrl: '#',
                note: '',
                statusText: s?.patient_uuid || '創建患者信息',
                smileUuid: s.uuid,
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


