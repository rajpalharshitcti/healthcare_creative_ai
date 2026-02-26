import React from "react";
import { apiGet, apiPost } from "../services/apiClient.js";
import Toast from "../components/Toast.jsx";
import "../styles/video_consultation.css";

const Consultation = () => {
  const [appointmentId, setAppointmentId] = React.useState("");
  const [medicine, setMedicine] = React.useState("");
  const [dosage, setDosage] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [error, setError] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");

  React.useEffect(() => {
    let mounted = true;
    const loadAppointments = async () => {
      try {
        const response = await apiGet("/appointments/doctor/my", { withAuth: true });
        const first = response.data.appointments?.[0];
        if (!mounted) return;
        setAppointmentId(first?.id || "");
      } catch (_error) {
        if (!mounted) return;
        setAppointmentId("");
      }
    };
    loadAppointments();
    return () => {
      mounted = false;
    };
  }, []);

  const onSave = async () => {
    setSuccessMessage("");
    if (!appointmentId) {
      setError("No appointment available for prescription");
      return;
    }
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
    try {
      await apiPost("/consultations/prescriptions", {
        appointmentId,
        medicine,
        dosage,
        notes
      }, { withAuth: true });
      setError("");
      setSuccessMessage("Prescription saved successfully.");
    } catch (apiError) {
      setError(apiError.message || "Unable to save prescription");
    }
  };

  const updateField = (setter) => (value) => {
    setter(value);
    if (error && value.trim()) setError("");
    if (successMessage && value.trim()) setSuccessMessage("");
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
        {successMessage ? <small className="field-success">{successMessage}</small> : null}
        <button className="btn-primary" onClick={onSave}>Save Prescription (UI)</button>
      </section>
      <Toast open={Boolean(error || successMessage)} message={error || successMessage} type={error ? "error" : "success"} />
    </div>
  );
};

export default Consultation;




