import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DoctorCarousel from "../../components/DoctorCarousel.jsx";
import { apiGet } from "../../services/apiClient.js";
import "../../styles/pages/doctorProfile.css";

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = React.useState(null);
  const [similarDoctors, setSimilarDoctors] = React.useState([]);
  const fallback = "/images/doctors/doctor-fallback.svg";
  const activeDoctor = doctor || {
    id: id || "d1",
    name: "Doctor",
    speciality: "Specialist",
    experience: "N/A",
    reviews: 0,
    rating: 0,
    hospital: "Hospital",
    fees: 0,
    timings: "N/A",
    likes: 0,
    photo: fallback
  };

  React.useEffect(() => {
    let mounted = true;
    const loadDoctor = async () => {
      try {
        const [doctorRes, similarRes] = await Promise.all([
          apiGet(`/doctors/${id}`),
          apiGet(`/doctors/${id}/similar`)
        ]);
        if (!mounted) return;
        setDoctor(doctorRes.data.doctor || null);
        setSimilarDoctors(similarRes.data.doctors || []);
      } catch (_error) {
        if (!mounted) return;
        setDoctor(null);
        setSimilarDoctors([]);
      }
    };
    loadDoctor();
    return () => {
      mounted = false;
    };
  }, [id]);

  return (
    <div className="doctor-profile-page page-fade">
      <div className="profile-topbar">
        <button type="button" className="btn-ghost icon-btn" onClick={() => navigate(-1)}>
          <img src="/images/icons/arrow-left.svg" alt="" />
          Back
        </button>
      </div>
      <div className="profile-layout">
      <section className="panel doctor-info-panel">
        <div className="profile-head">
          <img
            src={activeDoctor.photo}
            alt={activeDoctor.name}
            onError={(e) => {
              e.currentTarget.src = fallback;
            }}
          />
          <div>
            <h2>{activeDoctor.name}</h2>
            <p>{activeDoctor.speciality}</p>
            <div className="doctor-meta-row">
              <span>{activeDoctor.experience} experience</span>
              <span>{activeDoctor.reviews} reviews</span>
              <span>{activeDoctor.rating} rating</span>
            </div>
            <p>{activeDoctor.hospital}</p>
          </div>
        </div>
        <div className="doctor-highlights">
          <div className="highlight-chip"><strong>INR {activeDoctor.fees}</strong><span>Consultation Fee</span></div>
          <div className="highlight-chip"><strong>{activeDoctor.timings}</strong><span>Availability</span></div>
          <div className="highlight-chip"><strong>{activeDoctor.likes}%</strong><span>Patient Recommendation</span></div>
        </div>
        <h3>Experience</h3>
        <p>Specialized clinical practice with evidence-based treatment and patient-first care delivery.</p>
        <h3>Fees</h3>
        <p>INR {activeDoctor.fees} per consultation</p>
        <h3>Timings</h3>
        <p>{activeDoctor.timings}</p>
        <h3>Reviews</h3>
        <p>Patients appreciate clear diagnosis and quick response.</p>
      </section>

      <aside className="booking-sticky panel">
        <h3>Quick Booking</h3>
        <p>Consultation Fee: INR {activeDoctor.fees}</p>
        <Link
          className="btn-primary booking-btn"
          to="/patient/book"
          state={{
            booking: {
              doctorId: activeDoctor.id,
              doctorName: activeDoctor.name,
              fee: activeDoctor.fees,
              mode: "In Clinic"
            }
          }}
        >
          Book Appointment
        </Link>
        <Link
          className="btn-ghost booking-btn"
          to="/patient/book"
          state={{
            booking: {
              doctorId: activeDoctor.id,
              doctorName: activeDoctor.name,
              fee: activeDoctor.fees,
              mode: "Video"
            }
          }}
        >
          Book Video Consultation
        </Link>
      </aside>
      </div>
      <section className="panel similar-doctors-panel">
        <h3>Similar Specialists</h3>
        <p>Explore more {activeDoctor.speciality} doctors with strong patient ratings.</p>
        {similarDoctors.length ? <DoctorCarousel doctors={similarDoctors} /> : <p>No similar doctors available right now.</p>}
      </section>
    </div>
  );
};

export default DoctorProfile;
