import React, { useState, useEffect, useCallback } from 'react';
import { Badge, Calendar, Select, Button } from 'antd';
import dayjs from 'dayjs';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import AppointmentModal from '../components/appointment-modal';
import './Calendar.scss';

const { Option } = Select;

const App = () => {
  const [appointments, setAppointments] = useState([]);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const { userInfo } = useAuth();
  
  // 模态框相关狀態
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("day");
  const [activeDate, setActiveDate] = useState(null);
  const [activeEvent, setActiveEvent] = useState(null);
  
  // 醫生列表相關狀態
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  // 獲取當前醫生的所有預約信息
  const loadAppointments = async (date) => {
    if (!userInfo?.uuid) {
      console.log('用户信息不存在:', userInfo);
      return;
    }
    
    try {
      const year = date.year();
      const month = date.month() + 1; // dayjs月份从0开始
      console.log('正在加載預約數據:', { year, month, doctorUuid: userInfo.uuid });
      console.log('当前用户信息:', userInfo);
      
      const res = await apiService.getAppointmentsByMonth(year, month, null, userInfo.uuid);
      console.log('API返回数据:', res);
      
      // 处理API响应数据 - 可能包含在data字段中
      let appointmentsData = [];
      if (res && res.success && Array.isArray(res.data)) {
        appointmentsData = res.data;
      } else if (res && Array.isArray(res)) {
        appointmentsData = res;
      } else {
        console.log('API返回数据格式不正确:', res);
        setAppointments([]);
        return;
      }
      
      console.log('解析後的預約數據:', appointmentsData);
      
      // 臨時：顯示所有預約數據用於調試
      console.log('所有預約数据（不过滤醫生）:', appointmentsData);
      
      // 只顯示當前醫生的預約
      const doctorAppointments = appointmentsData.filter(apt => {
                  // 支持多種醫生UUID字段名
        const doctorUuid = apt.doctor_uuid || apt.doctorUuid || apt.doctor_id || apt.doctorId;
        const currentUserUuid = userInfo.uuid;
        
        console.log('检查預約:', apt);
        console.log('預約中的醫生UUID字段:', { 
          doctor_uuid: apt.doctor_uuid, 
          doctorUuid: apt.doctorUuid, 
          doctor_id: apt.doctor_id, 
          doctorId: apt.doctorId 
        });
        console.log('當前用戶UUID:', currentUserUuid);
        console.log('UUID匹配结果:', doctorUuid === currentUserUuid);
        
        // 如果預約沒有醫生UUID，可能是系統預約，暫時顯示
        if (!doctorUuid) {
          console.log('預約沒有醫生UUID，可能是系統預約');
          return true; // 临时显示，用于调试
        }
        
        return doctorUuid === currentUserUuid;
      });
      
      console.log('過濾後的醫生預約:', doctorAppointments);
      
      // 如果找到匹配的醫生預約，使用過濾後的數據
      if (doctorAppointments.length > 0) {
        setAppointments(doctorAppointments);
      } else {
        // 如果沒有找到匹配的醫生預約，檢查是否有其他問題
        console.log('沒有找到匹配的醫生預約，檢查可能的原因:');
        console.log('1. 當前用戶UUID:', userInfo.uuid);
        console.log('2. 所有預約的醫生UUID:', appointmentsData.map(apt => ({
          id: apt.id,
          doctor_uuid: apt.doctor_uuid,
          doctorUuid: apt.doctorUuid,
          doctor_id: apt.doctor_id,
          doctorId: apt.doctorId
        })));
        
        // 臨時顯示所有預約用於調試
        console.log('臨時顯示所有預約用於調試');
        setAppointments(appointmentsData);
      }
      
    } catch (error) {
      console.error('加載預約數據失敗:', error);
      setAppointments([]);
    }
  };

  useEffect(() => {
    console.log('useEffect触发:', { userInfo, currentDate });
    if (userInfo?.uuid) {
      loadAppointments(currentDate);
    } else {
      console.log('等待用户信息加载...');
    }
  }, [userInfo?.uuid, currentDate]);

  const getListData = value => {
    const dateStr = value.format('YYYY-MM-DD');
    console.log('檢查日期:', dateStr, '當前預約數據:', appointments);
    
    const dayAppointments = appointments.filter(appointment => {
      // 处理不同的日期格式和字段名
      let aptDate;
      
      // 尝试不同的日期字段名
      const dateField = appointment.date || appointment.appointment_date || appointment.scheduled_date;
      
      if (typeof dateField === 'string') {
        aptDate = dayjs(dateField).format('YYYY-MM-DD');
      } else if (dateField instanceof Date) {
        aptDate = dayjs(dateField).format('YYYY-MM-DD');
      } else {
        console.log('未知的日期格式:', dateField, typeof dateField, '預約對象:', appointment);
        return false;
      }
      
      const matches = aptDate === dateStr;
      if (matches) {
        console.log('找到匹配的預約:', appointment);
      }
      return matches;
    });

    console.log('該日期的預約:', dateStr, dayAppointments);

    if (dayAppointments.length === 0) {
      return [];
    }

    return dayAppointments.map((appointment, index) => {
      // 将 dayAppointments 数组附加到返回对象上，以便在渲染时访问
      const result = {
        type: 'default',
        content: '預約',
        appointment: appointment,
        dayAppointments: dayAppointments
      };
      
      let type = 'default';
      const status = appointment.status || appointment.appointment_status;
      
      if (status === 'confirmed' || status === '預約完成' || status === 'success') {
        type = 'success';
      } else if (status === 'pending' || status === '等待預約' || status === 'warning') {
        type = 'warning';
      } else if (status === 'cancelled' || status === '取消' || status === 'error') {
        type = 'error';
      }

      // 生成顯示內容：開始時間-結束時間 + 患者名稱
      let content = '預約';
      const startTime = appointment.start_time || appointment.startTime;
      const endTime = appointment.end_time || appointment.endTime;
      const patientName = appointment.patient_name || appointment.patientName || appointment.name || appointment.patient || appointment.user_name || appointment.userName || appointment.user_name || appointment.customer_name || appointment.customerName;
      
      // 調試：打印所有可能的患者姓名字段
      console.log('預約對象的所有字段:', Object.keys(appointment));
      console.log('處理預約數據:', { startTime, endTime, patientName, appointment });
      console.log('患者姓名字段值:', {
        patient_name: appointment.patient_name,
        patientName: appointment.patientName,
        name: appointment.name,
        patient: appointment.patient,
        user_name: appointment.user_name,
        userName: appointment.userName
      });
      
      if (startTime && endTime && patientName) {
        // 格式化時間，只显示小时:分钟
        let formattedStartTime = startTime;
        let formattedEndTime = endTime;
        
        if (typeof startTime === 'string') {
          // 如果是 "18:00:00" 格式，只取前5位 "18:00"
          if (startTime.length >= 5) {
            formattedStartTime = startTime.substring(0, 5);
          }
        }
        
        if (typeof endTime === 'string') {
          // 如果是 "18:30:00" 格式，只取前5位 "18:30"
          if (endTime.length >= 5) {
            formattedEndTime = endTime.substring(0, 5);
          }
        }
        
        content = `${formattedStartTime}-${formattedEndTime} ${patientName}`;
        console.log('✅ 生成完整內容（有時間+患者姓名）:', content);
        console.log('✅ 条件满足: startTime=', !!startTime, 'endTime=', !!endTime, 'patientName=', !!patientName);
      } else if (startTime && endTime) {
        // 只有時間，沒有患者姓名
        let formattedStartTime = startTime;
        let formattedEndTime = endTime;
        
        if (typeof startTime === 'string' && startTime.length >= 5) {
          formattedStartTime = startTime.substring(0, 5);
        }
        if (typeof endTime === 'string' && endTime.length >= 5) {
          formattedEndTime = endTime.substring(0, 5);
        }
        
        // 即使沒有患者姓名，也顯示"未知患者"佔位符
        content = `${formattedStartTime}-${formattedEndTime} [未知患者]`;
        console.log('⚠️ 生成時間範圍內容（只有時間，無患者姓名）:', content);
        console.log('⚠️ 条件检查: startTime=', !!startTime, 'endTime=', !!endTime, 'patientName=', !!patientName);
      } else if (startTime && patientName) {
        // 只有開始時間和患者姓名
        let formattedStartTime = startTime;
        if (typeof startTime === 'string' && startTime.length >= 5) {
          formattedStartTime = startTime.substring(0, 5);
        }
        content = `${formattedStartTime} ${patientName}`;
        console.log('生成時間+患者內容:', content);
      } else if (patientName) {
        // 只有患者姓名
        content = patientName;
        console.log('生成患者內容:', content);
      } else if (startTime) {
        // 只有開始時間
        let formattedStartTime = startTime;
        if (typeof startTime === 'string' && startTime.length >= 5) {
          formattedStartTime = startTime.substring(0, 5);
        }
        content = formattedStartTime;
        console.log('生成時間内容:', content);
      }

      // 限制內容長度，避免顯示過長 - 增加長度限制以顯示患者姓名
      if (content.length > 30) {
        content = content.substring(0, 30) + '...';
      }

      // 确保内容不包含"時間:"前缀
      if (content.includes('時間:')) {
        content = content.replace(/^時間:\s*/, '');
        console.log('移除時間前缀后的内容:', content);
      }

      console.log('最終生成的預約顯示:', { type, content, original: appointment });
      result.type = type;
      result.content = content;
      return result;
    });
  };

  const getMonthData = value => {
    const monthAppointments = appointments.filter(appointment => {
      // 处理不同的日期字段名
      const dateField = appointment.date || appointment.appointment_date || appointment.scheduled_date;
      
      if (!dateField) return false;
      
      const appointmentDate = dayjs(dateField);
      return appointmentDate.month() === value.month() && 
             appointmentDate.year() === value.year();
    });

    return monthAppointments.length > 0 ? monthAppointments.length : null;
  };

  const monthCellRender = value => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>預約數量</span>
      </div>
    ) : null;
  };

  const dateCellRender = value => {
    const listData = getListData(value);
    const isToday = value.isSame(dayjs(), 'day');
    
    return (
      <div className={`calendar-date ${isToday ? 'today' : ''}`}>
        <ul className="events">
          {listData.map((item, index) => (
            <li 
              key={`${item.content}-${index}`}
              onClick={() => {
                // 傳遞日期，顯示該日期的所有預約
                handleAppointmentClick(value);
              }}
              style={{ cursor: 'pointer' }}
            >
              <Badge status={item.type} text={item.content} />
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const cellRender = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    if (info.type === 'month') return monthCellRender(current);
    return info.originNode;
  };

  const handleYearChange = (year) => {
    const newDate = currentDate.year(year);
    setCurrentDate(newDate);
  };

  const handleMonthChange = (month) => {
    const newDate = currentDate.month(month - 1); // Select的月份从1开始，dayjs从0开始
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(dayjs());
  };

  const goToPreviousMonth = () => {
    setCurrentDate(currentDate.subtract(1, 'month'));
  };

  const goToNextMonth = () => {
    setCurrentDate(currentDate.add(1, 'month'));
  };

  // 處理預約點擊 - 顯示該日期的所有預約列表
  const handleAppointmentClick = useCallback((date) => {
    setActiveDate(date);
    setModalMode("day");
    setModalOpen(true);
  }, []);

  // 加載醫生列表
  const loadDoctors = useCallback(async () => {
    if (doctors.length > 0 || loadingDoctors) return;
    try {
      setLoadingDoctors(true);
      const res = await apiService.getDoctors();
      if (res && res.success) {
        setDoctors(res.data || []);
      }
    } catch (error) {
      console.error('加載醫生列表失敗:', error);
    } finally {
      setLoadingDoctors(false);
    }
  }, [doctors.length, loadingDoctors]);

  // 打开编辑模式
  const openEditForEvent = useCallback((appointment) => {
    setActiveEvent(appointment);
    setModalMode("edit");
    setModalOpen(true);
    loadDoctors(); // 加載醫生列表
  }, [loadDoctors]);

  // 處理預約更新
  const handleAppointmentUpdate = useCallback(async (updated) => {
    try {
      // 检查updated参数是否存在
      if (!updated) {
        console.error('更新預約失败: updated参数无效');
        throw new Error('更新預約失败: updated参数无效');
      }
      
      // 获取预约ID
      const appointmentId = updated.id || updated.uuid;
      if (!appointmentId) {
        console.error('更新預約失败: 预约ID无效');
        throw new Error('更新預約失败: 预约ID无效');
      }
      
      // 調用API更新預約
      await apiService.updateAppointment(appointmentId, updated);
      
      // 刷新預約数据
      loadAppointments(currentDate);
      
      // 關閉编辑模式，回到列表模式
      setModalMode("day");
      setActiveEvent(null);
    } catch (error) {
      console.error('更新預約失败:', error);
      throw error; // 让弹窗组件处理错误
    }
  }, [currentDate]);

  // 处理預約創建
  const handleAppointmentCreate = useCallback(async (payload) => {
    try {
      // 调用API創建預約
      await apiService.createAppointment(payload);
      
      // 刷新預約数据
      loadAppointments(currentDate);
      
      // 關閉創建模式
      setModalOpen(false);
    } catch (error) {
      console.error('創建預約失败:', error);
      throw error; // 让弹窗组件处理错误
    }
  }, [currentDate]);

  // 重新加载预约数据（用于取消预约后）
  const handleReloadAppointments = useCallback(() => {
    loadAppointments(currentDate);
  }, [currentDate]);

  // 处理编辑按钮点击
  const handleEditClick = useCallback((appointment) => {
    openEditForEvent(appointment);
  }, [openEditForEvent]);

  // 生成年份选项（当前年份前后5年）
  const yearOptions = [];
  const currentYear = dayjs().year();
  for (let i = currentYear - 5; i <= currentYear + 5; i++) {
    yearOptions.push(i);
  }

  // 生成月份选项
  const monthOptions = [];
  for (let i = 1; i <= 12; i++) {
    monthOptions.push(i);
  }

  return (
    <div className="doctor-calendar">
      <div className="calendar-header">
        <div className="calendar-controls">
          <Button 
            type="text" 
            icon="‹" 
            onClick={goToPreviousMonth}
            className="nav-button"
          />
          
          <div className="date-selectors">
            <Select
              value={currentDate.year()}
              onChange={handleYearChange}
              className="year-selector"
              size="large"
            >
              {yearOptions.map(year => (
                <Option key={year} value={year}>{year}年</Option>
              ))}
            </Select>
            
            <Select
              value={currentDate.month() + 1}
              onChange={handleMonthChange}
              className="month-selector"
              size="large"
            >
              {monthOptions.map(month => (
                <Option key={month} value={month}>{month}月</Option>
              ))}
            </Select>
          </div>
          
          <Button 
            type="text" 
            icon="›" 
            onClick={goToNextMonth}
            className="nav-button"
          />
        </div>
        
        <div className="calendar-actions">
          <Button 
            type="primary" 
            onClick={() => {
              setActiveDate(dayjs());
              setModalMode("create");
              setModalOpen(true);
              loadDoctors();
            }}
            className="add-appointment-button"
          >
            新增預約
          </Button>
          <Button 
            type="primary" 
            onClick={goToToday}
            className="today-button"
          >
            今天
          </Button>
        </div>
      </div>
      
      <Calendar 
        value={currentDate}
        cellRender={cellRender}
        onChange={setCurrentDate}
        headerRender={() => null} // 隐藏默认头部
      />

      {/* 使用独立的預約弹窗组件 */}
      <AppointmentModal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        mode={modalMode}
        activeDate={activeDate}
        activeEvent={activeEvent}
        appointments={appointments}
        doctors={doctors}
        loadingDoctors={loadingDoctors}
        onUpdate={handleAppointmentUpdate}
        onCreate={handleAppointmentCreate}
        onEdit={handleEditClick}
        onReload={handleReloadAppointments}
        userType="doctor"
      />


    </div>
  );
};

export default App;