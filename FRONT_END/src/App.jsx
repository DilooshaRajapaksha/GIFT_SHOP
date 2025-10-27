// Fixed App.jsx
// Key changes:
// - Renamed AppContent to App for direct export.
// - Wrapped <App /> in <Router> at the root (useLocation requires Router context).
// - Removed unused imports (useEffect, useCallback, SplashScreen) and unused showSplash state.
// - Fixed duplicate Footer import issue (assuming it's resolved by keeping one).
// - Ensured consistent paths/casing.

import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Cart from './Pages/Cart/Cart';
import Delivery from './Pages/Delivery/Delivery';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import Payment from './Pages/Payment/Payment';
import Order from './Pages/Order/Order';
import LoginPage from './Pages/LoginPage/LoginPage';
import RegisterPage from './Pages/RegisterPage/RegisterPage';
import ForgotPage from './Pages/ForgotPage/ForgotPage';
import ProfileUpdate from './Pages/ProfileUpdate/ProfileUpdate';
import UserPage from './Pages/UserPage/UserPage';
import AdminPage from './AdminPage.jsx';
import Home from './Pages/Home/Home';
import Giftbox from './Pages/Giftbox/Giftbox';
import Shopitems from './Pages/Shopitems/Shopitems';
import Buildown from './Pages/Buildown/Buildown';
import ProductDetails from './Pages/Shopitems/ProductDetails';
import Profile from './Pages/ProfilePage/ProfilePage';

function App() {
  const location = useLocation();  

  const getCurrentUserId = () => localStorage.getItem('userId') || sessionStorage.getItem('userId');

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && (  
        <div className="layout-wrapper">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/giftbox" element={<Giftbox />} />
              <Route path="/shopitems" element={<Shopitems />} />
              <Route path="/buildown" element={<Buildown />} />
              <Route path="/Order" element={<Order userId={getCurrentUserId()} />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/delivery" element={<Delivery />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/UserPage" element={<UserPage />} />
              <Route path="/profile/update" element={<ProfileUpdate />} />
              <Route path="/product/:id" element={<ProductDetails />} />
            </Routes>
          </main>
          <Footer />
        </div>
      )}
      {isAdminRoute && (  
        <Routes>
          <Route path="/admin/*" element={<AdminPage />} />
        </Routes>
      )}
    </>
  );
}


function Root() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default Root;