
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import Products from './Pages/Products/products.jsx';

function GiftBoxes() { return <Products />; }
function ShopItems() { return <Products />; }
function BuildOwn() { return <div style={{ padding: 24 }}>Build Your Own – coming soon</div>; }
function Home() { return <Products />; }

export default function App() {
  return (
    <Router>
      <Header />
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/giftbox" element={<GiftBoxes />} />
          <Route path="/shopitems" element={<ShopItems />} />
          <Route path="/buildown" element={<BuildOwn />} />
          {/* optional alias */}
          <Route path="/products" element={<Products />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}
