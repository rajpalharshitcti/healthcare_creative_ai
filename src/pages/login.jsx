import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Header from "../components/header.jsx";
import Footer from "../components/footer.jsx";
import RoleSelectionModal from "../components/RoleSelectionModal.jsx";
import Toast from "../components/Toast.jsx";
import "../styles/login.css";

const Login = () => {
  const { login, setActiveRole } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = React.useState({ email: "", password: "", agreed: false });
  const [showPassword, setShowPassword] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [authError, setAuthError] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");
  const [openRoleModal, setOpenRoleModal] = React.useState(false);

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = "Please enter your email address";
    if (!form.password.trim()) next.password = "Please enter your password";
    if (!form.agreed) next.agreed = "Please accept the Terms and Conditions";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onLogin = async () => {
    if (!validate()) return;
    setAuthError("");
    setSuccessMessage("");
    setOpenRoleModal(true);
  };

  const onRoleSelect = async (selectedRole) => {
    setOpenRoleModal(false);
    setActiveRole(selectedRole);
    const result = await login(form, selectedRole);
    if (!result.success) {
      setAuthError(result.message || "Login failed");
      return;
    }
    setSuccessMessage("Login successful.");
    setTimeout(() => {
      navigate(selectedRole === "patient" ? "/patient/dashboard" : "/doctor/dashboard");
    }, 500);
  };

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      const shouldClear = typeof value === "string" ? value.trim() : Boolean(value);
      if (shouldClear) setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (authError) setAuthError("");
    if (successMessage) setSuccessMessage("");
  };

  return (
    <div className="page-fade">
      <Header />
      <div className="login-page">
        <form className="login-card" onSubmit={(e) => e.preventDefault()} noValidate>
          <div className="login-logo-wrap">
            <img src="/images/icons/logo-mark.svg" alt="HealthSphere logo" />
          </div>
          <h2>Login</h2>
          <p>Welcome back! Please log in to your account.</p>

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
          />
          {errors.email ? <small className="field-error">{errors.email}</small> : null}

          <label htmlFor="password">Password</label>
          <div className="password-wrap">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
            />
            <button type="button" className="eye-btn" onClick={() => setShowPassword((prev) => !prev)} aria-label="Toggle password">
              <img src={showPassword ? "/images/icons/eye-closed.svg" : "/images/icons/eye-open.svg"} alt="" />
            </button>
          </div>
          {errors.password ? <small className="field-error">{errors.password}</small> : null}

          <div className="terms-row">
            <label className="check-line">
              <input type="checkbox" checked={form.agreed} onChange={(e) => updateField("agreed", e.target.checked)} />
              <span>I agree to the Terms & Conditions</span>
            </label>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
          {errors.agreed ? <small className="field-error">{errors.agreed}</small> : null}
          {authError ? <small className="field-error">{authError}</small> : null}
          {successMessage ? <small className="field-success">{successMessage} Redirecting...</small> : null}

          <button className="btn-primary" type="button" onClick={onLogin}>Sign In</button>
          <div className="login-footer-link">
            <span>New user?</span>
            <Link to="/signup">Create Account</Link>
          </div>
        </form>
      </div>
      <Footer />
      <RoleSelectionModal open={openRoleModal} onClose={() => setOpenRoleModal(false)} onSelect={onRoleSelect} />
      <Toast open={Boolean(authError || successMessage)} message={authError || successMessage} type={authError ? "error" : "success"} />
    </div>
  );
};

export default Login;



