import React from "react";
import './Box.css';

function Box({ children }) {
  return (
    <div className="page-center">
      <div className="login">
        <form>
          {children}
        </form>
      </div>
    </div>
  );
}

export default Box;