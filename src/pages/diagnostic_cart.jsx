import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiPost } from "../services/apiClient.js";
import Toast from "../components/Toast.jsx";
import "../styles/diagnostic_cart.css";

const DiagnosticsCheckout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const total = location.state?.total || 0;
  const items = location.state?.items || [];
  const [address, setAddress] = React.useState("");
  const [slot, setSlot] = React.useState("Morning Slot");
  const [errors, setErrors] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [apiError, setApiError] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");

  const onConfirm = async () => {
    const next = {};
    if (!address.trim()) next.address = "Please enter your sample collection address";
    if (!slot) next.slot = "Please select a slot";
    if (!items.length) next.items = "No tests found in cart";
    setErrors(next);
    if (Object.keys(next).length) return;

    setIsSubmitting(true);
    setApiError("");
    setSuccessMessage("");
    try {
      await apiPost("/diagnostics/orders", {
        items: items.map((item) => ({
          testId: item.id,
          qty: item.qty
        })),
        address,
        slot
      }, { withAuth: true });
      setSuccessMessage("Booking confirmed successfully.");
      setTimeout(() => {
        navigate("/patient/dashboard");
      }, 500);
    } catch (error) {
      setApiError(error.message || "Unable to confirm booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field, value) => {
    if (field === "address") setAddress(value);
    if (field === "slot") setSlot(value);
    if (errors[field]) {
      const shouldClear = typeof value === "string" ? value.trim() : Boolean(value);
      if (shouldClear) setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (apiError) setApiError("");
    if (successMessage) setSuccessMessage("");
  };

  return (
    <div className="panel checkout-card page-fade">
      <h2>Diagnostics Checkout</h2>
      <p>Payable Amount: INR {total}</p>
      <input placeholder="Sample collection address" value={address} onChange={(e) => updateField("address", e.target.value)} />
      {errors.address ? <small className="field-error">{errors.address}</small> : null}
      <select value={slot} onChange={(e) => updateField("slot", e.target.value)}><option>Morning Slot</option><option>Afternoon Slot</option></select>
      {errors.slot ? <small className="field-error">{errors.slot}</small> : null}
      {errors.items ? <small className="field-error">{errors.items}</small> : null}
      {apiError ? <small className="field-error">{apiError}</small> : null}
      {successMessage ? <small className="field-success">{successMessage} Redirecting...</small> : null}
      <button className="btn-primary" onClick={onConfirm} disabled={isSubmitting}>
        {isSubmitting ? "Confirming..." : "Confirm Booking"}
      </button>
      <Toast open={Boolean(apiError || successMessage)} message={apiError || successMessage} type={apiError ? "error" : "success"} />
    </div>
  );
};

export default DiagnosticsCheckout;





