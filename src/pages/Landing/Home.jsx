import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import RoleSelectionModal from "../../components/RoleSelectionModal.jsx";
import DoctorCarousel from "../../components/DoctorCarousel.jsx";
import DoctorCard from "../../components/DoctorCard.jsx";
import { apiGet } from "../../services/apiClient.js";
import "../../styles/pages/home.css";

const features = [
  { title: "Book Appointment", description: "Find verified doctors and reserve slots instantly.", to: "/patient/search-doctors" },
  { title: "Video Consultation", description: "Consult online with secure video workflows.", to: "/patient/book" },
  { title: "Order Medicines", description: "Browse pharmacy products with quick cart checkout.", to: "/patient/pharmacy" },
  { title: "Diagnostic Tests", description: "Book test packages and individual lab tests.", to: "/patient/diagnostics" },
  { title: "Health Records", description: "Maintain and access medical records in one place.", to: "/patient/records" }
];

const Home = () => {
  const { setActiveRole } = useAuth();
  const navigate = useNavigate();
  const [openRoleModal, setOpenRoleModal] = useState(false);
  const [query, setQuery] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [discovery, setDiscovery] = useState([]);

  React.useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [doctorsRes, discoveryRes] = await Promise.all([
          apiGet("/doctors"),
          apiGet("/discovery")
        ]);
        if (!mounted) return;
        setDoctors(doctorsRes.data.doctors || []);
        setDiscovery(discoveryRes.data.discovery || []);
      } catch (_error) {
        if (!mounted) return;
        setDoctors([]);
        setDiscovery([]);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const searchPool = useMemo(() => {
    const fromDoctors = doctors.flatMap((doctor) => [doctor.name, doctor.speciality, doctor.hospital]);
    return [...new Set([...fromDoctors, "Full Body Checkup", "Paracetamol 650", "Thyroid Profile", "Diagnostic Tests"])];
  }, [doctors]);

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    return searchPool.filter((item) => item.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
  }, [query]);

  const matchingDoctors = useMemo(() => {
    if (!query.trim()) return [];
    const lowered = query.toLowerCase();
    return doctors.filter((doctor) =>
      doctor.name.toLowerCase().includes(lowered) ||
      doctor.speciality.toLowerCase().includes(lowered) ||
      doctor.hospital.toLowerCase().includes(lowered)
    );
  }, [query, doctors]);

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
          <h1>Your Trusted Digital Healthcare Partner</h1>
          <p>
            Book appointments, consult doctors, order medicines and manage your health in one place.
          </p>
          <div className="hero-cta">
            <button className="btn-primary" onClick={() => setOpenRoleModal(true)}>Get Started</button>
            <Link to="/patient/search-doctors" className="btn-ghost">Explore Doctors</Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="pulse pulse-1" />
          <div className="pulse pulse-2" />
          <div className="pulse pulse-3" />
        </div>
      </section>

      <section className="search-panel">
        <h2>Search Doctors, Specialities, Hospitals, Tests, Pharmacy</h2>
        <div className="search-box">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search healthcare services..." />
          <button className="btn-primary" onClick={onSearch}>Search</button>
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
        <h2 className="section-title">Core Healthcare Features</h2>
        <div className="feature-grid">
          {features.map((item) => (
            <Link key={item.title} className="feature-card clickable-card" to={item.to}>
              <div className="feature-icon">+</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="section-title">Doctor Highlights</h2>
        <DoctorCarousel doctors={doctors} />
      </section>

      <section>
        <h2 className="section-title">Discover Healthcare Services</h2>
        <div className="discover-grid">
          {discovery.map((group) => (
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
