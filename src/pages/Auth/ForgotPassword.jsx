import React from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import "../../styles/pages/forgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState("");
  const [sent, setSent] = React.useState(false);

  const onSubmit = () => {
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    setError("");
    setSent(true);
  };

  return (
    <div className="page-fade">
      <Header />
      <div className="forgot-page">
        <form className="forgot-card" onSubmit={(e) => e.preventDefault()} noValidate>
          <h2>Forgot Password</h2>
          <p>Enter your registered email to receive reset link.</p>
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
          {sent ? <small className="field-success">Reset link sent (mock).</small> : null}
          <button type="button" className="btn-primary" onClick={onSubmit}>Send Reset Link</button>
          <div className="forgot-links">
            <Link to="/login">Back to login</Link>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;

