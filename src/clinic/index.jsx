import React, { useEffect, useMemo, useState } from "react";
import apiService from "../services/api";

function Sidebar({ clinics = [], activeUuid, onSelect }) {
  return (
    <div style={{ width: 220, background: "#48d2ce", borderRadius: 18, padding: 12, color: "#fff", height: "calc(100vh - 40px)", boxSizing: 'border-box' }}>
      <div style={{ marginBottom: 12, textAlign: 'center', fontWeight: 600 }}>診所列表</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {(clinics || []).map((c) => (
          <div
            key={c.uuid || c.id}
            onClick={() => onSelect(c)}
            style={{
              padding: '10px 12px',
              background: activeUuid === c.uuid ? '#2bb3ae' : 'rgba(255,255,255,0.15)',
              borderRadius: 10,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {c.clinic_name || '—'}
          </div>
        ))}
      </div>
    </div>
  );
}

function DoctorRow({ doc }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 240px', padding: '10px 12px', alignItems: 'center' }}>
      <div style={{ fontWeight: 600, textAlign: 'left' }}>{doc.full_name || doc.username || '—'}</div>
      <div style={{ color: '#666', textAlign: 'left' }}>{doc.phone || '—'}</div>
      <div style={{ color: '#666', textAlign: 'left' }}>{doc.email || '—'}</div>
    </div>
  );
}

export default function ClinicDashboard() {
  const [clinics, setClinics] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [activeClinic, setActiveClinic] = useState(null);

  useEffect(() => {
    apiService.getClinics().then((res) => {
      if (res?.success) {
        setClinics(res.data || []);
        const first = (res.data || [])[0];
        if (first) setActiveClinic(first);
      }
    });
    apiService.getDoctorsWithClinic().then((res) => {
      if (res?.success) setDoctors(res.data || []);
    });
  }, []);

  const doctorsOfClinic = useMemo(() => {
    if (!activeClinic?.uuid) return [];
    return (doctors || []).filter((d) => (d?.clinic?.uuid || d?.department) === activeClinic.uuid);
  }, [activeClinic?.uuid, doctors]);

  return (
    <div style={{ display: 'flex', gap: 16, minHeight: '100vh', alignItems: 'flex-start' }}>
      <Sidebar clinics={clinics} activeUuid={activeClinic?.uuid} onSelect={setActiveClinic} />
      <div style={{ flex: 1, background: '#fff', borderRadius: 18, padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
          <div style={{ fontSize: 18, fontWeight: 700, textAlign: 'left' }}>診所資訊</div>
          <div style={{ color: '#666', textAlign: 'left' }}>{activeClinic?.clinic_name || '—'}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 8, columnGap: 20, marginBottom: 18, width: '100%' }}>
          <div style={{ textAlign: 'left' }}>地址：{activeClinic?.address || '—'}</div>
          <div style={{ textAlign: 'left' }}>城市：{activeClinic?.city || '—'}</div>
          <div style={{ textAlign: 'left' }}>電話：{activeClinic?.phone || '—'}</div>
          <div style={{ textAlign: 'left' }}>網站：{activeClinic?.website || '—'}</div>
        </div>

        <div style={{ margin: '10px 0 6px', fontSize: 16, fontWeight: 700, width: '100%', textAlign: 'left' }}>醫生列表</div>
        <div style={{ border: '1px solid #eef2f5', borderRadius: 10, overflow: 'hidden', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 240px', padding: '10px 12px', color: '#8898a8', fontWeight: 600, textAlign: 'left' }}>
            <div style={{ textAlign: 'left' }}>姓名</div>
            <div style={{ textAlign: 'left' }}>聯繫方式</div>
            <div style={{ textAlign: 'left' }}>信箱</div>
          </div>
          {(doctorsOfClinic || []).map((d) => (
            <DoctorRow key={d.uuid || d.id} doc={d} />
          ))}
          {doctorsOfClinic.length === 0 && <div style={{ padding: 12, color: '#999', textAlign: 'left' }}>暫無醫生</div>}
        </div>
      </div>
    </div>
  );
}


