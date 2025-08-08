import React from 'react';
import './index.scss';

const StatusCard = ({ 
  title, 
  value, 
  note, 
  icon, 
  type = 'default',
  className = '' 
}) => {
  return (
    <div className={`status-card ${type} ${className}`}>
      {icon && <div className="card-icon">{icon}</div>}
      <div className="card-title">{title}</div>
      {value && <div className="card-value">{value}</div>}
      {note && <div className="card-note">{note}</div>}
    </div>
  );
};

export default StatusCard; 