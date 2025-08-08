import React from 'react';
import './index.scss';

const TreatmentFlow = ({ 
  steps, 
  className = '' 
}) => {
  return (
    <div className={`treatment-flow ${className}`}>
      <div className="flow-steps">
        {steps.map((step, index) => (
          <div key={index} className="flow-step">
            {step.icon && <div className="step-icon">{step.icon}</div>}
            <div className="step-name">{step.name}</div>
            <div className={`step-indicator ${step.status}`}>
              {step.status === "completed" ? "✓" : 
               step.status === "current" ? "L" : ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TreatmentFlow; 