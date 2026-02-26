import React from "react";
import { useAuth } from "../context/AuthContext.jsx";
import Toast from "../components/Toast.jsx";
import "../styles/edit_profile.css";

const EditProfile = () => {
  const { profile, role, updateProfile } = useAuth();
  const [form, setForm] = React.useState(profile);
  const [errors, setErrors] = React.useState({});
  const [apiError, setApiError] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");

  React.useEffect(() => {
    setForm(profile);
  }, [profile]);

  const onSave = async () => {
    const next = {};
    if (!form.fullName?.trim()) next.fullName = "Please enter your name";
    if (!form.email?.trim()) next.email = "Please enter your email address";
    if (!form.phone?.trim()) next.phone = "Please enter your phone number";
    if (!form.city?.trim()) next.city = "Please enter your city";
    if (role === "doctor") {
      if (!form.speciality?.trim()) next.speciality = "Please enter your speciality";
      if (!form.qualification?.trim()) next.qualification = "Please enter your qualification";
      if (!form.registrationNo?.trim()) next.registrationNo = "Please enter your registration number";
      if (!form.clinicName?.trim()) next.clinicName = "Please enter your clinic or hospital name";
    }
    if (role === "patient") {
      if (!form.ageGroup?.trim()) next.ageGroup = "Please enter your age group";
      if (!form.bloodGroup?.trim()) next.bloodGroup = "Please enter your blood group";
      if (!form.primaryNeed?.trim()) next.primaryNeed = "Please enter your primary healthcare need";
    }

    setErrors(next);
    if (Object.keys(next).length) return;
    setSuccessMessage("");
    const result = await updateProfile(form);
    if (!result.success) {
      setApiError(result.message || "Unable to save changes");
      return;
    }
    setApiError("");
    setSuccessMessage("Profile updated successfully.");
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

  const avatar = form.avatar?.trim() || "/images/doctors/doctor-fallback.svg";

  return (
    <div className="panel profile-edit page-fade">
      <h2>Edit Profile</h2>
      <p>Role: {role}</p>

      <div className="profile-avatar-row">
        <img src={avatar} alt={form.fullName || "Profile"} onError={(e) => { e.currentTarget.src = "/images/doctors/doctor-fallback.svg"; }} />
        <div className="profile-avatar-form">
          <label>Profile Image URL</label>
          <input value={form.avatar || ""} onChange={(e) => updateField("avatar", e.target.value)} placeholder="https://..." />
        </div>
      </div>

      <div className="profile-grid">
        <label>Full Name</label>
        <input value={form.fullName || ""} onChange={(e) => updateField("fullName", e.target.value)} />
        {errors.fullName ? <small className="field-error">{errors.fullName}</small> : null}

        <label>Email</label>
        <input value={form.email || ""} onChange={(e) => updateField("email", e.target.value)} />
        {errors.email ? <small className="field-error">{errors.email}</small> : null}

        <label>Phone</label>
        <input value={form.phone || ""} onChange={(e) => updateField("phone", e.target.value)} />
        {errors.phone ? <small className="field-error">{errors.phone}</small> : null}

        <label>City</label>
        <input value={form.city || ""} onChange={(e) => updateField("city", e.target.value)} />
        {errors.city ? <small className="field-error">{errors.city}</small> : null}

        {role === "doctor" ? (
          <>
            <label>Speciality</label>
            <input value={form.speciality || ""} onChange={(e) => updateField("speciality", e.target.value)} />
            {errors.speciality ? <small className="field-error">{errors.speciality}</small> : null}

            <label>Qualification</label>
            <input value={form.qualification || ""} onChange={(e) => updateField("qualification", e.target.value)} />
            {errors.qualification ? <small className="field-error">{errors.qualification}</small> : null}

            <label>Registration Number</label>
            <input value={form.registrationNo || ""} onChange={(e) => updateField("registrationNo", e.target.value)} />
            {errors.registrationNo ? <small className="field-error">{errors.registrationNo}</small> : null}

            <label>Clinic / Hospital</label>
            <input value={form.clinicName || ""} onChange={(e) => updateField("clinicName", e.target.value)} />
            {errors.clinicName ? <small className="field-error">{errors.clinicName}</small> : null}

            <label>Experience</label>
            <input value={form.experience || ""} onChange={(e) => updateField("experience", e.target.value)} />

            <label>Consultation Mode</label>
            <input value={form.consultationMode || ""} onChange={(e) => updateField("consultationMode", e.target.value)} />
          </>
        ) : null}

        {role === "patient" ? (
          <>
            <label>Age Group</label>
            <input value={form.ageGroup || ""} onChange={(e) => updateField("ageGroup", e.target.value)} />
            {errors.ageGroup ? <small className="field-error">{errors.ageGroup}</small> : null}

            <label>Blood Group</label>
            <input value={form.bloodGroup || ""} onChange={(e) => updateField("bloodGroup", e.target.value)} />
            {errors.bloodGroup ? <small className="field-error">{errors.bloodGroup}</small> : null}

            <label>Primary Healthcare Need</label>
            <input value={form.primaryNeed || ""} onChange={(e) => updateField("primaryNeed", e.target.value)} />
            {errors.primaryNeed ? <small className="field-error">{errors.primaryNeed}</small> : null}
          </>
        ) : null}
      </div>
      {apiError ? <small className="field-error">{apiError}</small> : null}
      {successMessage ? <small className="field-success">{successMessage}</small> : null}
      <button className="btn-primary" onClick={onSave}>Save Changes</button>
      <Toast open={Boolean(apiError || successMessage)} message={apiError || successMessage} type={apiError ? "error" : "success"} />
    </div>
  );
};

export default EditProfile;



