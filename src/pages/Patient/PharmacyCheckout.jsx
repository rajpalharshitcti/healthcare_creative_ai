import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/pages/pharmacyCheckout.css";

const PharmacyCheckout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const total = location.state?.total || 0;
  const [address, setAddress] = React.useState("");
  const [paymentMode, setPaymentMode] = React.useState("Cash on Delivery");
  const [errors, setErrors] = React.useState({});

  const onPlaceOrder = () => {
    const next = {};
    if (!address.trim()) next.address = "Please enter your delivery address";
    if (!paymentMode) next.paymentMode = "Please select a payment mode";
    setErrors(next);
    if (Object.keys(next).length) return;
    navigate("/patient/dashboard");
  };

  const updateField = (field, value) => {
    if (field === "address") setAddress(value);
    if (field === "paymentMode") setPaymentMode(value);
    if (errors[field]) {
      const shouldClear = typeof value === "string" ? value.trim() : Boolean(value);
      if (shouldClear) setErrors((prev) => ({ ...prev, [field]: "" }));
    }
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
      <button className="btn-primary" onClick={onPlaceOrder}>Place Order (Mock)</button>
    </div>
  );
};

export default PharmacyCheckout;

