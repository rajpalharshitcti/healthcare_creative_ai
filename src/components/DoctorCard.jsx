import React from "react";
import { Link } from "react-router-dom";

const DoctorCard = ({ doctor }) => {
  const fallback = "/images/doctors/doctor-fallback.svg";

  return (
    <article className="doctor-card">
      <img
        src={doctor.photo}
        alt={doctor.name}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.src = fallback;
        }}
      />
      <div className="doctor-meta">
        <h3 className="doctor-name">{doctor.name}</h3>
        <p className="doctor-speciality">{doctor.speciality}</p>
        <p className="doctor-hospital">{doctor.hospital}</p>
        <p className="doctor-stats">{doctor.experience} exp | {doctor.rating} rating</p>
        <p className="doctor-likes">{doctor.likes}% patients recommend</p>
        <div className="doctor-tags">
          {doctor.freeConsultation ? <span className="badge badge-success">Free Consultation</span> : null}
        </div>
        <div className="doctor-actions">
          <a href={`tel:${doctor.phone}`} className="btn-ghost btn-call">Call</a>
          <Link to={`/doctor-profile/${doctor.id}`} className="btn-primary btn-profile">View Profile</Link>
        </div>
      </div>
    </article>
  );
};

export default DoctorCard;
