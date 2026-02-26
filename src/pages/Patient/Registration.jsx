import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import Toast from "../../components/Toast.jsx";
import "../../styles/pages/patientRegistration.css";

const Registration = () => {
  const navigate = useNavigate();
  const { completePatientRegistration } = useAuth();
  const [form, setForm] = React.useState({
    ageGroup: "",
    bloodGroup: "",
    primaryNeed: "",
    city: ""
  });
  const [errors, setErrors] = React.useState({});
  const [apiError, setApiError] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");

  const validate = () => {
    const next = {};
    if (!form.ageGroup) next.ageGroup = "Please select an age group";
    if (!form.bloodGroup) next.bloodGroup = "Please select a blood group";
    if (!form.primaryNeed) next.primaryNeed = "Please select a healthcare need";
    if (!form.city.trim()) next.city = "Please enter your city";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setApiError("");
    setSuccessMessage("");
    const result = await completePatientRegistration(form);
    if (!result.success) {
      setApiError(result.message || "Unable to complete registration");
      return;
    }
    setSuccessMessage("Patient registration completed successfully.");
    setTimeout(() => {
      navigate("/patient/dashboard");
    }, 500);
  };

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      const shouldClear = typeof value === "string" ? value.trim() : Boolean(value);
      if (shouldClear) setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (apiError) setApiError("");
    if (successMessage) setSuccessMessage("");
  };

  return (
    <div className="page-fade">
      <Header />
      <div className="patient-registration-page">
        <form className="patient-registration-card" onSubmit={(e) => e.preventDefault()} noValidate>
          <h2>Patient Registration</h2>
          <p>Complete basic details to activate patient workspace.</p>

          <label>Age Group</label>
          <select value={form.ageGroup} onChange={(e) => updateField("ageGroup", e.target.value)}>
            <option value="">Select age group</option>
            <option>18-25</option>
            <option>26-40</option>
            <option>41-60</option>
            <option>60+</option>
          </select>
          {errors.ageGroup ? <small className="field-error">{errors.ageGroup}</small> : null}

          <label>Blood Group</label>
          <select value={form.bloodGroup} onChange={(e) => updateField("bloodGroup", e.target.value)}>
            <option value="">Select blood group</option>
            <option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
          </select>
          {errors.bloodGroup ? <small className="field-error">{errors.bloodGroup}</small> : null}

          <label>Primary Healthcare Need</label>
          <select value={form.primaryNeed} onChange={(e) => updateField("primaryNeed", e.target.value)}>
            <option value="">Select need</option>
            <option>Routine Checkups</option>
            <option>Chronic Care</option>
            <option>Diagnostics</option>
            <option>Pharmacy</option>
          </select>
          {errors.primaryNeed ? <small className="field-error">{errors.primaryNeed}</small> : null}

          <label>City</label>
          <input value={form.city} onChange={(e) => updateField("city", e.target.value)} placeholder="Enter city" />
          {errors.city ? <small className="field-error">{errors.city}</small> : null}
          {apiError ? <small className="field-error">{apiError}</small> : null}
          {successMessage ? <small className="field-success">{successMessage} Redirecting...</small> : null}

          <button type="button" className="btn-primary" onClick={submit}>Complete Registration</button>
        </form>
      </div>
      <Footer />
      <Toast open={Boolean(apiError || successMessage)} message={apiError || successMessage} type={apiError ? "error" : "success"} />
    </div>
  );
};

export default Registration;

