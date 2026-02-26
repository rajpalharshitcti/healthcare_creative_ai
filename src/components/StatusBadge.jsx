import React from "react";

const StatusBadge = ({ status }) => {
  const key = String(status).toLowerCase();
  return <span className={`status-badge ${key}`}>{status}</span>;
};

export default StatusBadge;
