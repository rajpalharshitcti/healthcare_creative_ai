import React from "react";

const Toast = ({ open, message, type = "success" }) => {
  if (!open) return null;
  const className = `toast ${type === "error" ? "toast-error" : "toast-success"}`;
  return <div className={className}>{message}</div>;
};

export default Toast;
