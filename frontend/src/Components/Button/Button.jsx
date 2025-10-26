import React from "react";
import './Button.css';

function Button({ type = "button", label, onClick }) {
  return (
    <button type={type} className="login-button" onClick={onClick}>
      {label}
    </button>
  );
}

export default Button;