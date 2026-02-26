import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import Toast from "../../components/Toast.jsx";
import "../../styles/pages/onboarding.css";

const Onboarding = () => {
  const { completeDoctorOnboarding } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = React.useState(1);
  const [form, setForm] = React.useState({
    speciality: "",
    qualification: "",
    registrationNo: "",
    clinicName: "",
    experience: "",
    consultationMode: "",
    city: ""
  });
  const [errors, setErrors] = React.useState({});
  const [apiError, setApiError] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");

  const validateStepOne = () => {
    const next = {};
    if (!form.speciality) next.speciality = "Please select a specialty";
    if (!form.qualification) next.qualification = "Please select a qualification";
    if (!form.experience) next.experience = "Please select your experience";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateStepTwo = () => {
    const next = {};
    if (!form.registrationNo.trim()) next.registrationNo = "Please enter your registration number";
    if (!form.clinicName.trim()) next.clinicName = "Please enter your clinic or hospital name";
    if (!form.consultationMode) next.consultationMode = "Please select a consultation mode";
    if (!form.city.trim()) next.city = "Please enter your city";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async () => {
    if (!validateStepTwo()) return;
    setApiError("");
    setSuccessMessage("");
    const result = await completeDoctorOnboarding(form);
    if (!result.success) {
      setApiError(result.message || "Unable to complete onboarding");
      return;
    }
    setSuccessMessage("Doctor onboarding completed successfully.");
    setTimeout(() => {
      navigate("/doctor/dashboard");
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
      <div className="onboarding-page">
        <form className="onboarding-card" onSubmit={(e) => e.preventDefault()} noValidate>
          <h2>Doctor Onboarding</h2>
          <p>Complete mandatory basic details to activate your doctor workspace.</p>
          <p className="step-indicator">Step {step} of 2</p>

          {step === 1 ? (
            <>
              <label>Speciality</label>
              <select value={form.speciality} onChange={(e) => updateField("speciality", e.target.value)}>
                <option value="">Select speciality</option>
                <option>Cardiologist</option>
                <option>Dermatologist</option>
                <option>General Physician</option>
                <option>Neurologist</option>
              </select>
              {errors.speciality ? <small className="field-error">{errors.speciality}</small> : null}

              <label>Qualification</label>
              <select value={form.qualification} onChange={(e) => updateField("qualification", e.target.value)}>
                <option value="">Select qualification</option>
                <option>MBBS</option>
                <option>MD</option>
                <option>MS</option>
                <option>DM</option>
              </select>
              {errors.qualification ? <small className="field-error">{errors.qualification}</small> : null}

              <label>Experience (Years)</label>
              <select value={form.experience} onChange={(e) => updateField("experience", e.target.value)}>
                <option value="">Select experience</option>
                <option>1-3</option>
                <option>4-7</option>
                <option>8-12</option>
                <option>12+</option>
              </select>
              {errors.experience ? <small className="field-error">{errors.experience}</small> : null}
            </>
          ) : (
            <>
              <label>Registration Number</label>
              <input value={form.registrationNo} onChange={(e) => updateField("registrationNo", e.target.value)} placeholder="Medical registration no." />
              {errors.registrationNo ? <small className="field-error">{errors.registrationNo}</small> : null}

              <label>Clinic / Hospital Name</label>
              <input value={form.clinicName} onChange={(e) => updateField("clinicName", e.target.value)} placeholder="Enter clinic name" />
              {errors.clinicName ? <small className="field-error">{errors.clinicName}</small> : null}

              <label>Consultation Mode</label>
              <select value={form.consultationMode} onChange={(e) => updateField("consultationMode", e.target.value)}>
                <option value="">Select consultation mode</option>
                <option>In Clinic</option>
                <option>Video Consultation</option>
                <option>Both</option>
              </select>
              {errors.consultationMode ? <small className="field-error">{errors.consultationMode}</small> : null}

              <label>City</label>
              <input value={form.city} onChange={(e) => updateField("city", e.target.value)} placeholder="e.g. Delhi" />
              {errors.city ? <small className="field-error">{errors.city}</small> : null}
            </>
          )}
          {apiError ? <small className="field-error">{apiError}</small> : null}
          {successMessage ? <small className="field-success">{successMessage} Redirecting...</small> : null}

          <div className="onboarding-actions">
            {step === 2 ? (
              <button type="button" className="btn-ghost icon-btn" onClick={() => { setErrors({}); setStep(1); }}>
                <img src="/images/icons/arrow-left.svg" alt="" />
                Back
              </button>
            ) : null}
            {step === 1 ? (
              <button type="button" className="btn-primary icon-btn" onClick={() => { if (validateStepOne()) { setErrors({}); setStep(2); } }}>
                <img src="/images/icons/arrow-right.svg" alt="" />
                Next
              </button>
            ) : (
              <button type="button" className="btn-primary icon-btn" onClick={onSubmit}>
                <img src="/images/icons/check.svg" alt="" />
                Complete Onboarding
              </button>
            )}
          </div>
        </form>
      </div>
      <Footer />
      <Toast open={Boolean(apiError || successMessage)} message={apiError || successMessage} type={apiError ? "error" : "success"} />
    </div>
  );
};

export default Onboarding;

