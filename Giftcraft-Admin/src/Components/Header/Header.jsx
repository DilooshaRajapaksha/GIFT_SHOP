import { NavLink } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <nav className="top-tabs">
      <ul className="tabs">
        <li>
          <NavLink
            to="/items"
            className={({ isActive }) => "tab-link" + (isActive ? " active" : "")}
          >
            Items Management
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/giftboxes/create"
            className={({ isActive }) => "tab-link" + (isActive ? " active" : "")}
          >
            Create Giftbox
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/giftboxes/manage"
            className={({ isActive }) => "tab-link" + (isActive ? " active" : "")}
          >
            Manage Giftboxes
          </NavLink>
        </li>
         <li>
          <NavLink
            to="/orders"
            className={({ isActive }) => "tab-link" + (isActive ? " active" : "")}
          >
            Manage Orders
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
