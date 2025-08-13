import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Calendar, DatePicker, Modal, Select, Space, TimePicker, Tooltip, Input, Form, message, Table, Tag } from "antd";
import dayjs from "dayjs";
import "antd/dist/reset.css";
import "./index.scss";

export default function ScheduleCard({
  title = "日历",
  subtitle,
  style,
  /**
   * initialEvents: Array of { id, date: string(YYYY-MM-DD), title, status: 'success'|'warning'|'error'|'default' }
   */
  initialEvents = [],
  onCreate, // (draft) => Promise | void
  onUpdate, // (event) => Promise | void
  onView, // (event) => void
  defaultMonth, // string | Dayjs, e.g. '2025-08-01'
  currentPatient, // { uuid, full_name } 可选，用于详情展示与创建默认归属
}) {
  const [value, setValue] = useState(defaultMonth ? dayjs(defaultMonth) : dayjs());
  const [events, setEvents] = useState(() => ensureSample(initialEvents));

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view"); // view | edit | create | day
  const [activeDate, setActiveDate] = useState(null); // dayjs
  const [activeEvent, setActiveEvent] = useState(null);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [form] = Form.useForm();

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
          title: a.note || "预约",
          note: a.note || "",
          doctor_uuid: a.doctor_uuid || null,
          doctor_name: a.doctor_name || null,
          patient_uuid: a.patient_uuid || null,
          patient_name: a.patient_name || null,
          start_time: a.start_time || null,
          end_time: a.end_time || null,
          status: a.status === "取消" ? "失敗" : "預約成功",
        }));
        setEvents((initial) => {
          // Replace sample with server data; if initial was real, merge unique by id
          const base = Array.isArray(initialEvents) && initialEvents.length > 0 ? initialEvents : [];
          return mapped.length > 0 ? mapped : base;
        });
      }
    } catch (e) {
      // fail silently; keep existing events (可能是本地样例)
    }
  }, [initialEvents]);

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
        message.success("已创建预约");
      } catch (e) {
        message.error(e?.message || "创建失败");
      }
      const draft = {
        id: `local-${Math.random().toString(36).slice(2, 8)}`,
        date: dayjs(payload.date).toISOString(),
        title: payload.note || "预约",
        note: payload.note || "",
        doctor_uuid: payload.doctor_uuid,
        doctor_name:
          doctors.find((d) => d.uuid === payload.doctor_uuid || d.id === payload.doctor_uuid)?.username || null,
        patient_uuid: payload.patient_uuid,
        patient_name: currentPatient?.full_name || null,
        start_time: payload.start_time,
        end_time: payload.end_time,
        status: "success",
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
      const updated = { ...activeEvent };
      try {
        if (onUpdate) {
          const ret = await onUpdate(updated);
          if (ret) Object.assign(updated, ret);
        }
      } finally {
        setEvents((prev) => prev.map((ev) => (ev.id === updated.id ? updated : ev)));
      }
    }
    setModalOpen(false);
  }, [modalMode, activeDate, activeEvent, onCreate, onUpdate, form, currentPatient?.uuid, currentPatient?.full_name, doctors]);

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
          onDoubleClick={() => openCreateForDate(current)}
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
          title: "时间",
          dataIndex: "start_time",
          key: "time",
          render: (_, r) => `${formatHm(r.start_time) || "--"} ~ ${formatHm(r.end_time) || "--"}`,
          width: 160,
        },
        {
          title: "医生",
          dataIndex: "doctor_name",
          key: "doctor",
          render: (_, r) => r.doctor_name || getDoctorName(doctors, r.doctor_uuid) || "-",
          width: 160,
        },
        {
          title: "患者",
          dataIndex: "patient_name",
          key: "patient",
          render: (_, r) => r.patient_name || currentPatient?.full_name || "-",
          width: 160,
        },
        {
          title: "备注",
          dataIndex: "note",
          key: "note",
          ellipsis: true,
        },
        {
          title: "状态",
          dataIndex: "status",
          key: "status",
          render: (v) => <Tag color={v === 'cancelled' ? 'red' : v === 'completed' ? 'green' : 'blue'}>{v || '-'}</Tag>,
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
            // onRow={(record) => ({ onClick: () => openViewForEvent(record) })}
          />
        </div>
      );
    }
    if (modalMode === "create") {
      return (
        <div className="schedule-modal">
          <Form form={form} layout="vertical" initialValues={{
            date: activeDate,
            start_time: null,
            end_time: dayjs("18:00", "HH:mm"),
            doctor_uuid: undefined,
            note: "",
          }}>
            <Form.Item name="date" label="日期" rules={[{ required: true, message: "请选择日期" }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="doctor_uuid" label="医生">
              <Select
                placeholder="选择医生"
                loading={loadingDoctors}
                options={doctors.map((d) => ({ label: d.full_name || d.username || d.email, value: d.uuid || d.id }))}
              />
            </Form.Item>
            <Form.Item name="start_time" label="开始时间">
              <TimePicker style={{ width: "100%" }} format="HH:mm" />
            </Form.Item>
            <Form.Item name="end_time" label="结束时间">
              <TimePicker style={{ width: "100%" }} format="HH:mm" />
            </Form.Item>
            <Form.Item name="note" label="备注">
              <Input.TextArea rows={3} placeholder="备注信息" />
            </Form.Item>
          </Form>
        </div>
      );
    }
    if (modalMode === "edit") {
      return (
        <div className="schedule-modal">
          <p>编辑条目（内容待定）</p>
          <pre>{JSON.stringify(activeEvent, null, 2)}</pre>
        </div>
      );
    }
    // view
    return (
      <div className="schedule-modal">
        <div style={{ display: "grid", gridTemplateColumns: "96px 1fr", rowGap: 8, columnGap: 8 }}>
          <div>医生</div>
          <div>{activeEvent?.doctor_name || getDoctorName(doctors, activeEvent?.doctor_uuid) || "-"}</div>
          <div>患者</div>
          <div>{activeEvent?.patient_name || currentPatient?.full_name || "-"}</div>
          <div>日期</div>
          <div>{activeEvent?.date ? dayjs(activeEvent.date).format("YYYY-MM-DD") : activeDate?.format("YYYY-MM-DD")}</div>
          <div>开始时间</div>
          <div>{formatHm(activeEvent?.start_time) || "-"}</div>
          <div>结束时间</div>
          <div>{formatHm(activeEvent?.end_time) || "-"}</div>
          <div>备注</div>
          <div>{activeEvent?.note || activeEvent?.title || "-"}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="schedule-card" style={style}>
      <div className="schedule-card-header">
        <div className="schedule-card-title">{title}</div>
        {subtitle && <div className="schedule-card-subtitle">{subtitle}</div>}
        <Space>
          <Tooltip title="当天新增">
            <Button size="small" type="primary" onClick={() => openCreateForDate(dayjs())}>
              新增
            </Button>
          </Tooltip>
        </Space>
      </div>
      <Calendar
        fullscreen={false}
        value={value}
        onChange={(d) => setValue(d)}
        onSelect={handleSelect}
        headerRender={headerRender}
        dateFullCellRender={dateFullCellRender}
      />

      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleOk}
        okText={modalMode === "view" ? "关闭" : "确定"}
        cancelText="取消"
        title={modalTitle(modalMode)}
        width={modalMode === 'day' ? 900 : 560}
        centered
        bodyStyle={{ maxHeight: modalMode === 'day' ? 560 : 440, overflowY: 'auto' }}
        footer={
          modalMode === "view" ? (
            <Space>
              <Button onClick={() => setModalOpen(false)}>关闭</Button>
              <Button type="primary" onClick={() => setModalMode("edit")}>
                编辑
              </Button>
            </Space>
          ) : undefined
        }
      >
        {renderModalContent()}
      </Modal>
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
  if (mode === "edit") return "编辑";
  return "详情";
}


