import React from "react";

const AppointmentCard = ({ title, subtitle, status, actions }) => (
  <article className="metric-card">
    <h4>{title || "Appointment"}</h4>
    <p>{subtitle || "Details will appear here."}</p>
    {status ? <p className="doctor-stats">Status: {status}</p> : null}
    {actions}
  </article>
);

export default AppointmentCard;
