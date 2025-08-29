import React, { useState, useCallback, useEffect } from 'react';
import { Modal, Form, Input, TimePicker, DatePicker, Select, message, Space, Tag, Table, Button } from 'antd';
import dayjs from 'dayjs';

const AppointmentModal = ({ 
  open, 
  onCancel, 
  mode, // 'day' | 'edit' | 'create'
  activeDate, 
  activeEvent, 
  appointments = [],
  doctors = [],
  loadingDoctors = false,
  onUpdate,
  onEdit,
  onCreate,
  userType = 'doctor'
}) => {
  const [form] = Form.useForm();
  const [messageApi, messageCtx] = message.useMessage();
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(false);

  // 获取模态框标题
  const getModalTitle = (mode) => {
    switch (mode) {
      case "day": return "預約列表";
      case "edit": return "編輯預約";
      case "create": return "新增預約";
      default: return "預約";
    }
  };

  // 加载患者列表
  const loadPatients = useCallback(async () => {
    if (patients.length > 0 || loadingPatients) return;
    try {
      setLoadingPatients(true);
      const api = (await import("../../services/api")).default;
      const res = await api.getAllSmileTests();
      console.log('患者列表API响应:', res);
      if (res && res.success && Array.isArray(res.data)) {
        setPatients(res.data);
      } else {
        console.log('患者列表數據格式不正確:', res);
        setPatients([]);
      }
    } catch (error) {
      console.error('加載患者列表失敗:', error);
      setPatients([]);
    } finally {
      setLoadingPatients(false);
    }
  }, [patients.length, loadingPatients]);

  // 处理编辑
  const handleEdit = useCallback((appointment) => {
    if (onEdit) {
      onEdit(appointment);
    }
  }, [onEdit]);

  // 处理模态框确认
  const handleOk = useCallback(async () => {
    if (mode === "create") {
      try {
        const values = await form.validateFields();
        
        const payload = {
          date: (values.date || activeDate)?.format("YYYY-MM-DD"),
          start_time: values.start_time ? values.start_time.format("HH:mm:ss") : null,
          end_time: values.end_time ? values.end_time.format("HH:mm:ss") : null,
          doctor_uuid: values.doctor_uuid || null,
          patient_uuid: values.patient_uuid || null,
          note: values.note || "",
          status: "scheduled",
        };

        if (onCreate) {
          await onCreate(payload);
          messageApi.success('預約創建成功');
        }
      } catch (error) {
        console.error('創建預約失敗:', error);
        messageApi.error('創建失敗: ' + (error?.message || '未知錯誤'));
      }
    } else if (mode === "edit" && activeEvent) {
      try {
        const values = await form.validateFields();
        
        const updated = {
          id: activeEvent.id,
          uuid: activeEvent.uuid,
          date: values.date?.format("YYYY-MM-DD"),
          start_time: values.start_time ? values.start_time.format("HH:mm:ss") : null,
          end_time: values.end_time ? values.end_time.format("HH:mm:ss") : null,
          doctor_uuid: values.doctor_uuid || null,
          note: values.note || "",
          patient_name: values.patient_name || "",
        };

        if (onUpdate) {
          await onUpdate(updated);
          messageApi.success('預約更新成功');
        }
      } catch (error) {
        console.error('更新預約失敗:', error);
        messageApi.error('更新失敗: ' + (error?.message || '未知錯誤'));
      }
    }
  }, [mode, activeEvent, activeDate, form, onUpdate, onCreate, messageApi]);

  // 渲染日期列表内容
  const renderDayContent = () => {
    if (!activeDate) return null;
    
    const dateStr = activeDate.format('YYYY-MM-DD');
    const dayAppointments = appointments.filter(appointment => {
      const dateField = appointment.date || appointment.appointment_date || appointment.scheduled_date;
      if (!dateField) return false;
      const aptDate = dayjs(dateField).format('YYYY-MM-DD');
      return aptDate === dateStr;
    });

    const columns = [
      {
        title: "序号",
        dataIndex: "index",
        key: "index",
        width: 60,
        render: (_, __, index) => index + 1,
      },
      {
        title: "時間",
        dataIndex: "time",
        key: "time",
        width: 160,
        render: (_, record) => `${record.start_time || '-'} ~ ${record.end_time || '-'}`,
      },
      {
        title: "醫生",
        dataIndex: "doctor_name",
        key: "doctor",
        width: 120,
        render: (_, record) => record.doctor_name || 'lyx_doctor_user',
      },
      {
        title: "患者",
        dataIndex: "patient_name",
        key: "patient",
        width: 120,
        render: (_, record) => record.patient_name || record.patientName || record.name || '-',
      },
      {
        title: "備註",
        dataIndex: "note",
        key: "note",
        ellipsis: true,
      },
      {
        title: "狀態",
        dataIndex: "status",
        key: "status",
        width: 100,
        render: (status) => (
          <Tag color={status === 'cancelled' ? 'red' : status === 'completed' ? 'green' : 'blue'}>
            {status || '預約完成'}
          </Tag>
        ),
      },
      {
        title: "操作",
        dataIndex: "action",
        key: "action",
        width: 80,
        render: (_, record) => (
          userType !== 'patient' ? (
            <Button 
              type="link" 
              onClick={() => handleEdit(record)} 
              style={{ padding: 0, height: 'auto' }}
            >
              編輯
            </Button>
          ) : null
        ),
      },
    ];

    return (
      <div className="day-appointments">
        <div style={{ marginBottom: 16 }}>
          <h3>{activeDate.format("YYYY年MM月DD日")} 的預約</h3>
        </div>
        <Table
          rowKey={(record) => record.id || record.uuid}
          size="small"
          pagination={false}
          columns={columns}
          dataSource={dayAppointments}
          scroll={{ y: 360, x: true }}
        />
      </div>
    );
  };

  console.info('patients', patients)

        // 當編輯模式打開時，設置表單的初始值
  useEffect(() => {
    if (activeEvent && mode === 'edit') {
      console.log('編輯模式 - 設置表單初始值:', activeEvent);
      
      // 检查patient_uuid是否有效（在患者列表中存在）
      const isValidPatientUuid = activeEvent.patient_uuid && 
        patients.some(p => p.uuid === activeEvent.patient_uuid);
      
      form.setFieldsValue({
        date: activeEvent.date ? dayjs(activeEvent.date) : activeDate,
        patient_uuid: isValidPatientUuid ? activeEvent.patient_uuid : '',
        start_time: activeEvent.start_time ? dayjs(activeEvent.start_time, 'HH:mm') : null,
        end_time: activeEvent.end_time ? dayjs(activeEvent.end_time, 'HH:mm') : dayjs("18:00", "HH:mm"),
        doctor_uuid: activeEvent.doctor_uuid || activeEvent.doctorUuid,
        note: activeEvent.note || '',
      });
      
      // 如果patient_uuid无效，显示警告
      if (activeEvent.patient_uuid && !isValidPatientUuid) {
        console.warn('警告：预约的patient_uuid无效:', activeEvent.patient_uuid);
      }
    } else if (mode === 'create') {
      // 創建模式時設置默認值
      form.setFieldsValue({
        date: activeDate,
        start_time: dayjs("08:00", "HH:mm"),
        end_time: dayjs("09:00", "HH:mm"),
        note: '',
      });
    }
  }, [activeEvent, mode, form, activeDate, patients]);

  // 當編輯或創建模式打開時，加載患者列表
  useEffect(() => {
    if ((mode === 'create' || mode === 'edit') && open) {
      loadPatients();
    }
  }, [mode, open, loadPatients]);

  // 渲染编辑表单
  const renderEditForm = () => {
    return (
      <Form form={form} layout="vertical">
        <Form.Item 
          name="date" 
          label="日期" 
          rules={[{ required: true, message: "請選擇日期" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        
        <Form.Item
          name="doctor_uuid"
          label="醫生"
        >
          <Select
            placeholder="選擇醫生"
            loading={loadingDoctors}
            options={doctors.map((d) => ({ 
              label: d.full_name || d.username || d.email || d.name, 
              value: d.uuid || d.id 
            }))}
          />
        </Form.Item>
        
        <Form.Item
          name="patient_uuid"
          label="選擇患者"
          rules={[{ required: true, message: '請選擇患者' }]}
        >
          <Select
            placeholder="選擇患者"
            loading={loadingPatients}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={patients.map((p) => ({ 
              label: `${p.full_name || p.name || '未知'} (${p.phone || '無電話'})`, 
              value: p.uuid
            }))}
            onFocus={loadPatients}
            notFoundContent={loadingPatients ? "加載中..." : "暫無患者數據"}
          />
        </Form.Item>
        
        <Form.Item
          name="start_time"
          label="開始時間"
          rules={[{ required: true, message: '請選擇開始時間' }]}
        >
          <TimePicker style={{ width: "100%" }} format="HH:mm" />
        </Form.Item>
        
        <Form.Item
          name="end_time"
          label="結束時間"
          rules={[{ required: true, message: '請選擇結束時間' }]}
        >
          <TimePicker style={{ width: "100%" }} format="HH:mm" />
        </Form.Item>
        
        <Form.Item
          name="note"
          label="備註"
        >
          <Input.TextArea rows={3} placeholder="備註資訊" />
        </Form.Item>
      </Form>
    );
  };

  // 渲染内容
  const renderContent = () => {
    switch (mode) {
      case "day":
        return renderDayContent();
      case "edit":
      case "create":
        return renderEditForm();
      default:
        return null;
    }
  };

  // 渲染底部按钮
  const renderFooter = () => {
    if (mode === "day") {
      return (
        <Space>
          <Button onClick={onCancel}>關閉</Button>
        </Space>
      );
    }
    
    if (mode === "edit" || mode === "create") {
      return (
        <Space>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" onClick={handleOk}>
            {mode === "create" ? "創建" : "確定"}
          </Button>
        </Space>
      );
    }
    
    return null;
  };

  return (
    <>
      <Modal
        open={open}
        onCancel={onCancel}
        title={getModalTitle(mode)}
        width={mode === 'day' ? 900 : 560}
        centered
        bodyStyle={{ maxHeight: mode === 'day' ? 560 : 440, overflowY: 'auto' }}
        footer={renderFooter()}
      >
        {renderContent()}
      </Modal>
      {messageCtx}
    </>
  );
};

export default AppointmentModal;
