// src/Components/Header/Header.jsx
import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useCart } from "../../Context/cartContext";
import { SHOP_NAME } from "../../Service/api";
import logo from "../../assets/logo.jpg";
import "./Header.css";

export default function Header() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { count } = useCart();

  // send the search text to the Shop Items page as ?search=...
  const handleSearch = (e) => {
    e.preventDefault();
    const text = search.trim();
    navigate(text ? `/shopitems?search=${encodeURIComponent(text)}` : "/shopitems");
  };

  return (
    <header className="topbar">
      <div className="bar">
        <Link to="/" className="brand" aria-label={`${SHOP_NAME} home`}>
          <img src={logo} alt="" className="brand-logo" />
          <span>{SHOP_NAME}</span>
        </Link>

        <nav className="nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>Home</NavLink>
          <NavLink to="/giftbox" className={({ isActive }) => (isActive ? "active" : "")}>Gift boxes</NavLink>
          <NavLink to="/shopitems" className={({ isActive }) => (isActive ? "active" : "")}>Shop items</NavLink>
          <NavLink to="/buildown" className={({ isActive }) => (isActive ? "active" : "")}>Build your own</NavLink>
          <NavLink to="/vehicle-surprise" className={({ isActive }) => (isActive ? "active" : "")}>Vehicle Surprise</NavLink>
        </nav>

        <form className="search" role="search" onSubmit={handleSearch}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15.5 14h-.79l-.28-.27a6 6 0 10-.7.7l.27.28v.79L20 21.5 21.5 20 15.5 14zM10 15a5 5 0 110-10 5 5 0 010 10z" />
          </svg>
          <input
            placeholder="Search gifts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        {/* only the cart icon now - sign in / profile was removed */}
        <div className="icons">
          <NavLink to="/cart" aria-label="Cart" className="icon-btn cart-icon">
            <svg viewBox="0 0 24 24">
              <path d="M7 18a2 2 0 11-.001 3.999A2 2 0 017 18zm10 0a2 2 0 11-.001 3.999A2 2 0 0117 18zM6.2 6l.8 2h10.6l-1.4 7H8.4l-2.2-9H3V4h3.2z" />
            </svg>
            {count > 0 && <span className="cart-badge">{count}</span>}
          </NavLink>
        </div>
      </div>
    </header>
  );
}
