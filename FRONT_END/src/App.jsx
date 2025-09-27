import "./App.css";
import { Routes, Route } from "react-router-dom";

import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";

import Home from "./Pages/Home/Home";
import Giftbox from "./Pages/Giftbox/Giftbox";
import Buildown from "./Pages/Buildown/Buildown";
import Shopitems from "./Pages/Shopitems/Shopitems";
import Cart from "./Pages/Cart/Cart";
import Profile from "./Pages/Profile/Profile";


export default function App() {
  return (
    
    <div>
      {/* Sticky header sits on top */}
      <Header />

      {/* Main content area */}
      <main>
        <div>
          {/* <aside className="sidebar">
            <Filters onChange={(s) => console.log("filters:", s)} />
          </aside> */}

          <section className="results">

              <Routes>
              
              
                <Route path="/" element={<Home/>} />
                <Route path="/giftbox" element={<Giftbox/>} />
                <Route path="/buildown" element={<Buildown />} />
                <Route path="/shopitems" element={<Shopitems />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<div>Not Found</div>} />
              
               
              </Routes>

          </section>
        </div>
      </main>

      {/* Footer spans full width */}
      <Footer />
    </div>

  );
}
