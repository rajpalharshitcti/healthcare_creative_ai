import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Sidebar = () => {
  const { role, menus } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className={`menu-toggle ${open ? "open" : ""}`} onClick={() => setOpen(!open)} aria-label="Toggle menu">
        <span />
        <span />
        <span />
      </button>
      {open ? <button className="sidebar-overlay" onClick={() => setOpen(false)} aria-label="close" /> : null}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <h3>{role === "patient" ? "Patient Workspace" : "Doctor Workspace"}</h3>
        <nav>
          {menus[role].map((item) => (
            <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)} className={({ isActive }) => isActive ? "active" : ""}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
