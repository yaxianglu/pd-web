import React, { useState, useRef, useEffect } from 'react';
import './index.scss';

const BirthdayPicker = ({ value, onChange, placeholder = "生日" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const dropdownRef = useRef(null);

  const months = [
    { value: '01', label: '1月' },
    { value: '02', label: '2月' },
    { value: '03', label: '3月' },
    { value: '04', label: '4月' },
    { value: '05', label: '5月' },
    { value: '06', label: '6月' },
    { value: '07', label: '7月' },
    { value: '08', label: '8月' },
    { value: '09', label: '9月' },
    { value: '10', label: '10月' },
    { value: '11', label: '11月' },
    { value: '12', label: '12月' }
  ];

  const getDaysInMonth = (month) => {
    const daysInMonth = {
      '01': 31, '02': 29, '03': 31, '04': 30, '05': 31, '06': 30,
      '07': 31, '08': 31, '09': 30, '10': 31, '11': 30, '12': 31
    };
    return daysInMonth[month] || 31;
  };

  const generateDays = (month) => {
    const daysCount = getDaysInMonth(month);
    const days = [];
    for (let i = 1; i <= daysCount; i++) {
      days.push({
        value: i.toString().padStart(2, '0'),
        label: `${i}日`
      });
    }
    return days;
  };

  // 获取默认天数（1月）
  const getDefaultDays = () => {
    return generateDays('01');
  };

  // 初始化值
  useEffect(() => {
    if (value) {
      const [month, day] = value.split('/');
      setSelectedMonth(month || '');
      setSelectedDay(day || '');
    }
  }, [value]);

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    // 如果当前选择的日期超出了新月份的最大天数，重置日期
    const maxDays = getDaysInMonth(month);
    if (selectedDay && parseInt(selectedDay) > maxDays) {
      setSelectedDay('');
    }
  };

  const handleDaySelect = (day) => {
    setSelectedDay(day);
  };

  const handleConfirm = () => {
    if (selectedMonth && selectedDay) {
      const birthdayValue = `${selectedMonth}/${selectedDay}`;
      onChange && onChange(birthdayValue);
      setIsOpen(false);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const displayValue = value || placeholder;

  return (
    <div className="birthday-picker" ref={dropdownRef}>
      <div 
        className={`birthday-picker-input ${isOpen ? 'focused' : ''}`}
        onClick={toggleDropdown}
      >
        <span className="birthday-picker-value">
          {displayValue}
        </span>
        <span className="birthday-picker-arrow"></span>
      </div>

      {isOpen && (
        <div className="birthday-picker-dropdown">
          <div className="birthday-picker-header">
            <span className="birthday-picker-title">月</span>
            <span className="birthday-picker-title">日</span>
          </div>
          
          <div className="birthday-picker-content">
            <div className="birthday-picker-column">
              {months.map(month => (
                <div
                  key={month.value}
                  className={`birthday-picker-option ${selectedMonth === month.value ? 'selected' : ''}`}
                  onClick={() => handleMonthSelect(month.value)}
                >
                  {month.label}
                </div>
              ))}
            </div>
            
            <div className="birthday-picker-column">
              {generateDays(selectedMonth || '01').map(day => (
                <div
                  key={day.value}
                  className={`birthday-picker-option ${selectedDay === day.value ? 'selected' : ''}`}
                  onClick={() => handleDaySelect(day.value)}
                >
                  {day.label}
                </div>
              ))}
            </div>
          </div>

          <div className="birthday-picker-footer">
            <button 
              className="birthday-picker-confirm-btn"
              onClick={handleConfirm}
              disabled={!selectedMonth || !selectedDay}
            >
              确定
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BirthdayPicker;
