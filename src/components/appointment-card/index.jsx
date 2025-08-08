import React from 'react';
import './index.scss';

const AppointmentCard = ({ 
  appointment, 
  onAction,
  className = '' 
}) => {
  const {
    time,
    type,
    doctor,
    clinic,
    color = "#e3f2fd",
    icon = "📋"
  } = appointment;

  return (
    <div
      className={`appointment-card ${className}`}
      style={{ '--appointment-color': color }}
    >
      <div className="appointment-info">
        <span className="appointment-icon">{icon}</span>
        <div className="appointment-details">
          <div className="appointment-time">{time}</div>
          <div className="appointment-type">{type}</div>
          <div className="appointment-doctor">{doctor}</div>
        </div>
      </div>
      <div className="appointment-clinic">{clinic}</div>
      {onAction && (
        <div className="appointment-actions" onClick={onAction}>
          ⋯
        </div>
      )}
    </div>
  );
};

export default AppointmentCard; 