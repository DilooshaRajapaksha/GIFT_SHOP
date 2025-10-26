import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashScreen from './Components/Splash/SplashScreen';
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
import Profile from './Pages/ProfilePage/ProfilePage';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem("seenSplash")) {
      setShowSplash(false);
    }
  }, []);

  const handleDone = useCallback(() => setShowSplash(false), []);
  const getCurrentUserId = () => localStorage.getItem('userId') || sessionStorage.getItem('userId');

  return (
    <Router>
      {showSplash && <SplashScreen onDone={handleDone} />}
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
            <Route path="/admin/*" element={<AdminPage />} />
            <Route path="/profile/update" element={<ProfileUpdate />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;