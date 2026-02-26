import React from "react";

const PharmacyCard = ({ name, details, price, action }) => (
  <article className="metric-card">
    <h4>{name || "Medicine"}</h4>
    <p>{details || "Medicine details"}</p>
    <p><strong>{price || "-"}</strong></p>
    {action}
  </article>
);

export default PharmacyCard;
