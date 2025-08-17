import React, { useState } from "react";
import './index.scss';

const TreatmentSelection = (props) => {
  const { title, onCancel, onConfirm } = props;

  return (
    <div className="treatment-selection-container">
      <div className="clickable-areas">
        {title}
      </div>
      <div className="popup-actions">
        <button className="cancel-button" onClick={() => onCancel()}>
          取消
        </button>
        <button className="confirm-button" onClick={() => {
          onConfirm();
        }}>确认</button>
      </div>
    </div>
  );
};

export default TreatmentSelection;
