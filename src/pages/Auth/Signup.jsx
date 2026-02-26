import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import RoleSelectionModal from "../../components/RoleSelectionModal.jsx";
import "../../styles/pages/signup.css";

const Signup = () => {
  const { signup, setActiveRole } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = React.useState({
    fullName: "",
    email: "",
    phone: "",
    password: ""
  });
  const [errors, setErrors] = React.useState({});
  const [openRoleModal, setOpenRoleModal] = React.useState(false);
  const signupImage = "https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=1200&q=80";

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = "Please enter your name";
    if (!form.email.trim()) next.email = "Please enter your email address";
    if (!form.phone.trim()) next.phone = "Please enter your phone number";
    if (!form.password.trim()) next.password = "Please enter your password";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSignupStart = () => {
    if (!validate()) return;
    setOpenRoleModal(true);
  };

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      const shouldClear = typeof value === "string" ? value.trim() : Boolean(value);
      if (shouldClear) setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const onRoleSelect = (role) => {
    setOpenRoleModal(false);
    setActiveRole(role);
    signup(form);
    navigate(role === "doctor" ? "/doctor/onboarding" : "/patient/register");
  };

  return (
    <div className="page-fade">
      <Header />
      <div className="signup-page">
        <div className="signup-card">
          <section className="signup-form-side">
            <div className="signup-mini-brand">
              <img src="/images/icons/logo-mark.svg" alt="HealthSphere logo" />
              <span>HealthSphere</span>
            </div>
            <h2>Sign Up</h2>
            <p>Let's get you all set up so you can access your account.</p>

            <form onSubmit={(e) => e.preventDefault()} noValidate>
              <label>Full Name</label>
              <input value={form.fullName} onChange={(e) => updateField("fullName", e.target.value)} placeholder="Enter full name" />
              {errors.fullName ? <small className="field-error">{errors.fullName}</small> : null}

              <label>Email</label>
              <input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} placeholder="Enter email" />
              {errors.email ? <small className="field-error">{errors.email}</small> : null}

              <label>Phone Number</label>
              <input value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="Enter phone number" />
              {errors.phone ? <small className="field-error">{errors.phone}</small> : null}

              <label>Password</label>
              <input type="password" value={form.password} onChange={(e) => updateField("password", e.target.value)} placeholder="Create password" />
              {errors.password ? <small className="field-error">{errors.password}</small> : null}

              <button type="button" className="btn-primary" onClick={onSignupStart}>Create Account</button>
            </form>

            <div className="signup-links">
              <span>Already have an account?</span>
              <Link to="/login">Login</Link>
            </div>
          </section>

          <section className="signup-image-side">
            <img src={signupImage} alt="Premium healthcare environment" />
          </section>
        </div>
        <div className="signup-back-home">
          <Link to="/">Back to Home</Link>
        </div>
      </div>
      <Footer />
      <RoleSelectionModal open={openRoleModal} onClose={() => setOpenRoleModal(false)} onSelect={onRoleSelect} />
    </div>
  );
};

export default Signup;

