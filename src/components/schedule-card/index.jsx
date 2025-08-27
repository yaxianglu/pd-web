import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Calendar, DatePicker, Modal, Select, Space, TimePicker, Tooltip, Input, Form, message, Table, Tag } from "antd";
import dayjs from "dayjs";
import "antd/dist/reset.css";
import "./index.scss";
import png13 from "../../asserts/13.png";
import { useAuth } from "../../context/AuthContext";
import HistoryModal from "../history-modal";

export default function ScheduleCard({
  title = "日曆",
  subtitle,
  style,
  doctorUuid,
  /**
   * initialEvents: Array of { id, date: string(YYYY-MM-DD), title, status: 'success'|'warning'|'error'|'default' }
   */
  initialEvents = [],
  onCreate, // (draft) => Promise | void
  onUpdate, // (event) => Promise | void
  onView, // (event) => void
  defaultMonth, // string | Dayjs, e.g. '2025-08-01'
  currentPatient, // { uuid, full_name } 可选，用于详情展示与创建默认归属
  currentDoctor, // { uuid, full_name } 可选：医生模式下仅展示与自己相关
  images = [], // 可選：老版本上傳/下載對應的圖片數組（base64或dataURL）
  onAppointmentCreated, // () => void 可选：创建成功后的回调
  smileTestUuid, // 可选：對應 smile_test 的 uuid，用於上傳鏈接
}) {
  const [value, setValue] = useState(defaultMonth ? dayjs(defaultMonth) : dayjs());
  const [events, setEvents] = useState(() => (currentPatient || currentDoctor ? [] : ensureSample(initialEvents)));
  const { userType } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view"); // view | edit | create | day
  const [activeDate, setActiveDate] = useState(null); // dayjs
  const [activeEvent, setActiveEvent] = useState(null);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [form] = Form.useForm();
  const fileInputRef = useRef(null);
  const [messageApi, messageCtx] = message.useMessage();
  
  // 历史资料弹窗状态
  const [historyModalOpen, setHistoryModalOpen] = useState(false);

  // lazy load doctors when opening create/edit modal
  const loadDoctors = useCallback(async () => {
    if (doctors.length > 0 || loadingDoctors) return;
    try {
      setLoadingDoctors(true);
      const api = (await import("../../services/api")).default;
      const res = await api.getDoctors();
      if (res && res.success) setDoctors(res.data || []);
    } catch (e) {
      // silent
    } finally {
      setLoadingDoctors(false);
    }
  }, [doctors.length, loadingDoctors]);

  // const clickTimerRef = useRef(null);

  const dateToEvents = useMemo(() => groupByDate(events), [events]);

  // Legacy download helpers (base64 images) with zip fallback
  const downloadBase64Image = useCallback((data, filename) => {
    if (!data) return;
    try {
      const hasHeader = typeof data === 'string' && data.startsWith('data:');
      const dataUrl = hasHeader ? data : `data:image/jpeg;base64,${data}`;
      const [header, body] = dataUrl.split(',');
      const mimeMatch = header && header.match(/data:(.*?);/);
      const mime = (mimeMatch && mimeMatch[1]) || 'image/jpeg';
      const binary = atob(body || '');
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      // noop
    }
  }, []);

  const handleDownloadAll = useCallback(async () => {
    const list = Array.isArray(images) ? images.filter(Boolean) : [];
    if (list.length > 0) {
      list.forEach((img, idx) => downloadBase64Image(img, `teeth_image_${idx + 1}.jpg`));
      return;
    }
    if (smileTestUuid) {
      const key = 'zip-download';
      try {
        messageApi.loading({ content: '正在準備下載...', key });
        const api = (await import("../../services/api")).default;
        const blob = await api.downloadSmilePhotosZip(smileTestUuid);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `smile_photos_${String(smileTestUuid).slice(0, 8)}.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        messageApi.success({ content: '下載已開始', key, duration: 1.5 });
      } catch (err) {
        messageApi.error({ content: '下載失敗', key });
      }
      return;
    }
    messageApi.warning('缺少微笑測試ID，無法下載');
  }, [images, smileTestUuid]);

  // ============ Staff generic file upload/download using smile_test.allergies ============
  const staffUploadAnyFile = useCallback(() => {
    if (!smileTestUuid) {
      messageApi.warning('缺少微笑測試ID');
      return;
    }
    try {
      fileInputRef.current?.click();
    } catch {}
  }, [smileTestUuid]);

  const onSelectStaffFile = useCallback(async (e) => {
    const file = e?.target?.files?.[0];
    if (!file || !smileTestUuid) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result; // data:*/*;base64,xxx
      try {
        const api = (await import("../../services/api")).default;
        // 使用新的API上传到smile_test_files表
        const result = await api.uploadOralScanFile(smileTestUuid, dataUrl, file.name);
        
        if (result.success) {
          messageApi.success('文件已上傳');
          try { Modal.success({ title: '提示', content: '文件已上傳', centered: true }); } catch {}
        } else {
          messageApi.error(result.message || '上傳失敗');
        }
      } catch (err) {
        messageApi.error(err?.message || '上傳失敗');
      } finally {
        try { e.target.value = ''; } catch {}
      }
    };
    reader.readAsDataURL(file);
  }, [smileTestUuid]);

  const staffDownloadAnyFile = useCallback(async () => {
    if (!smileTestUuid) {
      messageApi.warning('缺少微笑測試ID');
      return;
    }
    try {
      const api = (await import("../../services/api")).default;
      // 获取文件列表，找到最新的口扫文件
      const filesResult = await api.getSmileTestFiles(smileTestUuid);
      
      if (!filesResult.success) {
        messageApi.warning(filesResult.message || '沒有可下載的文件');
        return;
      }
      
      // 过滤出口扫文件，按上传时间排序
      const oralScanFiles = filesResult.data
        .filter(file => file.upload_type === 'oral_scan' && file.status === 'normal')
        .sort((a, b) => new Date(b.upload_time) - new Date(a.upload_time));
      
      if (oralScanFiles.length === 0) {
        messageApi.warning('沒有可下載的口掃文件');
        return;
      }
      
      // 下载最新的口扫文件
      const latestFile = oralScanFiles[0];
      const downloadResult = await api.downloadFile(latestFile.uuid);
      
      if (downloadResult.success && downloadResult.data) {
        const blob = downloadResult.data;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = latestFile.file_name || 'oral_scan_file';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        messageApi.success('下載已開始');
      } else {
        messageApi.error(downloadResult.message || '下載失敗');
      }
    } catch (err) {
      messageApi.error(err?.message || '下載失敗');
    }
  }, [smileTestUuid]);

  const loadAppointmentsForMonth = useCallback(async (d) => {
    try {
      const api = (await import("../../services/api")).default;
      const y = d.year();
      const m = d.month() + 1; // 0-based to 1-based
      const res = await api.getAppointmentsByMonth(y, m);
      if (res && Array.isArray(res)) {
        const mapped = res.map((a) => ({
          id: a.id || a.uuid || Math.random().toString(36).slice(2, 8),
          date: dayjs(a.date).toISOString(),
          title: a.note || "預約",
          note: a.note || "",
          doctor_uuid: a.doctor_uuid || null,
          doctor_name: a.doctor_name || null,
          patient_uuid: a.patient_uuid || null,
          patient_name: a.patient_name || null,
          start_time: a.start_time || null,
          end_time: a.end_time || null,
          // 顯示中文狀態：新增後顯示「預約完成」
          status: a.status === "取消" ? "失敗" : "預約完成",
        }));
        
        // 前端过滤：只显示当前患者和医生的预约
        let filtered = mapped;
        if (currentPatient?.uuid) {
          console.log('过滤患者预约:', currentPatient.uuid);
          filtered = filtered.filter(event => {
            const matches = event.patient_uuid === currentPatient.uuid;
            console.log('预约患者UUID:', event.patient_uuid, '当前患者UUID:', currentPatient.uuid, '匹配:', matches);
            return matches;
          });
        }
        if (currentDoctor?.uuid) {
          console.log('过滤医生预约:', currentDoctor.uuid);
          filtered = filtered.filter(event => {
            const matches = event.doctor_uuid === currentDoctor.uuid;
            console.log('预约医生UUID:', event.doctor_uuid, '当前医生UUID:', currentDoctor.uuid, '匹配:', matches);
            return matches;
          });
        }
        console.log('过滤前预约数量:', mapped.length, '过滤后预约数量:', filtered.length);
        
        setEvents(() => {
          // 在患者模式下不回退到本地樣例，避免顯示與自己無關的資料
          if (currentPatient || currentDoctor) return filtered;
          const base = Array.isArray(initialEvents) && initialEvents.length > 0 ? initialEvents : [];
          return filtered.length > 0 ? filtered : base;
        });
      }
    } catch (e) {
      // fail silently; keep existing events (可能是本地样例)
    }
  }, [initialEvents, currentPatient?.uuid, currentPatient?.full_name, currentDoctor?.uuid, currentDoctor?.full_name]);

  useEffect(() => {
    loadAppointmentsForMonth(value);
  }, [loadAppointmentsForMonth, value]);

  const handleSelect = useCallback((d) => {
    setValue(d);
  }, []);

  const openCreateForDate = useCallback((d) => {
    setActiveEvent(null);
    setActiveDate(d.startOf("day"));
    setModalMode("create");
    setModalOpen(true);
    loadDoctors();
    try {
      form.resetFields();
      form.setFieldsValue({
        date: d.startOf("day"),
        doctor_uuid: undefined,
        start_time: null,
        end_time: dayjs("18:00", "HH:mm"),
        note: "",
      });
    } catch {}
  }, [loadDoctors, form]);

  const openViewForEvent = useCallback((event) => {
    setActiveEvent(event);
    setActiveDate(dayjs(event.date));
    setModalMode("view");
    setModalOpen(true);
    onView && onView(event);
  }, [onView]);

  const openEditForEvent = useCallback((event) => {
    setActiveEvent(event);
    setActiveDate(dayjs(event.date));
    setModalMode("edit");
    setModalOpen(true);
    loadDoctors();
    try {
      form.resetFields();
      form.setFieldsValue({
        date: dayjs(event.date),
        doctor_uuid: event.doctor_uuid,
        start_time: event.start_time ? dayjs(event.start_time, 'HH:mm') : null,
        end_time: event.end_time ? dayjs(event.end_time, 'HH:mm') : null,
        note: event.note || event.title || '',
      });
    } catch {}
  }, [form, loadDoctors]);

  const openDayDetails = useCallback((d) => {
    setActiveEvent(null);
    setActiveDate(d.startOf("day"));
    setModalMode("day");
    setModalOpen(true);
  }, []);

  // open event detail when click in day modal list
  // removed: list items are only shown in day modal; click there directly opens detail

  const handleContextMenuDate = useCallback((e, d) => {
    e.preventDefault();
    openCreateForDate(d);
  }, [openCreateForDate]);

  const handleCancelAppointment = useCallback(async (appointment) => {
    console.log('取消预约被调用:', appointment);
    
    // 先测试简单的确认
    const confirmed = window.confirm('確定要取消這個預約嗎？取消後無法恢復。');
    if (!confirmed) {
      console.log('用户取消操作');
      return;
    }
    
    console.log('用户确认取消，开始执行取消操作');
    try {
      const api = (await import("../../services/api")).default;
      console.log('准备调用取消API，预约ID:', appointment.id || appointment.uuid);
      const res = await api.cancelAppointment(appointment.id || appointment.uuid);
      console.log('取消预约API响应:', res);
      if (res && res.success) {
        messageApi.success('预约已取消');
        // 关闭当前详情模态框
        setModalOpen(false);
        // 重新加载当月数据
        setTimeout(() => {
          loadAppointmentsForMonth(value);
        }, 100);
      } else {
        messageApi.error(res?.message || '取消失败');
      }
    } catch (e) {
      console.error('取消预约失败:', e);
      messageApi.error(e?.message || '取消失败');
    }
  }, [value, setModalOpen]);

  const handleOk = useCallback(async () => {
    if (modalMode === "create") {
      const api = (await import("../../services/api")).default;
      const values = await form.validateFields().catch(() => null);
      if (!values) return;
      const payload = {
        date: (values.date || activeDate)?.format("YYYY-MM-DD"),
        start_time: values.start_time ? values.start_time.format("HH:mm:ss") : null,
        end_time: values.end_time ? values.end_time.format("HH:mm:ss") : null,
        doctor_uuid: values.doctor_uuid || null,
        patient_uuid: currentPatient?.uuid || null,
        note: values.note || "",
        status: "scheduled",
      };
      try {
        await api.createAppointment(payload);
        messageApi.success("已創建預約");
        if (onAppointmentCreated) onAppointmentCreated();
        // 後端持久化：將患者進度設置為 1（預約完成）
        try {
          if (currentPatient?.uuid) {
            const api2 = (await import("../../services/api")).default;
            await api2.updatePatientProgress(currentPatient.uuid, 1);
          }
        } catch {}
        // 兼容：患者端立即把本地進度設為 1
        try {
          const setParentProgress = (window.__setPatientProgressStep__);
          if (typeof setParentProgress === 'function') setParentProgress(1);
        } catch {}
      } catch (e) {
        messageApi.error(e?.message || "創建失敗");
      }
      const draft = {
        id: `local-${Math.random().toString(36).slice(2, 8)}`,
        date: dayjs(payload.date).toISOString(),
        title: payload.note || "預約",
        note: payload.note || "",
        doctor_uuid: payload.doctor_uuid,
        doctor_name:
          doctors.find((d) => d.uuid === payload.doctor_uuid || d.id === payload.doctor_uuid)?.username || null,
        patient_uuid: payload.patient_uuid,
        patient_name: currentPatient?.full_name || null,
        start_time: payload.start_time,
        end_time: payload.end_time,
        // 直接以中文顯示
        status: "預約完成",
      };
      let created = draft;
      try {
        if (onCreate) {
          const ret = await onCreate(draft);
          created = ret || draft;
        }
      } finally {
        setEvents((prev) => [...prev, created]);
      }
    } else if (modalMode === "edit" && activeEvent) {
      const api = (await import("../../services/api")).default;
      const values = await form.validateFields().catch(() => null);
      if (!values) return;
      // 僅提交允許更新的欄位，避免把中文狀態傳到後端（ENUM）
      const updated = {
        id: activeEvent.id,
        uuid: activeEvent.uuid,
        date: (values.date || activeDate)?.format("YYYY-MM-DD"),
        start_time: values.start_time ? values.start_time.format("HH:mm:ss") : null,
        end_time: values.end_time ? values.end_time.format("HH:mm:ss") : null,
        doctor_uuid: values.doctor_uuid || null,
        note: values.note || "",
      };
      try {
        await api.updateAppointment(activeEvent.id || activeEvent.uuid, {
          date: updated.date,
          start_time: updated.start_time,
          end_time: updated.end_time,
          doctor_uuid: updated.doctor_uuid,
          note: updated.note,
        });
        messageApi.success('已更新');
        setActiveEvent(updated);
        // 強制刷新當月數據，避免 id/uuid 類型不一致導致本地替換失敗
        await loadAppointmentsForMonth(value);
      } catch (e) {
        messageApi.error(e?.message || '更新失敗');
      } finally {
        setEvents((prev) => prev.map((ev) => ((ev.id === activeEvent.id || ev.uuid === activeEvent.uuid) ? { ...ev, ...updated } : ev)));
      }
    }
    setModalOpen(false);
  }, [modalMode, activeDate, activeEvent, onCreate, onUpdate, form, currentPatient?.uuid, currentPatient?.full_name, doctors, onAppointmentCreated]);

  const headerRender = useCallback(
    ({ value: headerValue, onChange }) => {
      const prevMonth = () => onChange(headerValue.clone().subtract(1, "month"));
      const nextMonth = () => onChange(headerValue.clone().add(1, "month"));
      return (
        <div className="schedule-card-cal-header">
          <Button size="small" onClick={prevMonth} className="nav-btn">‹</Button>
          <div className="label">{headerValue.format("YYYY年 MMM")}</div>
          <Button size="small" onClick={nextMonth} className="nav-btn">›</Button>
        </div>
      );
    },
    []
  );

  const dateFullCellRender = useCallback(
    (current) => {
      const key = current.format("YYYY-MM-DD");
      const list = dateToEvents.get(key) || [];
      const isSameMonth = current.isSame(value, "month");
      return (
        <div
          className={`ant-picker-calendar-date schedule-date ${isSameMonth && list.length > 0 ? "has-events" : ""}`}
          onContextMenu={(e) => handleContextMenuDate(e, current)}
          
        >
          <div
            className="ant-picker-calendar-date-value"
            onClick={(e) => {
              if (isSameMonth && list.length > 0) {
                e.stopPropagation();
                openDayDetails(current);
              }
            }}
          >
            {current.date()}
          </div>
          <div className="ant-picker-calendar-date-content" />
        </div>
      );
    },
    [dateToEvents, handleContextMenuDate, openCreateForDate, openDayDetails, value]
  );

  const renderModalContent = () => {
    if (modalMode === "day") {
      const key = activeDate?.format("YYYY-MM-DD");
      const list = (key && dateToEvents.get(key)) || [];
      const columns = [
        {
          title: "日期",
          dataIndex: "date",
          key: "date",
          className: 'col-date',
          render: (_, r) => dayjs(r.date).format("YYYY-MM-DD"),
          width: 160,
        },
        {
          title: "時間",
          dataIndex: "start_time",
          key: "time",
          className: 'col-time',
          render: (_, r) => `${formatHm(r.start_time) || "--"} ~ ${formatHm(r.end_time) || "--"}`,
          width: 160,
        },
        {
          title: "醫生",
          dataIndex: "doctor_name",
          key: "doctor",
          className: 'col-doctor',
          render: (_, r) => r.doctor_name || getDoctorName(doctors, r.doctor_uuid) || "-",
          width: 160,
        },
        {
          title: "患者",
          dataIndex: "patient_name",
          key: "patient",
          className: 'col-patient',
          render: (_, r) => r.patient_name || currentPatient?.full_name || "-",
          width: 160,
        },
        {
          title: "備註",
          dataIndex: "note",
          key: "note",
          className: 'col-note',
          ellipsis: true,
        },
        {
          title: "狀態",
          dataIndex: "status",
          key: "status",
          className: 'col-status',
          render: (v) => <Tag color={v === 'cancelled' ? 'red' : v === 'completed' ? 'green' : 'blue'}>{v || '-'}</Tag>,
          width: 120,
        },
        {
          title: "操作",
          dataIndex: "action",
          key: "action",
          className: 'col-action',
          render: (_, r) => (
            userType !== 'patient' ? (
              <Space>
                <a onClick={(e) => {
                  console.log('编辑按钮被点击:', r);
                  e.stopPropagation();
                  openEditForEvent(r);
                }}>編輯</a>
                <a onClick={(e) => {
                  console.log('取消按钮被点击:', r);
                  e.stopPropagation();
                  e.preventDefault();
                  handleCancelAppointment(r);
                }} style={{ color: '#ff4d4f', cursor: 'pointer' }}>取消</a>
              </Space>
            ) : null
          ),
          width: 120,
        },
      ];
      return (
        <div className="schedule-modal">
          <Table
            rowKey={(r) => r.id}
            size="small"
            pagination={false}
            columns={columns}
            dataSource={list}
            scroll={{ y: 360, x: true }}
            
          />
        </div>
      );
    }
    if (modalMode === "create" || (modalMode === 'edit' && userType !== 'patient')) {
      return (
        <div className="schedule-modal">
          <Form form={form} layout="vertical" initialValues={{
            date: activeDate,
            start_time: modalMode === 'edit' ? (activeEvent?.start_time ? dayjs(activeEvent.start_time, 'HH:mm') : null) : null,
            end_time: modalMode === 'edit' ? (activeEvent?.end_time ? dayjs(activeEvent.end_time, 'HH:mm') : dayjs("18:00", "HH:mm")) : dayjs("18:00", "HH:mm"),
            doctor_uuid: activeEvent?.doctor_uuid,
            note: activeEvent?.note || "",
          }}>
            <Form.Item name="date" label="日期" rules={[{ required: true, message: "請選擇日期" }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="doctor_uuid" label="醫生">
              <Select
                placeholder="選擇醫生"
                loading={loadingDoctors}
                options={doctors.map((d) => ({ label: d.full_name || d.username || d.email, value: d.uuid || d.id }))}
              />
            </Form.Item>
            <Form.Item name="start_time" label="開始時間">
              <TimePicker style={{ width: "100%" }} format="HH:mm" />
            </Form.Item>
            <Form.Item name="end_time" label="結束時間">
              <TimePicker style={{ width: "100%" }} format="HH:mm" />
            </Form.Item>
            <Form.Item name="note" label="備註">
              <Input.TextArea rows={3} placeholder="備註資訊" />
            </Form.Item>
          </Form>
        </div>
      );
    }
    if (modalMode === "edit") {
      return (
        <div className="schedule-modal">
          <p>編輯條目（內容待定）</p>
          <pre>{JSON.stringify(activeEvent, null, 2)}</pre>
        </div>
      );
    }
    // view
    return (
      <div className="schedule-modal">
        <div style={{ display: "grid", gridTemplateColumns: "96px 1fr", rowGap: 8, columnGap: 8 }}>
          <div>醫生</div>
          <div>{activeEvent?.doctor_name || getDoctorName(doctors, activeEvent?.doctor_uuid) || "-"}</div>
          <div>患者</div>
          <div>{activeEvent?.patient_name || currentPatient?.full_name || "-"}</div>
          <div>日期</div>
          <div>{activeEvent?.date ? dayjs(activeEvent.date).format("YYYY-MM-DD") : activeDate?.format("YYYY-MM-DD")}</div>
          <div>開始時間</div>
          <div>{formatHm(activeEvent?.start_time) || "-"}</div>
          <div>結束時間</div>
          <div>{formatHm(activeEvent?.end_time) || "-"}</div>
          <div>備註</div>
          <div>{activeEvent?.note || activeEvent?.title || "-"}</div>
          <div>狀態</div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>{activeEvent?.status || '-'}</span>
            {userType !== 'patient' && (
              <Button size="small" style={{ marginLeft: 12 }} onClick={() => setModalMode('edit')}>編輯</Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="schedule-card" style={style}>
      <div className="schedule-card-header">
        <div className="schedule-card-title">{title}</div>
        {subtitle && <div className="schedule-card-subtitle">{subtitle}</div>}
        {userType !== 'patient' && (
          <Space>
            <Tooltip title="當天新增">
              <Button size="small" type="primary" onClick={() => openCreateForDate(dayjs())}>
                新增
              </Button>
            </Tooltip>
          </Space>
        )}
      </div>
      <Calendar
        fullscreen={false}
        value={value}
        onChange={(d) => setValue(d)}
        onSelect={handleSelect}
        headerRender={headerRender}
        dateFullCellRender={dateFullCellRender}
      />

      {currentPatient && (
        <div className="schedule-card-footer-tools">
          <div className="qr-box">
            <img src={png13} alt="QR" />
          </div>
          <div className="schedule-card-footer-tools-buttons">
            <button
              type="button"
              style={{ background: '#fff', border: '1.2px solid #e3eae8', color: '#666', fontWeight: 600, fontSize: 14, borderRadius: 10, padding: '6px 24px', cursor: 'pointer' }}
              onClick={() => {
                if (userType === 'patient') {
                  const idForUpload = smileTestUuid || currentPatient?.uuid;
                  const url = idForUpload ? `/upload?id=${encodeURIComponent(idForUpload)}&step=4` : '/upload';
                  window.open(url, '_blank');
                } else {
                  staffUploadAnyFile();
                }
              }}
            >
              上傳
            </button>
            {/* <bue */}
            <button
              type="button"
              style={{ background: '#fff', border: '1.2px solid #e3eae8', color: '#666', fontWeight: 600, fontSize: 14, borderRadius: 10, padding: '6px 24px', cursor: 'pointer' }}
              onClick={() => setHistoryModalOpen(true)}
            >
              歷史資料
            </button>
          </div>
        </div>
      )}

      {/* hidden input for staff file upload */}
      <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={onSelectStaffFile} />
      {messageCtx}

      {/* legacy tools moved to header for visibility */}

      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        title={modalTitle(modalMode)}
        width={modalMode === 'day' ? 900 : 560}
        centered
        bodyStyle={{ maxHeight: modalMode === 'day' ? 560 : 440, overflowY: 'auto' }}
        footer={
          <Space>
            <Button onClick={() => setModalOpen(false)}>取消</Button>
            {modalMode === 'view' && userType !== 'patient' && (
              <Button onClick={() => setModalMode('edit')}>編輯</Button>
            )}
            <Button type="primary" onClick={handleOk}>{modalMode === 'view' ? '關閉' : '確定'}</Button>
          </Space>
        }
      >
        {renderModalContent()}
      </Modal>
      
      {/* 历史资料弹窗 */}
      <HistoryModal
        open={historyModalOpen}
        onCancel={() => setHistoryModalOpen(false)}
        smileTestUuid={smileTestUuid}
        userType={userType}
      />
    </div>
  );
}

// Helpers
function groupByDate(items) {
  const map = new Map();
  for (const item of items) {
    const key = dayjs(item.date).format("YYYY-MM-DD");
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  }
  return map;
}

// status colors reserved for future use

// removed local truncation util; we show full text in modal

function ensureSample(initial) {
  if (Array.isArray(initial) && initial.length > 0) return initial;
  const today = dayjs();
  const base = today.date(10);
  return [
    { id: "e1", date: base.toISOString(), title: "This is warning", status: "warning" },
    { id: "e2", date: base.add(0, "day").toISOString(), title: "This is usual", status: "success" },
    { id: "e3", date: base.add(0, "day").toISOString(), title: "This is error", status: "error" },
    { id: "e4", date: base.add(5, "day").toISOString(), title: "This is warn on 15", status: "warning" },
    { id: "e5", date: base.add(5, "day").toISOString(), title: "This is success on 15", status: "success" },
    { id: "e6", date: base.add(5, "day").toISOString(), title: "This is error on 15", status: "error" },
  ];
}

// helpers
function getDoctorName(doctors, uuid) {
  if (!uuid) return null;
  const found = (doctors || []).find((d) => d.uuid === uuid || d.id === uuid);
  return found ? (found.full_name || found.username || found.email) : null;
}

function formatHm(value) {
  if (!value) return null;
  // accept 'HH:mm:ss' or Date/Dayjs
  if (typeof value === 'string') {
    const [h, m] = value.split(':');
    if (!h || !m) return value;
    return `${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
  }
  try {
    return dayjs(value).format('HH:mm');
  } catch {
    return String(value);
  }
}

function modalTitle(mode) {
  if (mode === "create") return "新增";
  if (mode === "edit") return "編輯";
  return "詳情";
}


