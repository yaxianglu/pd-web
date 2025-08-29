import React, { useState } from "react";
import './index.scss';

const TreatmentSelection = (props) => {
  const { title, onCancel, onConfirm, style, confirmText = '確認', cancelText = '取消' } = props;

  return (
    <div className="treatment-selection-container" style={style}>
      <div className="clickable-areas">
        {title}
      </div>
      <div className="popup-actions">
        <button className="cancel-button" onClick={() => onCancel()}>
          {cancelText}
        </button>
        <button className="confirm-button" onClick={() => {
          onConfirm();
        }}>
          {confirmText}
        </button>
      </div>
    </div>
  );
};

export default TreatmentSelection;
