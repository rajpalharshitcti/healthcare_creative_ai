import React from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import "../../styles/pages/editProfile.css";

const EditProfile = () => {
  const { profile, role, updateProfile } = useAuth();
  const [form, setForm] = React.useState(profile);
  const [errors, setErrors] = React.useState({});

  const onSave = () => {
    const next = {};
    if (!form.fullName?.trim()) next.fullName = "Please enter your name";
    if (!form.email?.trim()) next.email = "Please enter your email address";
    if (!form.phone?.trim()) next.phone = "Please enter your phone number";
    if (!form.city?.trim()) next.city = "Please enter your city";
    setErrors(next);
    if (Object.keys(next).length) return;
    updateProfile(form);
  };

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      const shouldClear = typeof value === "string" ? value.trim() : Boolean(value);
      if (shouldClear) setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="panel profile-edit page-fade">
      <h2>Edit Profile</h2>
      <p>Role: {role}</p>
      <div className="profile-grid">
        <label>Full Name</label>
        <input value={form.fullName} onChange={(e) => updateField("fullName", e.target.value)} />
        {errors.fullName ? <small className="field-error">{errors.fullName}</small> : null}

        <label>Email</label>
        <input value={form.email} onChange={(e) => updateField("email", e.target.value)} />
        {errors.email ? <small className="field-error">{errors.email}</small> : null}

        <label>Phone</label>
        <input value={form.phone} onChange={(e) => updateField("phone", e.target.value)} />
        {errors.phone ? <small className="field-error">{errors.phone}</small> : null}

        <label>City</label>
        <input value={form.city} onChange={(e) => updateField("city", e.target.value)} />
        {errors.city ? <small className="field-error">{errors.city}</small> : null}
      </div>
      <button className="btn-primary" onClick={onSave}>Save Changes</button>
    </div>
  );
};

export default EditProfile;

