import React, { useState, useCallback, useEffect } from 'react';
import { Modal, Form, Input, TimePicker, DatePicker, Select, message, Space, Tag, Table, Button } from 'antd';
import dayjs from 'dayjs';
import { useAuth } from '../../context/AuthContext';

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
  const { userInfo } = useAuth();

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

  // 处理取消预约
  const handleCancelAppointment = useCallback(async (appointment) => {
    console.log('取消預約被调用:', appointment);
    
    // 先测试简单的确认
    const confirmed = window.confirm('確定要取消這個預約嗎？取消後無法恢復。');
    if (!confirmed) {
      console.log('用户取消操作');
      return;
    }
    
    console.log('用户确认取消，开始执行取消操作');
    try {
      const api = (await import("../../services/api")).default;
      console.log('准备调用取消API，預約ID:', appointment.id || appointment.uuid);
      const res = await api.cancelAppointment(appointment.id || appointment.uuid);
      console.log('取消預約API响应:', res);
      if (res && res.success) {
        messageApi.success('預約已取消');
        // 刷新预约列表
        if (onUpdate) {
          onUpdate();
        }
      } else {
        messageApi.error(res?.message || '取消失败');
      }
    } catch (e) {
      console.error('取消預約失败:', e);
      messageApi.error(e?.message || '取消失败');
    }
  }, [messageApi, onUpdate]);

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
    console.log('渲染预约列表 - 日期:', dateStr);
    console.log('所有预约数据:', appointments);
    
    const dayAppointments = appointments.filter(appointment => {
      // 首先检查appointment是否存在
      if (!appointment) {
        console.log('发现无效的预约记录:', appointment);
        return false;
      }
      
      const dateField = appointment.date || appointment.appointment_date || appointment.scheduled_date;
      if (!dateField) {
        console.log('预约缺少日期字段:', appointment);
        return false;
      }
      
      // 处理不同的日期格式
      let aptDate;
      try {
        if (typeof dateField === 'string') {
          // 如果是字符串，尝试解析
          aptDate = dayjs(dateField).format('YYYY-MM-DD');
        } else if (dateField instanceof Date) {
          // 如果是Date对象
          aptDate = dayjs(dateField).format('YYYY-MM-DD');
        } else {
          console.log('未知的日期格式:', dateField, typeof dateField);
          return false;
        }
      } catch (error) {
        console.log('日期解析失败:', dateField, error);
        return false;
      }
      
      const matches = aptDate === dateStr;
      if (matches) {
        console.log('找到匹配的预约:', appointment);
      }
      return matches;
    }).filter(appointment => appointment != null); // 额外过滤掉null和undefined

    console.log('过滤后的预约:', dayAppointments);

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
        key: "time",
        width: 160,
        render: (_, record) => {
          const startTime = record.start_time || record.startTime || '-';
          const endTime = record.end_time || record.endTime || '-';
          
          // 格式化时间显示，去掉秒数
          const formatTime = (time) => {
            if (!time || time === '-') return '-';
            if (typeof time === 'string') {
              // 如果是 "05:03:00" 格式，只显示 "05:03"
              if (time.includes(':')) {
                const parts = time.split(':');
                if (parts.length >= 2) {
                  return `${parts[0]}:${parts[1]}`;
                }
              }
            }
            return time;
          };
          
          return `${formatTime(startTime)} ~ ${formatTime(endTime)}`;
        },
      },
      {
        title: "醫生",
        key: "doctor",
        width: 120,
        render: (_, record) => {
          const doctorName = record.doctor_name || record.doctorName || record.doctor || '-';
          return doctorName;
        },
      },
      {
        title: "患者",
        key: "patient",
        width: 120,
        render: (_, record) => {
          const patientName = record.patient_name || record.patientName || record.name || record.patient || '-';
          return patientName;
        },
      },
      {
        title: "備註",
        dataIndex: "note",
        key: "note",
        ellipsis: true,
        render: (note) => note || '-',
      },
      {
        title: "狀態",
        key: "status",
        width: 100,
        render: (_, record) => {
          const status = record.status || 'scheduled';
          let color = 'blue';
          let text = '預約完成';
          
          switch (status) {
            case 'cancelled':
              color = 'red';
              text = '已取消';
              break;
            case 'completed':
              color = 'green';
              text = '已完成';
              break;
            case 'scheduled':
              color = 'blue';
              text = '預約完成';
              break;
            case 'no_show':
              color = 'orange';
              text = '未到場';
              break;
            case 'rescheduled':
              color = 'purple';
              text = '已改期';
              break;
            default:
              color = 'blue';
              text = '預約完成';
          }
          
          return <Tag color={color}>{text}</Tag>;
        },
      },
      {
        title: "操作",
        key: "action",
        width: 120,
        render: (_, record) => {
          // 只有非患者用户才能看到操作按钮
          if (userType === 'patient') {
            return null;
          }
          
          return (
            <Space size="small">
              <Button 
                type="link" 
                onClick={() => handleEdit(record)} 
                style={{ padding: 0, height: 'auto' }}
              >
                編輯
              </Button>
              <Button 
                type="link" 
                danger
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleCancelAppointment(record);
                }} 
                style={{ padding: 0, height: 'auto', color: '#ff4d4f' }}
              >
                取消
              </Button>
            </Space>
          );
        },
      },
    ];

    return (
      <div className="day-appointments">
        <div style={{ marginBottom: 16 }}>
          <h3>{activeDate.format("YYYY年MM月DD日")} 的預約</h3>
        </div>
        <Table
          rowKey={(record) => record?.id || record?.uuid || Math.random().toString()}
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
      
      // 先设置基本字段，患者字段稍后处理
      form.setFieldsValue({
        date: activeEvent.date ? dayjs(activeEvent.date) : activeDate,
        start_time: activeEvent.start_time ? dayjs(activeEvent.start_time, 'HH:mm') : null,
        end_time: activeEvent.end_time ? dayjs(activeEvent.end_time, 'HH:mm') : dayjs("18:00", "HH:mm"),
        doctor_uuid: activeEvent.doctor_uuid || activeEvent.doctorUuid,
        note: activeEvent.note || '',
      });
      
      // 如果患者列表已加载，立即设置患者字段
      if (patients.length > 0) {
        const isValidPatientUuid = activeEvent.patient_uuid && 
          patients.some(p => p.uuid === activeEvent.patient_uuid);
        
        form.setFieldsValue({
          patient_uuid: isValidPatientUuid ? activeEvent.patient_uuid : ''
        });
        
        if (activeEvent.patient_uuid && !isValidPatientUuid) {
          console.warn('警告：预约的patient_uuid无效:', activeEvent.patient_uuid);
        }
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
  }, [activeEvent, mode, form, activeDate]);

  // 当患者列表加载完成后，更新编辑模式下的患者字段
  useEffect(() => {
    if (activeEvent && mode === 'edit' && patients.length > 0) {
      const isValidPatientUuid = activeEvent.patient_uuid && 
        patients.some(p => p.uuid === activeEvent.patient_uuid);
      
      form.setFieldsValue({
        patient_uuid: isValidPatientUuid ? activeEvent.patient_uuid : ''
      });
      
      if (activeEvent.patient_uuid && !isValidPatientUuid) {
        console.warn('警告：预约的patient_uuid无效:', activeEvent.patient_uuid);
      }
    }
  }, [patients, activeEvent, mode, form]);

  // 當編輯或創建模式打開時，加載患者列表
  useEffect(() => {
    if ((mode === 'create' || mode === 'edit') && open) {
      loadPatients();
    }
  }, [mode, open, loadPatients]);

  // 當創建模式打開時，設置表單的初始值
  useEffect(() => {
    if (mode === 'create' && open) {
      form.setFieldsValue({
        date: activeDate,
        start_time: dayjs("08:00", "HH:mm"),
        end_time: dayjs("09:00", "HH:mm"),
        note: '',
        doctor_uuid: userInfo?.uuid, // 默认选中当前医生
      });
    }
  }, [mode, open, activeDate, form, userInfo]);

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
          rules={[{ required: true, message: '請選擇醫生' }]}
        >
          <Select
            placeholder="選擇醫生"
            loading={loadingDoctors}
            options={doctors.map((d) => ({ 
              label: d.full_name || d.username || d.email || d.name, 
              value: d.uuid || d.id 
            }))}
            disabled={userInfo?.role === 'doctor'}
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
          rules={[
            { required: true, message: '請選擇開始時間' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value) {
                  return Promise.resolve();
                }
                const endTime = getFieldValue('end_time');
                if (!endTime) {
                  return Promise.resolve();
                }
                if (value.isAfter(endTime) || value.isSame(endTime)) {
                  return Promise.reject(new Error('開始時間必須在結束時間之前'));
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <TimePicker style={{ width: "100%" }} format="HH:mm" />
        </Form.Item>
        
        <Form.Item
          name="end_time"
          label="結束時間"
          rules={[
            { required: true, message: '請選擇結束時間' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value) {
                  return Promise.resolve();
                }
                const startTime = getFieldValue('start_time');
                if (!startTime) {
                  return Promise.resolve();
                }
                if (value.isBefore(startTime) || value.isSame(startTime)) {
                  return Promise.reject(new Error('結束時間必須在開始時間之後'));
                }
                return Promise.resolve();
              },
            }),
          ]}
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
