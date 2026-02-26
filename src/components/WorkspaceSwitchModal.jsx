import React from "react";

const WorkspaceSwitchModal = ({ open, onClose, onChoose }) => {
  if (!open) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card">
        <h2>Switch Workspace</h2>
        <p>Continue as Patient or Doctor. If not registered, onboarding will start.</p>
        <div className="role-modal-grid">
          <button className="role-option role-option-patient" onClick={() => onChoose("patient")}>
            <span className="role-icon" aria-hidden="true">P</span>
            <span className="role-text">
              <strong>Register / Continue as Patient</strong>
              <small>Appointments, pharmacy, records</small>
            </span>
          </button>
          <button className="role-option role-option-doctor" onClick={() => onChoose("doctor")}>
            <span className="role-icon" aria-hidden="true">D</span>
            <span className="role-text">
              <strong>Register / Continue as Doctor</strong>
              <small>Onboarding, consultations, earnings</small>
            </span>
          </button>
        </div>
        <button className="btn-ghost" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default WorkspaceSwitchModal;
