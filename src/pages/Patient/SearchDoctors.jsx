import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DoctorCard from "../../components/DoctorCard.jsx";
import { apiGet } from "../../services/apiClient.js";
import "../../styles/pages/searchDoctors.css";

const SearchDoctors = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("query") || "";
  const [speciality, setSpeciality] = useState("all");
  const [freeOnly, setFreeOnly] = useState(false);
  const [rating, setRating] = useState(4.5);
  const [query, setQuery] = useState(initialQuery);
  const [doctors, setDoctors] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);

  React.useEffect(() => {
    let mounted = true;
    const loadAll = async () => {
      try {
        const response = await apiGet("/doctors");
        if (!mounted) return;
        setAllDoctors(response.data.doctors || []);
      } catch (_error) {
        if (!mounted) return;
        setAllDoctors([]);
      }
    };
    loadAll();
    return () => {
      mounted = false;
    };
  }, []);

  React.useEffect(() => {
    let mounted = true;
    const loadFiltered = async () => {
      try {
        const response = await apiGet("/doctors", {
          params: {
            query: query.trim(),
            speciality,
            freeOnly,
            minRating: rating
          }
        });
        if (!mounted) return;
        setDoctors(response.data.doctors || []);
      } catch (_error) {
        if (!mounted) return;
        setDoctors([]);
      }
    };
    loadFiltered();
    return () => {
      mounted = false;
    };
  }, [query, speciality, freeOnly, rating]);

  const filtered = useMemo(
    () => doctors,
    [doctors]
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
          {[...new Set(allDoctors.map((d) => d.speciality))].map((s) => <option key={s} value={s}>{s}</option>)}
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
