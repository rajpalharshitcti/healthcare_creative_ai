import React from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import Toast from "../../components/Toast.jsx";
import { apiPost } from "../../services/apiClient.js";
import "../../styles/pages/forgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const onSubmit = async () => {
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      await apiPost("/auth/forgot-password", { email });
      setSent(true);
    } catch (apiError) {
      setError(apiError.message || "Unable to send reset link");
      setSent(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-fade">
      <Header />
      <div className="forgot-page">
        <form className="forgot-card" onSubmit={(e) => e.preventDefault()} noValidate>
          <h2>Forgot Password</h2>
          <p>Enter your registered email to receive a reset link.</p>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error && e.target.value.trim()) setError("");
              if (sent) setSent(false);
            }}
            placeholder="Enter your email"
          />
          {error ? <small className="field-error">{error}</small> : null}
          {sent ? <small className="field-success">Reset link sent successfully.</small> : null}
          <button type="button" className="btn-primary" onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
          <div className="forgot-links">
            <Link to="/login">Back to login</Link>
          </div>
        </form>
      </div>
      <Footer />
      <Toast
        open={Boolean(error || sent)}
        message={error || (sent ? "Password reset link sent successfully." : "")}
        type={error ? "error" : "success"}
      />
    </div>
  );
};

export default ForgotPassword;

