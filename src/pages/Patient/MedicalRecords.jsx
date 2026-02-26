import React from "react";
import { medicalRecordsData } from "../../data/medicalRecordsData.js";
import "../../styles/pages/medicalRecords.css";

const MedicalRecords = () => (
  <div className="page-fade">
    <div className="record-head">
      <h2>Medical Records</h2>
      <button className="btn-primary">Upload Record</button>
    </div>
    <div className="records-grid">
      {medicalRecordsData.map((r) => (
        <article key={r.id} className="panel record-item">
          <h3>{r.title}</h3>
          <p>ID: {r.id}</p>
          <p>Date: {r.date}</p>
          <p>{r.type} · {r.lab}</p>
          <button className="btn-ghost">View</button>
        </article>
      ))}
    </div>
  </div>
);

export default MedicalRecords;
