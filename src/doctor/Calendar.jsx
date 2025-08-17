import React, { useState } from 'react';
import './Calendar.scss';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 獲取當前月份的第一天和最後一天
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  // 獲取月份第一天是星期幾（0是星期日）
  const firstDayWeekday = firstDayOfMonth.getDay();
  
  // 獲取月份總天數
  const daysInMonth = lastDayOfMonth.getDate();

  // 生成日曆網格
  const generateCalendarDays = () => {
    const days = [];
    
    // 添加上個月的剩餘天數
    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      const prevMonthDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), -i);
      days.push({
        date: prevMonthDay,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false
      });
    }
    
    // 添加當前月份的天數
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isToday = currentDay.toDateString() === new Date().toDateString();
      const isSelected = currentDay.toDateString() === selectedDate.toDateString();
      
      days.push({
        date: currentDay,
        isCurrentMonth: true,
        isToday,
        isSelected
      });
    }
    
    // 添加下個月的開頭幾天，確保網格完整
    const remainingDays = 42 - days.length; // 6行7列 = 42
    for (let day = 1; day <= remainingDays; day++) {
      const nextMonthDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, day);
      days.push({
        date: nextMonthDay,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false
      });
    }
    
    return days;
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const handleDateClick = (day) => {
    if (day.isCurrentMonth) {
      setSelectedDate(day.date);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <div className="calendar-dashboard">
      <div className="card">
        <div className="card-title">日曆看板</div>
        
        {/* 日曆頭部控制 */}
        <div className="calendar-header">
          <div className="calendar-controls">
            <button onClick={goToPreviousMonth} className="btn-nav">
              ‹
            </button>
            <h2 className="current-month">
              {currentDate.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long' })}
            </h2>
            <button onClick={goToNextMonth} className="btn-nav">
              ›
            </button>
          </div>
          <button onClick={goToToday} className="btn-today">
            今天
          </button>
        </div>

        {/* 星期標題 */}
        <div className="weekdays">
          {weekdays.map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>

        {/* 日曆網格 */}
        <div className="calendar-grid">
          {generateCalendarDays().map((day, index) => (
            <div
              key={index}
              className={`calendar-day ${day.isCurrentMonth ? 'current-month' : 'other-month'} ${
                day.isToday ? 'today' : ''
              } ${day.isSelected ? 'selected' : ''}`}
              onClick={() => handleDateClick(day)}
            >
              <span className="day-number">{day.date.getDate()}</span>
            </div>
          ))}
        </div>

        {/* 選中日期信息 */}
        <div className="selected-date-info">
          <h3>選中日期：{formatDate(selectedDate)}</h3>
          <div className="appointments">
            <p className="no-appointments">此日期暫無預約安排</p>
          </div>
        </div>
      </div>
    </div>
  );
}
