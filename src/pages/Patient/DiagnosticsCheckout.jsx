import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/pages/diagnosticsCheckout.css";

const DiagnosticsCheckout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const total = location.state?.total || 0;
  const [address, setAddress] = React.useState("");
  const [slot, setSlot] = React.useState("Morning Slot");
  const [errors, setErrors] = React.useState({});

  const onConfirm = () => {
    const next = {};
    if (!address.trim()) next.address = "Please enter your sample collection address";
    if (!slot) next.slot = "Please select a slot";
    setErrors(next);
    if (Object.keys(next).length) return;
    navigate("/patient/dashboard");
  };

  const updateField = (field, value) => {
    if (field === "address") setAddress(value);
    if (field === "slot") setSlot(value);
    if (errors[field]) {
      const shouldClear = typeof value === "string" ? value.trim() : Boolean(value);
      if (shouldClear) setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="panel checkout-card page-fade">
      <h2>Diagnostics Checkout</h2>
      <p>Payable Amount: INR {total}</p>
      <input placeholder="Sample collection address" value={address} onChange={(e) => updateField("address", e.target.value)} />
      {errors.address ? <small className="field-error">{errors.address}</small> : null}
      <select value={slot} onChange={(e) => updateField("slot", e.target.value)}><option>Morning Slot</option><option>Afternoon Slot</option></select>
      {errors.slot ? <small className="field-error">{errors.slot}</small> : null}
      <button className="btn-primary" onClick={onConfirm}>Confirm Booking</button>
    </div>
  );
};

export default DiagnosticsCheckout;


