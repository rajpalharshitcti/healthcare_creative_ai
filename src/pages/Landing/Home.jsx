import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import RoleSelectionModal from "../../components/RoleSelectionModal.jsx";
import DoctorCarousel from "../../components/DoctorCarousel.jsx";
import DoctorCard from "../../components/DoctorCard.jsx";
import { doctorsData } from "../../data/doctorsData.js";
import { discoveryData } from "../../data/discoveryData.js";
import "../../styles/pages/home.css";

const features = [
  { title: "Book Appointment", description: "Find verified doctors and reserve slots instantly.", to: "/patient/search-doctors" },
  { title: "Video Consultation", description: "Consult online with secure video workflows.", to: "/patient/book" },
  { title: "Order Medicines", description: "Browse pharmacy products with quick cart checkout.", to: "/patient/pharmacy" },
  { title: "Diagnostic Tests", description: "Book test packages and individual lab tests.", to: "/patient/diagnostics" },
  { title: "Health Records", description: "Maintain and access medical records in one place.", to: "/patient/records" }
];

const specialityChips = ["Cardiology", "Dermatology", "Neurology", "General Care", "Diagnostics", "Pharmacy"];
const trustStats = [
  { label: "Verified Doctors", value: "1,200+" },
  { label: "Monthly Consultations", value: "45K+" },
  { label: "Patient Satisfaction", value: "98%" }
];

const Home = () => {
  const { setActiveRole } = useAuth();
  const navigate = useNavigate();
  const [openRoleModal, setOpenRoleModal] = useState(false);
  const [query, setQuery] = useState("");

  const searchPool = useMemo(() => {
    const fromDoctors = doctorsData.flatMap((doctor) => [doctor.name, doctor.speciality, doctor.hospital]);
    return [...new Set([...fromDoctors, "Full Body Checkup", "Paracetamol 650", "Thyroid Profile", "Diagnostic Tests"])];
  }, []);

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    return searchPool.filter((item) => item.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
  }, [query, searchPool]);

  const matchingDoctors = useMemo(() => {
    if (!query.trim()) return [];
    const lowered = query.toLowerCase();
    return doctorsData.filter((doctor) =>
      doctor.name.toLowerCase().includes(lowered) ||
      doctor.speciality.toLowerCase().includes(lowered) ||
      doctor.hospital.toLowerCase().includes(lowered)
    );
  }, [query]);

  const onRoleSelect = (role) => {
    setActiveRole(role);
    setOpenRoleModal(false);
    navigate("/signup");
  };

  const onSearch = () => {
    if (!query.trim()) return;
    navigate(`/patient/search-doctors?query=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="page-fade">
      <Header />
      <div className="home-page">
        <section className="hero-grid">
          <div className="hero-copy">
            <p className="hero-kicker">Welcome to MediNova Care</p>
            <h1>Smarter Healthcare, Built Around You</h1>
            <p>Book appointments, consult specialists, order medicines and manage records from one secure platform.</p>
            <div className="hero-chip-row">
              {specialityChips.map((chip) => <span key={chip} className="hero-chip">{chip}</span>)}
            </div>
            <div className="hero-cta">
              <button className="btn-primary" onClick={() => setOpenRoleModal(true)}>Start Journey</button>
              <Link to="/patient/search-doctors" className="btn-ghost">Browse Specialists</Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-visual-card">
              <h3>24x7 Connected Care</h3>
              <p>Appointments, diagnostics, pharmacy and health records in one secure ecosystem.</p>
            </div>
            <div className="pulse pulse-1" />
            <div className="pulse pulse-2" />
            <div className="pulse pulse-3" />
          </div>
        </section>

        <section className="trust-strip">
          {trustStats.map((item) => (
            <article key={item.label} className="trust-item">
              <h3>{item.value}</h3>
              <p>{item.label}</p>
            </article>
          ))}
        </section>

        <section className="search-panel">
          <h2>Find Doctors, Hospitals, Tests & Pharmacy</h2>
          <div className="search-box">
            <span className="search-leading" aria-hidden="true">
              <img src="/images/icons/search.svg" alt="" />
            </span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search healthcare services..." />
            {query ? (
              <button type="button" className="search-clear" onClick={() => setQuery("")} aria-label="Clear search">
                x
              </button>
            ) : null}
            <button className="btn-primary" onClick={onSearch}>Find Care</button>
          </div>
          {suggestions.length > 0 ? (
            <div className="suggestion-box">
              {suggestions.map((item) => (
                <button key={item} type="button" className="suggestion-item" onClick={() => setQuery(item)}>
                  <span aria-hidden="true">+</span>
                  <span>{item}</span>
                </button>
              ))}
            </div>
          ) : null}
          {query.trim() ? (
            <div className="search-results-panel">
              <h3>Matching Doctors ({matchingDoctors.length})</h3>
              {matchingDoctors.length ? (
                <div className="doctor-grid">
                  {matchingDoctors.map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} />)}
                </div>
              ) : (
                <p>No matching doctors found for this search. Try another speciality or hospital.</p>
              )}
            </div>
          ) : null}
        </section>

        <section>
          <h2 className="section-title">Care Services</h2>
          <div className="feature-grid">
            {features.map((item) => (
              <Link key={item.title} className="feature-card clickable-card" to={item.to}>
                <div className="feature-icon">*</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="section-title">Featured Specialists</h2>
          <DoctorCarousel doctors={doctorsData} />
        </section>

        <section>
          <h2 className="section-title">Explore Healthcare Categories</h2>
          <div className="discover-grid">
            {discoveryData.map((group) => (
              <article key={group.title} className="discover-card">
                <h3>{group.title}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>
                      <Link to="/login">{item}</Link>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <RoleSelectionModal open={openRoleModal} onClose={() => setOpenRoleModal(false)} onSelect={onRoleSelect} />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
