import React from "react";
import "./RegistrationType.css";

const RegistrationType = ({ onSelectType, onClose, isOpen }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="registration-type-modal">
        <div className="modal-header">
          <div className="modal-time">9:41</div>
          <h2>Select Registration Type</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="registration-options">
          <div 
            className="registration-option"
            onClick={() => onSelectType("individual")}
          >
            <div className="option-icon">👤</div>
            <div className="option-details">
              <h3>Individual Registration</h3>
              <p>Register a single teacher or parent</p>
            </div>
            <div className="option-arrow">→</div>
          </div>

          <div 
            className="registration-option"
            onClick={() => onSelectType("batch")}
          >
            <div className="option-icon">👥</div>
            <div className="option-details">
              <h3>Batch Registration</h3>
              <p>Register multiple users at once via spreadsheet</p>
            </div>
            <div className="option-arrow">→</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationType;
