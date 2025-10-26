import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-wrap">
        <div className="f-grid">
          {/* About */}
          <section className="f-col">
            <h4>About</h4>
            <p>
              Curated gift boxes for every occasion and person.
            </p>
          </section>

          {/* Shop */}
          <section className="f-col">
            <h4>Shop</h4>
            <ul>
              <li><Link to="/giftbox">Gift Boxes</Link></li>
              <li><Link to="/buildown">Build Your Own</Link></li>
              <li><Link to="/sale">Sale</Link></li>
            </ul>
          </section>

          {/* Support */}
          <section className="f-col">
            <h4>Support</h4>
            <ul>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/shipping">Shipping</Link></li>
            </ul>
          </section>

          {/* Follow */}
          <section className="f-col">
            <h4>Follow</h4>
            <ul className="f-social">
              <li>
                <a href="https://instagram.com" target="_blank" rel="noreferrer">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H7zm5 2.75a5.75 5.75 0 110 11.5 5.75 5.75 0 010-11.5zm0 2a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zM18.25 6a.75.75 0 110 1.5.75.75 0 010-1.5z"/></svg>
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://facebook.com" target="_blank" rel="noreferrer">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 3h4v3h-4v3h4v3h-4v9h-3v-9H8V9h2V6.5A3.5 3.5 0 0113 3z"/></svg>
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://pinterest.com" target="_blank" rel="noreferrer">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2C7.61 2 5 4.96 5 8.32c0 1.54.86 3.46 2.23 4.07.21.09.32.05.37-.15.04-.16.24-.94.33-1.3.03-.11 0-.21-.08-.31-.45-.54-.81-1.53-.81-2.45 0-2.36 1.78-4.65 4.83-4.65 2.63 0 4.47 1.7 4.47 4.15 0 2.89-1.28 5.33-3.19 5.33-.95 0-1.66-.78-1.43-1.74.27-1.12.79-2.33.79-3.14 0-.72-.39-1.32-1.2-1.32-.95 0-1.7.98-1.7 2.31 0 .84.28 1.41.28 1.41s-.95 4.01-1.12 4.72c-.33 1.39-.05 3.09-.03 3.26.02.11.16.15.24.06.13-.18 1.75-2.28 2.3-4.38.16-.62.91-3.53.91-3.53.45.86 1.77 1.62 3.17 1.62 2.09 0 3.62-1.98 3.62-4.82C18.99 4.93 16.64 2 12.04 2z"/></svg>
                  Pinterest
                </a>
              </li>
            </ul>
          </section>
        </div>

        <hr className="f-divider" />

        <div className="f-copy">© {year} Giftcraft. All rights reserved.</div>
      </div>
    </footer>
  );
}
