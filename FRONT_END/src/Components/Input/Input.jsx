import React from "react";
import './Input.css';

function Input({ type, id, placeholder, value, onChange, label }) {
  return (
    <div className="input-wrapper">
      {label && <label htmlFor={id} className="input-label">{label}</label>}
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        className="input-field"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default Input;