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
    if (!userInfo?.uuid) return;
    
    try {
      const year = date.year();
      const month = date.month() + 1; // dayjs月份从0开始
      const res = await apiService.getAppointmentsByMonth(year, month);
      
      if (res && Array.isArray(res)) {
        // 过滤当前医生的预约
        const doctorAppointments = res.filter(apt => 
          apt.doctor_uuid === userInfo.uuid
        );
        
        setAppointments(doctorAppointments);
      }
    } catch (error) {
      console.error('加载预约数据失败:', error);
    }
  };

  useEffect(() => {
    loadAppointments(currentDate);
  }, [userInfo?.uuid, currentDate]);

  const getListData = value => {
    const dateStr = value.format('YYYY-MM-DD');
    const dayAppointments = appointments.filter(appointment => {
      const aptDate = dayjs(appointment.date).format('YYYY-MM-DD');
      return aptDate === dateStr;
    });

    if (dayAppointments.length === 0) {
      return [];
    }

    return dayAppointments.map(appointment => {
      let type = 'default';
      if (appointment.status === 'confirmed' || appointment.status === '預約完成') {
        type = 'success';
      } else if (appointment.status === 'pending' || appointment.status === '等待預約') {
        type = 'warning';
      } else if (appointment.status === 'cancelled' || appointment.status === '取消') {
        type = 'error';
      }

      // 返回简短描述，类似原代码的风格
      let content = '预约';
      if (appointment.patient_name) {
        content = appointment.patient_name.length > 10 ? 
          appointment.patient_name.substring(0, 10) + '...' : 
          appointment.patient_name;
      }

      return { type, content };
    });
  };

  const getMonthData = value => {
    const monthAppointments = appointments.filter(appointment => {
      const appointmentDate = dayjs(appointment.date);
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