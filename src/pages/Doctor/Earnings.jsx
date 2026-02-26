import React from "react";
import "../../styles/pages/earnings.css";

const monthly = [
  { label: "Jan", value: 52 },
  { label: "Feb", value: 68 },
  { label: "Mar", value: 61 },
  { label: "Apr", value: 74 },
  { label: "May", value: 79 },
  { label: "Jun", value: 84 }
];

const Earnings = () => (
  <div className="panel page-fade">
    <h2>Earnings Summary</h2>
    <p className="subtle">Monthly earnings performance (mock data)</p>
    <div className="graph-wrap">
      {monthly.map((m) => (
        <div key={m.label} className="bar-col">
          <div className="bar" style={{ height: `${m.value}%` }} />
          <span>{m.label}</span>
        </div>
      ))}
    </div>
    <h3>Current Month: INR 84,500</h3>
  </div>
);

export default Earnings;
