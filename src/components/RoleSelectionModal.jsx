import React from "react";

const RoleSelectionModal = ({ open, onClose, onSelect }) => {
  if (!open) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card">
        <h2>Continue As</h2>
        <p>Choose your workspace to continue the healthcare journey.</p>
        <div className="role-modal-grid">
          <button className="role-option role-option-patient" onClick={() => onSelect("patient")}>
            <span className="role-icon" aria-hidden="true">P</span>
            <span className="role-text">
              <strong>Patient</strong>
              <small>Book care, pharmacy, records</small>
            </span>
          </button>
          <button className="role-option role-option-doctor" onClick={() => onSelect("doctor")}>
            <span className="role-icon" aria-hidden="true">D</span>
            <span className="role-text">
              <strong>Doctor</strong>
              <small>Consultations, schedules, earnings</small>
            </span>
          </button>
        </div>
        <button className="btn-ghost" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default RoleSelectionModal;
