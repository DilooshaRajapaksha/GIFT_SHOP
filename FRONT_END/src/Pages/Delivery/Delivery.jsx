import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutTabs from "../../components/Checkout/CheckoutTabs";
import "../../components/Checkout/Checkout.css";

export default function Delivery() {
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    postalCode: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.address || !formData.city || !formData.postalCode) {
      alert('Please fill all fields!');
      return;
    }
    localStorage.setItem('delivery', JSON.stringify(formData));
    navigate('/payment');
  };

  return (
    <div className="delivery-page">
      <CheckoutTabs />
      <div className="tab-content">
        <h1>Delivery Information</h1>
        <form className="delivery-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Address:</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              required
            />
          </div>
          <div className="form-group">
            <label>City:</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Postal Code:</label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-btn">SUBMIT</button>
        </form>
      </div>
    </div>
  );
}