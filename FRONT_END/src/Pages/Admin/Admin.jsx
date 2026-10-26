import { useState } from "react";
import { Link } from "react-router-dom";
import { adminApi, getAdminToken, adminLogout, getErrorMessage, SHOP_NAME } from "../../Service/api";
import AdminProducts from "./AdminProducts";
import AdminHome from "./AdminHome";
import AdminOrders from "./AdminOrders";
import AdminVehicles from "./AdminVehicles";
import "./Admin.css";

const TABS = [
  { key: "orders", label: "Orders" },
  { key: "products", label: "Products" },
  { key: "home", label: "Home page" },
  { key: "vehicle", label: "Vehicle Surprise" },
];

// /admin - not shown in the menu. Protected by one password (ADMIN_PASSWORD in the backend .env)
export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(() => getAdminToken() !== "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const [tab, setTab] = useState("orders");

  const handleLogin = async (e) => {
    e.preventDefault();
    setChecking(true);
    setError("");
    try {
      await adminApi.login(password);   // saves the token (until the tab is closed or 8 hours)
      setLoggedIn(true);
      setPassword("");
    } catch (err) {
      setError(getErrorMessage(err));   // "Wrong password" or "Too many wrong passwords..."
    } finally {
      setChecking(false);
    }
  };

  const logout = () => {
    adminLogout();
    setLoggedIn(false);
  };

  // token expired (after 8 hours) or the server restarted -> back to the login box
  const onAuthError = () => {
    logout();
    setError("Your session ended. Please log in again.");
  };

  if (!loggedIn) {
    return (
      <div className="admin-login">
        <form className="admin-card" onSubmit={handleLogin}>
          <h1>{SHOP_NAME} admin</h1>
          <label>
            Admin password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
          </label>
          {error && <div className="msg msg-error">{error}</div>}
          <button className="admin-btn" disabled={checking || !password}>
            {checking ? "Checking..." : "Log in"}
          </button>
          <Link to="/" className="admin-link">Back to the shop</Link>
        </form>
      </div>
    );
  }

  return (
    <div className="admin">
      <header className="admin-top">
        <strong>{SHOP_NAME} admin</strong>
        <nav className="admin-tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={tab === t.key ? "active" : ""}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <div className="admin-top-right">
          <Link to="/" target="_blank" className="admin-link">Open the shop</Link>
          <button className="admin-btn-light" onClick={logout}>Log out</button>
        </div>
      </header>

      <div className="admin-body">
        {tab === "orders" && <AdminOrders onAuthError={onAuthError} />}
        {tab === "products" && <AdminProducts onAuthError={onAuthError} />}
        {tab === "home" && <AdminHome onAuthError={onAuthError} />}
        {tab === "vehicle" && <AdminVehicles onAuthError={onAuthError} />}
      </div>
    </div>
  );
}
