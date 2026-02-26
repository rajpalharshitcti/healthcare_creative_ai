import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiPost } from "../services/apiClient.js";
import Toast from "../components/Toast.jsx";
import "../styles/medicine_order.css";

const PharmacyCheckout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const total = location.state?.total || 0;
  const items = location.state?.items || [];
  const [address, setAddress] = React.useState("");
  const [paymentMode, setPaymentMode] = React.useState("Cash on Delivery");
  const [errors, setErrors] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [apiError, setApiError] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");

  const onPlaceOrder = async () => {
    const next = {};
    if (!address.trim()) next.address = "Please enter your delivery address";
    if (!paymentMode) next.paymentMode = "Please select a payment mode";
    if (!items.length) next.items = "No items found in cart";
    setErrors(next);
    if (Object.keys(next).length) return;

    setIsSubmitting(true);
    setApiError("");
    setSuccessMessage("");
    try {
      await apiPost("/pharmacy/orders", {
        items: items.map((item) => ({
          medicineId: item.id,
          qty: item.qty
        })),
        address,
        paymentMode
      }, { withAuth: true });
      setSuccessMessage("Order placed successfully.");
      setTimeout(() => {
        navigate("/patient/dashboard");
      }, 500);
    } catch (error) {
      setApiError(error.message || "Unable to place order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field, value) => {
    if (field === "address") setAddress(value);
    if (field === "paymentMode") setPaymentMode(value);
    if (errors[field]) {
      const shouldClear = typeof value === "string" ? value.trim() : Boolean(value);
      if (shouldClear) setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (apiError) setApiError("");
    if (successMessage) setSuccessMessage("");
  };

  return (
    <div className="panel checkout-card page-fade">
      <h2>Pharmacy Checkout</h2>
      <p>Total Amount: INR {total}</p>
      <input placeholder="Delivery Address" value={address} onChange={(e) => updateField("address", e.target.value)} />
      {errors.address ? <small className="field-error">{errors.address}</small> : null}
      <select value={paymentMode} onChange={(e) => updateField("paymentMode", e.target.value)}>
        <option>Cash on Delivery</option><option>UPI</option><option>Card</option>
      </select>
      {errors.paymentMode ? <small className="field-error">{errors.paymentMode}</small> : null}
      {errors.items ? <small className="field-error">{errors.items}</small> : null}
      {apiError ? <small className="field-error">{apiError}</small> : null}
      {successMessage ? <small className="field-success">{successMessage} Redirecting...</small> : null}
      <button className="btn-primary" onClick={onPlaceOrder} disabled={isSubmitting}>
        {isSubmitting ? "Placing..." : "Place Order (Mock)"}
      </button>
      <Toast open={Boolean(apiError || successMessage)} message={apiError || successMessage} type={apiError ? "error" : "success"} />
    </div>
  );
};

export default PharmacyCheckout;




