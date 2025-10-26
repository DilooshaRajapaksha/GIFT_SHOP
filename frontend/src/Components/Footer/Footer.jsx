import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <nav className="footer-links">
          <a href="#">Discover</a>
          <a href="#">Shop</a>
        </nav>

        <div className="footer-social">
          <a href="#" aria-label="Facebook" className="icon">
            <svg viewBox="0 0 24 24"><path d="M13 3h4v3h-4v3h4v3h-4v9h-3v-9H8V9h2V6.5A3.5 3.5 0 0 1 13 3z"/></svg>
          </a>
          <a href="#" aria-label="Instagram" className="icon">
            <svg viewBox="0 0 24 24"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a5.5 5.5 0 1 1 0 11.001A5.5 5.5 0 0 1 12 7.5zm0 2a3.5 3.5 0 1 0 0 7.001A3.5 3.5 0 0 0 12 9.5zm5.25-3a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5z"/></svg>
          </a>
        </div>
      </div>
    </footer>
  );
}