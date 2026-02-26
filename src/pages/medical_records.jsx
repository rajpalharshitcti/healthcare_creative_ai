import React from "react";
import { apiGet, apiPost } from "../services/apiClient.js";
import Toast from "../components/Toast.jsx";
import "../styles/medical_records.css";

const MedicalRecords = () => {
  const [records, setRecords] = React.useState([]);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");

  const loadRecords = React.useCallback(async () => {
    try {
      const response = await apiGet("/records/my", { withAuth: true });
      setRecords(response.data.records || []);
      setErrorMessage("");
    } catch (_error) {
      setRecords([]);
      setErrorMessage("Unable to load medical records.");
    }
  }, []);

  React.useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const onUpload = async () => {
    const title = window.prompt("Record title");
    if (!title) return;
    const date = window.prompt("Record date (YYYY-MM-DD)");
    if (!date) return;

    try {
      await apiPost("/records", { title, date }, { withAuth: true });
      await loadRecords();
      setSuccessMessage("Medical record uploaded successfully.");
      setTimeout(() => setSuccessMessage(""), 1600);
    } catch (_error) {
      setErrorMessage("Unable to upload the medical record.");
    }
  };

  return (
    <div className="page-fade">
      <div className="record-head">
        <h2>Medical Records</h2>
        <button className="btn-primary" onClick={onUpload}>Upload Record</button>
      </div>
      {errorMessage ? <small className="field-error">{errorMessage}</small> : null}
      {successMessage ? <small className="field-success">{successMessage}</small> : null}
      <div className="records-grid">
        {records.map((r) => (
          <article key={r.id} className="panel record-item">
            <h3>{r.title}</h3>
            <p>ID: {r.id}</p>
            <p>Date: {r.date}</p>
            <p>Medical Record | HealthSphere Lab</p>
            <button className="btn-ghost">View</button>
          </article>
        ))}
      </div>
      <Toast open={Boolean(errorMessage || successMessage)} message={errorMessage || successMessage} type={errorMessage ? "error" : "success"} />
    </div>
  );
};

export default MedicalRecords;



