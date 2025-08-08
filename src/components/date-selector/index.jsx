import React from 'react';
import './index.scss';

const DateSelector = ({ 
  dates, 
  selectedDate, 
  onDateSelect, 
  className = '' 
}) => {
  return (
    <div className={`date-selector ${className}`}>
      {dates.map((item, index) => (
        <div
          key={index}
          onClick={() => onDateSelect(item.date)}
          className={`date-item ${selectedDate === item.date ? 'selected' : ''}`}
        >
          <div className="day">{item.day}</div>
          <div className="date">{item.date}</div>
        </div>
      ))}
    </div>
  );
};

export default DateSelector; 