import React, { useMemo, useState } from "react";
import DoctorCard from "./DoctorCard.jsx";

const cardsPerViewByWidth = () => {
  if (typeof window === "undefined") return 3;
  if (window.innerWidth <= 680) return 1;
  if (window.innerWidth <= 1024) return 2;
  return 3;
};

const DoctorCarousel = ({ doctors }) => {
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(cardsPerViewByWidth());

  React.useEffect(() => {
    const onResize = () => {
      const nextPerView = cardsPerViewByWidth();
      setPerView(nextPerView);
      setIndex(0);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const pages = useMemo(() => {
    if (!doctors.length) return [];
    if (doctors.length <= perView) return [doctors];

    const slideCount = Math.ceil(doctors.length / perView);
    const chunks = [];
    for (let i = 0; i < slideCount; i += 1) {
      const start = i * perView;
      const page = [];
      for (let j = 0; j < perView; j += 1) {
        page.push(doctors[(start + j) % doctors.length]);
      }
      chunks.push(page);
    }
    return chunks;
  }, [doctors, perView]);

  const prev = () => setIndex((p) => (p - 1 + pages.length) % pages.length);
  const next = () => setIndex((p) => (p + 1) % pages.length);

  if (!pages.length) return null;

  return (
    <div className="doctor-carousel">
      <div className="carousel-head">
        {pages.length > 1 ? (
          <div className="carousel-nav">
            <button type="button" className="carousel-btn" onClick={prev} aria-label="Previous doctors">
              {"<"}
            </button>
            <button type="button" className="carousel-btn" onClick={next} aria-label="Next doctors">
              {">"}
            </button>
          </div>
        ) : null}
      </div>

      <div className="carousel-grid" style={{ gridTemplateColumns: `repeat(${Math.max(1, perView)}, minmax(0, 1fr))` }}>
        {pages[index].map((doctor, idx) => (
          <div className="carousel-item" key={`${doctor.id}-${idx}`}>
            <DoctorCard doctor={doctor} />
          </div>
        ))}
      </div>

      {pages.length > 1 ? (
        <div className="carousel-dots">
          {pages.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`dot ${i === index ? "active" : ""}`}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default DoctorCarousel;
