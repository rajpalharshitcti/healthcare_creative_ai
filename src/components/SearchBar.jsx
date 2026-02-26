import React from "react";

const SearchBar = ({ value, onChange, placeholder = "Search..." }) => (
  <input
    type="search"
    className="search-input"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
  />
);

export default SearchBar;
