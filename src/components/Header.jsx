import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import WorkspaceSwitchModal from "./WorkspaceSwitchModal.jsx";

const Header = () => {
  const { role, setActiveRole, isAuthenticated, logout, canUseRole, switchWorkspace } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const [workspaceOpen, setWorkspaceOpen] = React.useState(false);
  const publicOnlyPaths = ["/", "/login", "/signup", "/forgot-password", "/doctor/onboarding", "/patient/register"];
  const isPublicHeader = publicOnlyPaths.includes(location.pathname);
  const menuRef = React.useRef(null);
  const topbarRef = React.useRef(null);

  React.useEffect(() => {
    setMenuOpen(false);
    setMobileNavOpen(false);
  }, [location.pathname]);

  React.useEffect(() => {
    const onDocClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false);
      if (topbarRef.current && !topbarRef.current.contains(event.target)) setMobileNavOpen(false);
    };
    const onEsc = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setMobileNavOpen(false);
      }
    };
    if (menuOpen || mobileNavOpen) {
      document.addEventListener("mousedown", onDocClick);
      document.addEventListener("keydown", onEsc);
    }
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [menuOpen, mobileNavOpen]);

  const onLogout = () => {
    setMenuOpen(false);
    setMobileNavOpen(false);
    logout();
    navigate("/login");
  };

  const onWorkspaceChoose = (targetRole) => {
    setWorkspaceOpen(false);
    setMenuOpen(false);
    setMobileNavOpen(false);
    setActiveRole(targetRole);
    if (canUseRole(targetRole)) {
      switchWorkspace(targetRole);
      navigate(targetRole === "patient" ? "/patient/dashboard" : "/doctor/dashboard");
      return;
    }
    navigate(targetRole === "patient" ? "/patient/register" : "/doctor/onboarding");
  };

  return (
    <header className="topbar" ref={topbarRef}>
      <div className="brand-wrap">
        <Link className="brand-mark" to="/">
          <img src="/images/icons/logo-mark.svg" alt="MediNova Care logo" />
        </Link>
        <div className="brand-text">
          <h1>MediNova Care</h1>
          <p>Trusted digital care for every family.</p>
        </div>
      </div>

      <button
        type="button"
        className={`topbar-hamburger ${mobileNavOpen ? "open" : ""}`}
        aria-expanded={mobileNavOpen}
        aria-controls="topbar-actions"
        aria-label="Toggle navigation"
        onClick={() => setMobileNavOpen((prev) => !prev)}
      >
        <span />
        <span />
        <span />
      </button>

      <div className={`topbar-actions ${mobileNavOpen ? "open" : ""}`} id="topbar-actions">
        {isAuthenticated && !isPublicHeader ? (
          <div className="profile-menu-wrap" ref={menuRef}>
            <button
              className="btn-outline profile-menu-btn"
              type="button"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <span>{role === "patient" ? "Patient" : "Doctor"} Menu</span>
              <span className="menu-caret" aria-hidden="true">v</span>
            </button>
            {menuOpen ? (
              <div className="profile-menu" role="menu">
                <Link to="/profile/edit" onClick={() => { setMenuOpen(false); setMobileNavOpen(false); }}>
                  <span className="menu-item-icon" aria-hidden="true">PR</span>
                  <span>My Profile</span>
                </Link>
                <button type="button" onClick={() => { setMenuOpen(false); setWorkspaceOpen(true); }}>
                  <span className="menu-item-icon" aria-hidden="true">SW</span>
                  <span>Switch Workspace</span>
                </button>
                <button type="button" className="danger" onClick={onLogout}>
                  <span className="menu-item-icon" aria-hidden="true">LO</span>
                  <span>Logout</span>
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <>
            <Link className="btn-outline" to="/login" onClick={() => setMobileNavOpen(false)}>Sign In</Link>
            <Link className="btn-primary" to="/signup" onClick={() => setMobileNavOpen(false)}>Create Account</Link>
          </>
        )}
      </div>

      <WorkspaceSwitchModal open={workspaceOpen} onClose={() => setWorkspaceOpen(false)} onChoose={onWorkspaceChoose} />
    </header>
  );
};

export default Header;
