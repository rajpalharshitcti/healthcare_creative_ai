import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DoctorCard from "../../components/DoctorCard.jsx";
import { doctorsData } from "../../data/doctorsData.js";
import "../../styles/pages/searchDoctors.css";

const SearchDoctors = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("query") || "";
  const [speciality, setSpeciality] = useState("all");
  const [freeOnly, setFreeOnly] = useState(false);
  const [rating, setRating] = useState(4.5);
  const [query, setQuery] = useState(initialQuery);

  const filtered = useMemo(
    () => doctorsData.filter((d) => {
      const matchesText = !query.trim() ||
        d.name.toLowerCase().includes(query.toLowerCase()) ||
        d.speciality.toLowerCase().includes(query.toLowerCase()) ||
        d.hospital.toLowerCase().includes(query.toLowerCase());
      return matchesText && (speciality === "all" || d.speciality === speciality) && d.rating >= rating && (!freeOnly || d.freeConsultation);
    }),
    [query, speciality, freeOnly, rating]
  );

  return (
    <div className="page-fade">
      <h2>Search Doctors</h2>
      <div className="filter-row panel">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by doctor name, speciality or hospital"
        />
        <select value={speciality} onChange={(e) => setSpeciality(e.target.value)}>
          <option value="all">All Specialities</option>
          {[...new Set(doctorsData.map((d) => d.speciality))].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          <option value={4.5}>Rating 4.5+</option>
          <option value={4.7}>Rating 4.7+</option>
          <option value={4.9}>Rating 4.9+</option>
        </select>
        <label className="check"><input type="checkbox" checked={freeOnly} onChange={(e) => setFreeOnly(e.target.checked)} /> Free consultation</label>
      </div>
      <div className="doctor-grid">{filtered.map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} />)}</div>
    </div>
  );
};

export default SearchDoctors;
