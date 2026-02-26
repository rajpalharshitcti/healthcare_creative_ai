import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DoctorCarousel from "../../components/DoctorCarousel.jsx";
import { doctorsData } from "../../data/doctorsData.js";
import "../../styles/pages/doctorProfile.css";

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const doctor = doctorsData.find((d) => d.id === id) || doctorsData[0];
  const specialityMatches = doctorsData.filter((d) => d.speciality === doctor.speciality && d.id !== doctor.id);
  const additionalMatches = doctorsData
    .filter((d) => d.id !== doctor.id && d.speciality !== doctor.speciality)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);
  const similarDoctors = [...specialityMatches, ...additionalMatches].slice(0, 6);
  const fallback = "/images/doctors/doctor-fallback.svg";

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
            src={doctor.photo}
            alt={doctor.name}
            onError={(e) => {
              e.currentTarget.src = fallback;
            }}
          />
          <div>
            <h2>{doctor.name}</h2>
            <p>{doctor.speciality}</p>
            <div className="doctor-meta-row">
              <span>{doctor.experience} experience</span>
              <span>{doctor.reviews} reviews</span>
              <span>{doctor.rating} rating</span>
            </div>
            <p>{doctor.hospital}</p>
          </div>
        </div>
        <div className="doctor-highlights">
          <div className="highlight-chip"><strong>INR {doctor.fees}</strong><span>Consultation Fee</span></div>
          <div className="highlight-chip"><strong>{doctor.timings}</strong><span>Availability</span></div>
          <div className="highlight-chip"><strong>{doctor.likes}%</strong><span>Patient Recommendation</span></div>
        </div>
        <h3>Experience</h3>
        <p>Specialized clinical practice with evidence-based treatment and patient-first care delivery.</p>
        <h3>Fees</h3>
        <p>INR {doctor.fees} per consultation</p>
        <h3>Timings</h3>
        <p>{doctor.timings}</p>
        <h3>Reviews</h3>
        <p>Patients appreciate clear diagnosis and quick response.</p>
      </section>

      <aside className="booking-sticky panel">
        <h3>Quick Booking</h3>
        <p>Consultation Fee: INR {doctor.fees}</p>
        <Link className="btn-primary booking-btn" to="/patient/book">Book Appointment</Link>
        <Link className="btn-ghost booking-btn" to="/patient/book">Book Video Consultation</Link>
      </aside>
      </div>
      <section className="panel similar-doctors-panel">
        <h3>Similar Specialists</h3>
        <p>Explore more {doctor.speciality} doctors with strong patient ratings.</p>
        {similarDoctors.length ? <DoctorCarousel doctors={similarDoctors} /> : <p>No similar doctors available right now.</p>}
      </section>
    </div>
  );
};

export default DoctorProfile;
