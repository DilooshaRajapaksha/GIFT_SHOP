import React from 'react';
import { NavLink } from 'react-router-dom';
import './Checkout.css'; 

const CheckoutTabs = () => {
  const tabs = [
    { to: '/cart', label: 'Cart' },
    { to: '/delivery', label: 'Delivery' },
    { to: '/payment', label: 'Payment' }
  ];

  return (
    <nav className="tab-nav">
      {tabs.map((tab, index) => (
        <div key={tab.to} className="tab-wrapper">
          <NavLink
            to={tab.to}
            className={({ isActive }) => `tab-link ${isActive ? 'active' : ''}`}
          >
            {tab.label}
          </NavLink>
          {index < tabs.length - 1 && <span className="tab-separator"> | </span>}
        </div>
      ))}
    </nav>
  );
};

export default CheckoutTabs;