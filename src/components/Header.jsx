import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import WorkspaceSwitchModal from "./WorkspaceSwitchModal.jsx";

const Header = () => {
  const { role, setActiveRole, isAuthenticated, logout, canUseRole, switchWorkspace, addRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [workspaceOpen, setWorkspaceOpen] = React.useState(false);
  const publicOnlyPaths = ["/", "/login", "/signup", "/forgot-password", "/doctor/onboarding", "/patient/register"];
  const isPublicHeader = publicOnlyPaths.includes(location.pathname);
  const menuRef = React.useRef(null);

  React.useEffect(() => {
    const onDocClick = (event) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target)) setMenuOpen(false);
    };
    const onEsc = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    if (menuOpen) {
      document.addEventListener("mousedown", onDocClick);
      document.addEventListener("keydown", onEsc);
    }
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [menuOpen]);

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  const onWorkspaceChoose = async (targetRole) => {
    setWorkspaceOpen(false);
    setMenuOpen(false);
    setActiveRole(targetRole);
    if (canUseRole(targetRole)) {
      const result = await switchWorkspace(targetRole);
      if (!result.success) return;
      navigate(targetRole === "patient" ? "/patient/dashboard" : "/doctor/dashboard");
      return;
    }
    const addRoleResult = await addRole(targetRole);
    if (!addRoleResult.success) return;
    navigate(targetRole === "patient" ? "/patient/register" : "/doctor/onboarding");
  };

  return (
    <header className="topbar">
      <div className="brand-wrap">
        <Link className="brand-mark" to="/">
          <img src="/images/icons/logo-mark.svg" alt="HealthSphere logo" />
        </Link>
        <div className="brand-text">
          <h1>HealthSphere Care</h1>
          <p>One Platform. Better Care. Every Day.</p>
        </div>
      </div>
      <div className="topbar-actions">
        {isAuthenticated && !isPublicHeader ? (
          <>
            <div className="profile-menu-wrap" ref={menuRef}>
              <button
                className="btn-ghost profile-menu-btn"
                type="button"
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                <span>{role === "patient" ? "Patient" : "Doctor"} Menu</span>
                <span className="menu-caret" aria-hidden="true">▾</span>
              </button>
              {menuOpen ? (
                <div className="profile-menu" role="menu">
                  <Link to="/profile/edit" onClick={() => setMenuOpen(false)}>
                    <span className="menu-item-icon" aria-hidden="true">👤</span>
                    <span>My Profile</span>
                  </Link>
                  <button type="button" onClick={() => { setMenuOpen(false); setWorkspaceOpen(true); }}>
                    <span className="menu-item-icon" aria-hidden="true">🔄</span>
                    <span>Switch Workspace</span>
                  </button>
                  <button type="button" className="danger" onClick={onLogout}>
                    <span className="menu-item-icon" aria-hidden="true">⎋</span>
                    <span>Logout</span>
                  </button>
                </div>
              ) : null}
            </div>
          </>
        ) : (
          <>
            <Link className="btn-ghost" to="/login">Login</Link>
            <Link className="btn-primary" to="/signup">Signup</Link>
          </>
        )}
      </div>
      <WorkspaceSwitchModal open={workspaceOpen} onClose={() => setWorkspaceOpen(false)} onChoose={onWorkspaceChoose} />
    </header>
  );
};

export default Header;
