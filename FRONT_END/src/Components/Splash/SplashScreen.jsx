import React, { use, useCallback } from 'react';
import './SplashScreen.css';
import bg from '../../assets/image1.jpg';
import { useNavigate } from 'react-router-dom';

export default function SplashScreen({ onDone }) {
  const navigate = useNavigate();

  const handleStart = useCallback(() => {
    sessionStorage.setItem("seenSplash", "1");

    onDone();
    navigate('/');  // Navigate to home or main page after splash
  }, [onDone, navigate]);

return (
  <div className="splash-root">
    <div className="splash-full" style={{ backgroundImage: `url(${bg})` }}>
      <img className="splash-image" src={bg} alt="Gift Box Splash" />
      <div className="splash-content">
        <h1 className="splash-title pill">
          HADARADHI GIFT SHOP (Pvt) Ltd
        </h1>
      </div>
      <button className="start-btn" onClick={handleStart}>START NOW</button>
    </div>
  </div>
);
}