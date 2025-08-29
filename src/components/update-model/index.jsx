import React, { useState } from "react";
import './index.scss';

const TreatmentSelection = (props) => {
  const { title, onCancel, onConfirm, style } = props;

  return (
    <div className="treatment-selection-container" style={style}>
      <div className="clickable-areas">
        {title}
      </div>
      <div className="popup-actions">
        <button className="cancel-button" onClick={() => onCancel()}>
          取消
        </button>
        <button className="confirm-button" onClick={() => {
          onConfirm();
        }}>確認</button>
      </div>
    </div>
  );
};

export default TreatmentSelection;
