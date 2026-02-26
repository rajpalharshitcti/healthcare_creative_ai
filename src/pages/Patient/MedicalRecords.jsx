import React from "react";
import "../../styles/pages/medicalRecords.css";

const records = [
  { id: "R-201", title: "Blood Test Report", date: "2026-02-11" },
  { id: "R-202", title: "Lipid Profile", date: "2026-01-03" },
  { id: "R-203", title: "Thyroid Report", date: "2025-12-16" }
];

const MedicalRecords = () => (
  <div className="page-fade">
    <div className="record-head">
      <h2>Medical Records</h2>
      <button className="btn-primary">Upload Record (UI)</button>
    </div>
    <div className="records-grid">
      {records.map((r) => (
        <article key={r.id} className="panel record-item">
          <h3>{r.title}</h3>
          <p>ID: {r.id}</p>
          <p>Date: {r.date}</p>
          <button className="btn-ghost">View</button>
        </article>
      ))}
    </div>
  </div>
);

export default MedicalRecords;
