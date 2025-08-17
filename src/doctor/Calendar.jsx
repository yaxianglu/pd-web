import React, { useState, useEffect } from 'react';
import { Badge, Calendar, Select, Button } from 'antd';
import dayjs from 'dayjs';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import './Calendar.scss';

const { Option } = Select;

const App = () => {
  const [appointments, setAppointments] = useState([]);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const { userInfo } = useAuth();

  // 获取当前医生的所有预约信息
  const loadAppointments = async (date) => {
    if (!userInfo?.uuid) {
      console.log('用户信息不存在:', userInfo);
      return;
    }
    
    try {
      const year = date.year();
      const month = date.month() + 1; // dayjs月份从0开始
      console.log('正在加载预约数据:', { year, month, doctorUuid: userInfo.uuid });
      console.log('当前用户信息:', userInfo);
      
      const res = await apiService.getAppointmentsByMonth(year, month);
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
      
      console.log('解析后的预约数据:', appointmentsData);
      
      // 临时：显示所有预约数据用于调试
      console.log('所有预约数据（不过滤医生）:', appointmentsData);
      
      // 只显示当前医生的预约
      const doctorAppointments = appointmentsData.filter(apt => {
        // 支持多种医生UUID字段名
        const doctorUuid = apt.doctor_uuid || apt.doctorUuid || apt.doctor_id || apt.doctorId;
        const currentUserUuid = userInfo.uuid;
        
        console.log('检查预约:', apt);
        console.log('预约中的医生UUID字段:', { 
          doctor_uuid: apt.doctor_uuid, 
          doctorUuid: apt.doctorUuid, 
          doctor_id: apt.doctor_id, 
          doctorId: apt.doctorId 
        });
        console.log('当前用户UUID:', currentUserUuid);
        console.log('UUID匹配结果:', doctorUuid === currentUserUuid);
        
        // 如果预约没有医生UUID，可能是系统预约，暂时显示
        if (!doctorUuid) {
          console.log('预约没有医生UUID，可能是系统预约');
          return true; // 临时显示，用于调试
        }
        
        return doctorUuid === currentUserUuid;
      });
      
      console.log('过滤后的医生预约:', doctorAppointments);
      
      // 如果找到匹配的医生预约，使用过滤后的数据
      if (doctorAppointments.length > 0) {
        setAppointments(doctorAppointments);
      } else {
        // 如果没有找到匹配的医生预约，检查是否有其他问题
        console.log('没有找到匹配的医生预约，检查可能的原因:');
        console.log('1. 当前用户UUID:', userInfo.uuid);
        console.log('2. 所有预约的医生UUID:', appointmentsData.map(apt => ({
          id: apt.id,
          doctor_uuid: apt.doctor_uuid,
          doctorUuid: apt.doctorUuid,
          doctor_id: apt.doctor_id,
          doctorId: apt.doctorId
        })));
        
        // 临时显示所有预约用于调试
        console.log('临时显示所有预约用于调试');
        setAppointments(appointmentsData);
      }
      
    } catch (error) {
      console.error('加载预约数据失败:', error);
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
    console.log('检查日期:', dateStr, '当前预约数据:', appointments);
    
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
        console.log('未知的日期格式:', dateField, typeof dateField, '预约对象:', appointment);
        return false;
      }
      
      const matches = aptDate === dateStr;
      if (matches) {
        console.log('找到匹配的预约:', appointment);
      }
      return matches;
    });

    console.log('该日期的预约:', dateStr, dayAppointments);

    if (dayAppointments.length === 0) {
      return [];
    }

    return dayAppointments.map(appointment => {
      let type = 'default';
      const status = appointment.status || appointment.appointment_status;
      
      if (status === 'confirmed' || status === '預約完成' || status === 'success') {
        type = 'success';
      } else if (status === 'pending' || status === '等待預約' || status === 'warning') {
        type = 'warning';
      } else if (status === 'cancelled' || status === '取消' || status === 'error') {
        type = 'error';
      }

      // 生成显示内容：开始时间-结束时间 + 患者名称
      let content = '预约';
      const startTime = appointment.start_time || appointment.startTime;
      const endTime = appointment.end_time || appointment.endTime;
      const patientName = appointment.patient_name || appointment.patientName || appointment.name;
      
      console.log('处理预约数据:', { startTime, endTime, patientName, appointment });
      
      if (startTime && endTime && patientName) {
        // 格式化时间，只显示小时:分钟
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
        console.log('生成完整内容:', content);
      } else if (startTime && endTime) {
        // 只有时间，没有患者姓名
        let formattedStartTime = startTime;
        let formattedEndTime = endTime;
        
        if (typeof startTime === 'string' && startTime.length >= 5) {
          formattedStartTime = startTime.substring(0, 5);
        }
        if (typeof endTime === 'string' && endTime.length >= 5) {
          formattedEndTime = endTime.substring(0, 5);
        }
        
        content = `${formattedStartTime}-${formattedEndTime}`;
        console.log('生成时间范围内容:', content);
      } else if (startTime && patientName) {
        // 只有开始时间和患者姓名
        let formattedStartTime = startTime;
        if (typeof startTime === 'string' && startTime.length >= 5) {
          formattedStartTime = startTime.substring(0, 5);
        }
        content = `${formattedStartTime} ${patientName}`;
        console.log('生成时间+患者内容:', content);
      } else if (startTime) {
        // 只有开始时间
        let formattedStartTime = startTime;
        if (typeof startTime === 'string' && startTime.length >= 5) {
          formattedStartTime = startTime.substring(0, 5);
        }
        content = formattedStartTime;
        console.log('生成时间内容:', content);
      } else if (patientName) {
        // 只有患者姓名
        content = patientName;
        console.log('生成患者内容:', content);
      }

      // 限制内容长度，避免显示过长
      if (content.length > 18) {
        content = content.substring(0, 18) + '...';
      }

      // 确保内容不包含"时间:"前缀
      if (content.includes('时间:')) {
        content = content.replace(/^时间:\s*/, '');
        console.log('移除时间前缀后的内容:', content);
      }

      console.log('最终生成的预约显示:', { type, content, original: appointment });
      return { type, content };
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
        <span>预约数量</span>
      </div>
    ) : null;
  };

  const dateCellRender = value => {
    const listData = getListData(value);
    const isToday = value.isSame(dayjs(), 'day');
    
    return (
      <div className={`calendar-date ${isToday ? 'today' : ''}`}>
        <ul className="events">
          {listData.map(item => (
            <li key={item.content}>
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
        
        <Button 
          type="primary" 
          onClick={goToToday}
          className="today-button"
        >
          今天
        </Button>
      </div>
      
      <Calendar 
        value={currentDate}
        cellRender={cellRender}
        onChange={setCurrentDate}
        headerRender={() => null} // 隐藏默认头部
      />
    </div>
  );
};

export default App;