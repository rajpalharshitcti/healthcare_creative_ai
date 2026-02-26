import React, { useState } from "react";
import { apiGet, apiPut } from "../../services/apiClient.js";
import Toast from "../../components/Toast.jsx";
import "../../styles/pages/profileSetup.css";

const tabs = ["Personal Details", "Lifestyle", "Medical History"];

const ProfileSetup = () => {
  const [tab, setTab] = useState(tabs[0]);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [personal, setPersonal] = useState({ name: "", age: "", bloodGroup: "" });
  const [lifestyle, setLifestyle] = useState({ lifestyle: "", sleepHours: "", diet: "" });
  const [history, setHistory] = useState({ chronic: "", allergies: "", medications: "" });

  React.useEffect(() => {
    let mounted = true;
    const loadProfile = async () => {
      try {
        const response = await apiGet("/patients/me", { withAuth: true });
        if (!mounted || !response.data.patient) return;
        const patient = response.data.patient;
        setPersonal({
          name: patient.full_name || "",
          age: patient.age ? String(patient.age) : "",
          bloodGroup: patient.blood_group || ""
        });
        setLifestyle({
          lifestyle: patient.lifestyle || "",
          sleepHours: patient.sleep_hours || "",
          diet: patient.diet || ""
        });
        setHistory({
          chronic: patient.chronic_conditions || "",
          allergies: patient.allergies || "",
          medications: patient.medications || ""
        });
      } catch (_error) {
        if (!mounted) return;
      }
    };
    loadProfile();
    return () => {
      mounted = false;
    };
  }, []);

  const onSave = async () => {
    const next = {};
    if (tab === "Personal Details") {
      if (!personal.name.trim()) next.name = "Please enter your name";
      if (!personal.age.trim()) next.age = "Please enter your age";
      if (!personal.bloodGroup.trim()) next.bloodGroup = "Please enter your blood group";
    }
    if (tab === "Lifestyle") {
      if (!lifestyle.lifestyle.trim()) next.lifestyle = "Please enter your lifestyle details";
      if (!lifestyle.sleepHours.trim()) next.sleepHours = "Please enter your sleep hours";
      if (!lifestyle.diet.trim()) next.diet = "Please enter your diet preference";
    }
    if (tab === "Medical History") {
      if (!history.chronic.trim()) next.chronic = "Please enter your chronic condition details";
      if (!history.allergies.trim()) next.allergies = "Please enter your allergies";
      if (!history.medications.trim()) next.medications = "Please enter your current medications";
    }
    setErrors(next);
    if (Object.keys(next).length) return;
    setApiError("");
    setSuccessMessage("");
    try {
      await apiPut("/patients/profile-setup", {
        personalDetails: {
          name: personal.name,
          age: personal.age,
          bloodGroup: personal.bloodGroup
        },
        lifestyle,
        medicalHistory: history
      }, { withAuth: true });
      setSuccessMessage("Profile details saved successfully.");
    } catch (error) {
      setApiError(error.message || "Unable to save profile");
    }
  };

  const clearFieldError = (field, value) => {
    if (errors[field] && value.trim()) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (apiError && value.trim()) {
      setApiError("");
    }
    if (successMessage && value.trim()) {
      setSuccessMessage("");
    }
  };

  return (
    <div className="panel page-fade">
      <h2>Profile Setup</h2>
      <div className="tab-row">
        {tabs.map((t) => (
          <button key={t} onClick={() => { setErrors({}); setTab(t); }} className={tab === t ? "active" : ""}>{t}</button>
        ))}
      </div>

      {tab === "Personal Details" ? (
        <form className="form-grid" onSubmit={(e) => e.preventDefault()}>
          <input value={personal.name} onChange={(e) => { setPersonal((p) => ({ ...p, name: e.target.value })); clearFieldError("name", e.target.value); }} placeholder="Full Name" />
          {errors.name ? <small className="field-error">{errors.name}</small> : null}
          <input value={personal.age} onChange={(e) => { setPersonal((p) => ({ ...p, age: e.target.value })); clearFieldError("age", e.target.value); }} placeholder="Age" />
          {errors.age ? <small className="field-error">{errors.age}</small> : null}
          <input value={personal.bloodGroup} onChange={(e) => { setPersonal((p) => ({ ...p, bloodGroup: e.target.value })); clearFieldError("bloodGroup", e.target.value); }} placeholder="Blood Group" />
          {errors.bloodGroup ? <small className="field-error">{errors.bloodGroup}</small> : null}
        </form>
      ) : null}

      {tab === "Lifestyle" ? (
        <form className="form-grid" onSubmit={(e) => e.preventDefault()}>
          <textarea value={lifestyle.lifestyle} onChange={(e) => { setLifestyle((p) => ({ ...p, lifestyle: e.target.value })); clearFieldError("lifestyle", e.target.value); }} />
          {errors.lifestyle ? <small className="field-error">{errors.lifestyle}</small> : null}
          <input value={lifestyle.sleepHours} onChange={(e) => { setLifestyle((p) => ({ ...p, sleepHours: e.target.value })); clearFieldError("sleepHours", e.target.value); }} placeholder="Sleep hours" />
          {errors.sleepHours ? <small className="field-error">{errors.sleepHours}</small> : null}
          <input value={lifestyle.diet} onChange={(e) => { setLifestyle((p) => ({ ...p, diet: e.target.value })); clearFieldError("diet", e.target.value); }} placeholder="Diet preference" />
          {errors.diet ? <small className="field-error">{errors.diet}</small> : null}
        </form>
      ) : null}

      {tab === "Medical History" ? (
        <form className="form-grid" onSubmit={(e) => e.preventDefault()}>
          <textarea value={history.chronic} onChange={(e) => { setHistory((p) => ({ ...p, chronic: e.target.value })); clearFieldError("chronic", e.target.value); }} />
          {errors.chronic ? <small className="field-error">{errors.chronic}</small> : null}
          <textarea value={history.allergies} onChange={(e) => { setHistory((p) => ({ ...p, allergies: e.target.value })); clearFieldError("allergies", e.target.value); }} />
          {errors.allergies ? <small className="field-error">{errors.allergies}</small> : null}
          <input value={history.medications} onChange={(e) => { setHistory((p) => ({ ...p, medications: e.target.value })); clearFieldError("medications", e.target.value); }} placeholder="Current medications" />
          {errors.medications ? <small className="field-error">{errors.medications}</small> : null}
        </form>
      ) : null}

      <button className="btn-primary" onClick={onSave}>Save Profile</button>
      {apiError ? <small className="field-error">{apiError}</small> : null}
      {successMessage ? <small className="field-success">{successMessage}</small> : null}
      <Toast open={Boolean(apiError || successMessage)} message={apiError || successMessage} type={apiError ? "error" : "success"} />
    </div>
  );
};

export default ProfileSetup;


