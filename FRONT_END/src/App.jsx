import "./App.css";
import { Routes, Route, Link, useLocation } from "react-router-dom";

import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";

import Home from "./Pages/Home/Home";
import Giftbox from "./Pages/Giftbox/Giftbox";
import Buildown from "./Pages/Buildown/Buildown";
import Shopitems from "./Pages/Shopitems/Shopitems";
import Cart from "./Pages/Cart/Cart";
import Admin from "./Pages/Admin/Admin";
import VehicleSurprise from "./Pages/VehicleSurprise/VehicleSurprise";

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <div>
      {/* admin page has its own simple layout */}
      {!isAdmin && <Header />}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/giftbox" element={<Giftbox />} />
          <Route path="/buildown" element={<Buildown />} />
          <Route path="/shopitems" element={<Shopitems />} />
          <Route path="/vehicle-surprise" element={<VehicleSurprise />} />
          <Route path="/cart" element={<Cart />} />
          {/* not in the menu - the shop owner opens /admin directly */}
          <Route path="/admin" element={<Admin />} />
          <Route
            path="*"
            element={
              <div className="not-found">
                <h2>Page not found</h2>
                <Link to="/">Go back home</Link>
              </div>
            }
          />
        </Routes>
      </main>

      {!isAdmin && <Footer />}
    </div>
  );
}
