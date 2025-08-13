import React, { useCallback, useMemo, useRef, useState } from "react";
import { Badge, Button, Calendar, Modal, Space, Tag, Tooltip } from "antd";
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
}) {
  const [value, setValue] = useState(dayjs());
  const [events, setEvents] = useState(() => ensureSample(initialEvents));

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view"); // view | edit | create
  const [activeDate, setActiveDate] = useState(null); // dayjs
  const [activeEvent, setActiveEvent] = useState(null);

  const clickTimerRef = useRef(null);

  const dateToEvents = useMemo(() => groupByDate(events), [events]);

  const handleSelect = useCallback((d) => {
    setValue(d);
  }, []);

  const openCreateForDate = useCallback((d) => {
    setActiveEvent(null);
    setActiveDate(d.startOf("day"));
    setModalMode("create");
    setModalOpen(true);
  }, []);

  const openViewForEvent = useCallback((event) => {
    setActiveEvent(event);
    setActiveDate(dayjs(event.date));
    setModalMode("view");
    setModalOpen(true);
    onView && onView(event);
  }, [onView]);

  const handleItemClick = useCallback((event) => {
    // Distinguish single vs double click using timer
    if (clickTimerRef.current) {
      window.clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
      openViewForEvent(event); // treat as double click -> open detail
      return;
    }
    clickTimerRef.current = window.setTimeout(() => {
      clickTimerRef.current = null;
      setActiveEvent(event);
      setActiveDate(dayjs(event.date));
    }, 200);
  }, [openViewForEvent]);

  const handleContextMenuDate = useCallback((e, d) => {
    e.preventDefault();
    openCreateForDate(d);
  }, [openCreateForDate]);

  const handleOk = useCallback(async () => {
    if (modalMode === "create") {
      const draft = buildDraft(activeDate);
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
  }, [modalMode, activeDate, activeEvent, onCreate, onUpdate]);

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
          className="ant-picker-calendar-date schedule-date"
          onContextMenu={(e) => handleContextMenuDate(e, current)}
          onDoubleClick={() => openCreateForDate(current)}
        >
          <div className="ant-picker-calendar-date-value">{current.date()}</div>
          <div className="ant-picker-calendar-date-content" />
          {isSameMonth && list.length > 0 && (
            <ul className="schedule-card-events">
              {list.map((item) => (
                <li
                  key={item.id}
                  className="schedule-card-event"
                  onClick={() => handleItemClick(item)}
                  onDoubleClick={() => openViewForEvent(item)}
                >
                  <Badge color={statusToColor(item.status)} text={shortText(item.title)} />
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    },
    [dateToEvents, handleContextMenuDate, openCreateForDate, handleItemClick, openViewForEvent, value]
  );

  const renderModalContent = () => {
    if (modalMode === "create") {
      return (
        <div className="schedule-modal">
          <p>新增条目（内容待定）</p>
          <Tag color="blue">{activeDate?.format("YYYY-MM-DD")}</Tag>
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
        <p>查看详情（内容待定）</p>
        <pre>{JSON.stringify(activeEvent, null, 2)}</pre>
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

function statusToColor(status) {
  switch (status) {
    case "success":
      return "#52c41a"; // green
    case "warning":
      return "#faad14"; // yellow
    case "error":
      return "#ff4d4f"; // red
    default:
      return "#1677ff"; // blue
  }
}

function shortText(text, max = 12) {
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max)}...` : text;
}

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

function buildDraft(d) {
  return {
    id: `draft-${Math.random().toString(36).slice(2, 8)}`,
    date: d.startOf("day").toISOString(),
    title: "新建事项（待完善）",
    status: "default",
  };
}

function modalTitle(mode) {
  if (mode === "create") return "新增";
  if (mode === "edit") return "编辑";
  return "详情";
}


