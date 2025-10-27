import { NavLink, Link } from "react-router-dom";
import "../styles/header.css";

export default function Header() {
  return (
    <header className="topbar">
      <div className="bar">
        {/* Brand (left) */}
        <Link to="/" className="brand" aria-label="GiftCraft Home">
          GiftCraft
        </Link>

        {/* Primary nav (left, before search) */}
        <nav className="nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>Home</NavLink>
          <NavLink to="/giftbox" className={({ isActive }) => (isActive ? "active" : "")}>Gift Boxes</NavLink>
          <NavLink to="/shopitems" className={({ isActive }) => (isActive ? "active" : "")}>Shop Items</NavLink>
          <NavLink to="/buildown" className={({ isActive }) => (isActive ? "active" : "")}>Build Your Own</NavLink>
        </nav>

        {/* Search (stays on the right) */}
        <form className="search" role="search" onSubmit={(e) => e.preventDefault()}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15.5 14h-.79l-.28-.27a6 6 0 10-.7.7l.27.28v.79L20 21.5 21.5 20 15.5 14zM10 15a5 5 0 110-10 5 5 0 010 10z" />
          </svg>
          <input placeholder="Search gifts..." />
        </form>

        {/* Icons (unchanged, keep at far right) */}
        <div className="icons">
          <NavLink to="/cart" aria-label="Cart" className="icon-btn">
            <svg viewBox="0 0 24 24">
              <path d="M7 18a2 2 0 11-.001 3.999A2 2 0 017 18zm10 0a2 2 0 11-.001 3.999A2 2 0 0117 18zM6.2 6l.8 2h10.6l-1.4 7H8.4l-2.2-9H3V4h3.2z" />
            </svg>
          </NavLink>

          <NavLink to="/profile" aria-label="Profile" className="icon-btn">
            <svg viewBox="0 0 24 24">
              <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-5 0-9 2.5-9 5.5V22h18v-2.5C21 16.5 17 14 12 14z" />
            </svg>
          </NavLink>
        </div>
      </div>
    </header>
  );
}
