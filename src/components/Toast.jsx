import React from "react";

const Toast = ({ open, message }) => {
  if (!open) return null;
  return <div className="toast">{message}</div>;
};

export default Toast;
