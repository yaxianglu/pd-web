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
  userType = 'doctor'
}) => {
  const [form] = Form.useForm();
  const [messageApi, messageCtx] = message.useMessage();

  // 获取模态框标题
  const getModalTitle = (mode) => {
    switch (mode) {
      case "day": return "预约列表";
      case "edit": return "编辑预约";
      case "create": return "创建预约";
      default: return "预约";
    }
  };

  // 处理编辑
  const handleEdit = useCallback((appointment) => {
    if (onEdit) {
      onEdit(appointment);
    }
  }, [onEdit]);

  // 处理模态框确认
  const handleOk = useCallback(async () => {
    if (mode === "edit" && activeEvent) {
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
          messageApi.success('预约更新成功');
        }
      } catch (error) {
        console.error('更新预约失败:', error);
        messageApi.error('更新失败: ' + (error?.message || '未知错误'));
      }
    }
  }, [mode, activeEvent, form, onUpdate, messageApi]);

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
        title: "时间",
        dataIndex: "time",
        key: "time",
        width: 160,
        render: (_, record) => `${record.start_time || '-'} ~ ${record.end_time || '-'}`,
      },
      {
        title: "医生",
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
        title: "备注",
        dataIndex: "note",
        key: "note",
        ellipsis: true,
      },
      {
        title: "状态",
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
          <h3>{activeDate.format("YYYY年MM月DD日")} 的预约</h3>
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

  // 当编辑模式打开时，设置表单的初始值
  useEffect(() => {
    if (activeEvent && mode === 'edit') {
      form.setFieldsValue({
        date: activeEvent.date ? dayjs(activeEvent.date) : activeDate,
        patient_name: activeEvent.patient_name || activeEvent.patientName || activeEvent.name || '',
        start_time: activeEvent.start_time ? dayjs(activeEvent.start_time, 'HH:mm') : null,
        end_time: activeEvent.end_time ? dayjs(activeEvent.end_time, 'HH:mm') : dayjs("18:00", "HH:mm"),
        doctor_uuid: activeEvent.doctor_uuid || activeEvent.doctorUuid,
        note: activeEvent.note || '',
      });
    }
  }, [activeEvent, mode, form, activeDate]);

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
          name="patient_name"
          label="患者姓名"
          rules={[{ required: true, message: '请输入患者姓名' }]}
        >
          <Input placeholder="请输入患者姓名" />
        </Form.Item>
        
        <Form.Item
          name="start_time"
          label="開始時間"
          rules={[{ required: true, message: '请选择开始时间' }]}
        >
          <TimePicker style={{ width: "100%" }} format="HH:mm" />
        </Form.Item>
        
        <Form.Item
          name="end_time"
          label="結束時間"
          rules={[{ required: true, message: '请选择结束时间' }]}
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
    
    if (mode === "edit") {
      return (
        <Space>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" onClick={handleOk}>確定</Button>
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
