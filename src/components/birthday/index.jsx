import React, { useState, useRef, useEffect } from 'react';
import './index.scss';

const BirthdayPicker = ({ value, onChange, placeholder = "生日", style = {}, valueStyle = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const dropdownRef = useRef(null);

  // 生成年份选项（1900年到当前年份）
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= 1900; i--) {
      years.push({
        value: i.toString(),
        label: `${i}年`
      });
    }
    return years;
  };

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

  const getDaysInMonth = (year, month) => {
    if (!year || !month) return 31;
    return new Date(parseInt(year), parseInt(month), 0).getDate();
  };

  const generateDays = (year, month) => {
    const daysCount = getDaysInMonth(year, month);
    const days = [];
    for (let i = 1; i <= daysCount; i++) {
      days.push({
        value: i.toString().padStart(2, '0'),
        label: `${i}日`
      });
    }
    return days;
  };

  // 初始化值
  useEffect(() => {
    if (value) {
      // 处理不同的日期格式
      if (value.includes('-')) {
        // YYYY-MM-DD 格式
        const [year, month, day] = value.split('-');
        setSelectedYear(year || '');
        setSelectedMonth(month || '');
        setSelectedDay(day || '');
      } else if (value.includes('/')) {
        // MM/DD 格式（兼容旧格式）
        const [month, day] = value.split('/');
        setSelectedMonth(month || '');
        setSelectedDay(day || '');
        // 如果没有年份，设置为当前年份
        if (!selectedYear) {
          setSelectedYear(new Date().getFullYear().toString());
        }
      }
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

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    // 如果当前选择的日期超出了新年份该月的最大天数，重置日期
    if (selectedMonth && selectedDay) {
      const maxDays = getDaysInMonth(year, selectedMonth);
      if (parseInt(selectedDay) > maxDays) {
        setSelectedDay('');
      }
    }
  };

  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    // 如果当前选择的日期超出了新月份的最大天数，重置日期
    if (selectedYear && selectedDay) {
      const maxDays = getDaysInMonth(selectedYear, month);
      if (parseInt(selectedDay) > maxDays) {
        setSelectedDay('');
      }
    }
  };

  const handleDaySelect = (day) => {
    setSelectedDay(day);
  };

  const handleConfirm = () => {
    if (selectedYear && selectedMonth && selectedDay) {
      const birthdayValue = `${selectedYear}-${selectedMonth}-${selectedDay}`;
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
        style={{ ...style }}
      >
        <span className="birthday-picker-value" style={{ ...valueStyle }}>
          {displayValue}
        </span>
        <span className="birthday-picker-arrow"></span>
      </div>

      {isOpen && (
        <div className="birthday-picker-dropdown">
          <div className="birthday-picker-header">
            <span className="birthday-picker-title">年</span>
            <span className="birthday-picker-title">月</span>
            <span className="birthday-picker-title">日</span>
          </div>
          
          <div className="birthday-picker-content">
            <div className="birthday-picker-column">
              {generateYears().map(year => (
                <div
                  key={year.value}
                  className={`birthday-picker-option ${selectedYear === year.value ? 'selected' : ''}`}
                  onClick={() => handleYearSelect(year.value)}
                >
                  {year.label}
                </div>
              ))}
            </div>
            
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
              {generateDays(selectedYear, selectedMonth).map(day => (
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
              disabled={!selectedYear || !selectedMonth || !selectedDay}
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
