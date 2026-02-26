import React from "react";

const TestPackageCard = ({ name, description, price, action }) => (
  <article className="metric-card">
    <h4>{name || "Test Package"}</h4>
    <p>{description || "Package description"}</p>
    <p><strong>{price || "-"}</strong></p>
    {action}
  </article>
);

export default TestPackageCard;
