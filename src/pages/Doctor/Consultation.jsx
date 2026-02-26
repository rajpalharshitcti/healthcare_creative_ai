import React from "react";
import "../../styles/pages/consultation.css";

const Consultation = () => {
  const [medicine, setMedicine] = React.useState("");
  const [dosage, setDosage] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [error, setError] = React.useState("");

  const onSave = () => {
    if (!medicine.trim()) {
      setError("Please enter a medicine name");
      return;
    }
    if (!dosage.trim()) {
      setError("Please enter the dosage");
      return;
    }
    if (!notes.trim()) {
      setError("Please enter clinical notes");
      return;
    }
    setError("");
  };

  const updateField = (setter) => (value) => {
    setter(value);
    if (error && value.trim()) setError("");
  };

  return (
    <div className="consult-layout page-fade">
      <section className="panel video-mock">
        <h2>Consultation Screen</h2>
        <div className="video-box">
          <p>Video Feed Mock</p>
        </div>
      </section>
      <section className="panel consult-notes">
        <h3>Prescription Form</h3>
        <input placeholder="Medicine" value={medicine} onChange={(e) => updateField(setMedicine)(e.target.value)} />
        <input placeholder="Dosage" value={dosage} onChange={(e) => updateField(setDosage)(e.target.value)} />
        <textarea placeholder="Add clinical notes" rows="4" value={notes} onChange={(e) => updateField(setNotes)(e.target.value)} />
        {error ? <small className="field-error">{error}</small> : null}
        <button className="btn-primary" onClick={onSave}>Save Prescription (UI)</button>
      </section>
    </div>
  );
};

export default Consultation;

