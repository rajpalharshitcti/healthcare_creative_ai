import React from "react";

const PaymentModal = ({ open, onClose, onPay }) => {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>Confirm Payment</h2>
        <p>Please review and confirm your payment.</p>
        <div className="doctor-actions">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
          <button type="button" className="btn-primary" onClick={onPay}>Pay Now</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
