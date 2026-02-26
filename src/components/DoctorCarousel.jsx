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
      setPerView(cardsPerViewByWidth());
      setIndex(0);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const pages = useMemo(() => {
    if (!doctors.length) return [];
    const chunks = [];
    for (let i = 0; i < doctors.length; i += perView) {
      chunks.push(doctors.slice(i, i + perView));
    }
    return chunks;
  }, [doctors, perView]);

  const prev = () => setIndex((p) => (p - 1 + pages.length) % pages.length);
  const next = () => setIndex((p) => (p + 1) % pages.length);

  if (!pages.length) return null;

  return (
    <div className="doctor-carousel">
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

      <div className="carousel-viewport">
        <div className="carousel-track" style={{ transform: `translateX(-${index * 100}%)` }}>
          {pages.map((page, pageIndex) => (
            <div className="carousel-slide" key={pageIndex} style={{ gridTemplateColumns: `repeat(${Math.max(1, perView)}, minmax(0, 1fr))` }}>
              {page.map((doctor) => (
                <div className="carousel-item" key={doctor.id}>
                  <DoctorCard doctor={doctor} />
                </div>
              ))}
            </div>
          ))}
        </div>
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
