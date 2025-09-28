import React, { useState } from 'react';
import './Dilivery.css';
import { Link } from 'react-router-dom';

export default function Dilivery() {
  // Store form input values in state
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Customer Address:", formData); // Later send this to backend
    alert("Address submitted successfully!");
  };

  return (
    <div className="delivery-page">
      <nav>
        <ul className="nav-links">
          <Link to="/"></Link>
          <Link to="/cart"></Link>
          <Link to="/dilivery"></Link>
        </ul>
      </nav>

      <h1>Delivery Information</h1>

      <form className="delivery-form" onSubmit={handleSubmit}>
        <label>
          Full Name:
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Address:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          City:
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Postal Code:
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Country:
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit">Submit Address</button>
      </form>
    </div>
  );
}
