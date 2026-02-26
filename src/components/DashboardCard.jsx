import React from "react";

const DashboardCard = ({ title, value, note }) => (
  <article className="metric-card">
    <h4>{title}</h4>
    <h2>{value}</h2>
    <p>{note}</p>
  </article>
);

export default DashboardCard;
