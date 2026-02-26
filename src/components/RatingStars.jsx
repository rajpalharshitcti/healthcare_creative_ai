import React from "react";

const RatingStars = ({ rating = 0 }) => {
  const stars = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
  return <span aria-label={`Rating ${stars} out of 5`}>{"*".repeat(stars)}{".".repeat(5 - stars)}</span>;
};

export default RatingStars;
