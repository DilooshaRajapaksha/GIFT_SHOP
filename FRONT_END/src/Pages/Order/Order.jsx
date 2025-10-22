import React, { useState, useEffect } from 'react';
import './Order.css';

const Order = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);
  const API_BASE = 'http://localhost:8082/api/orders';

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/user/${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Fetched orders:', data); 
        setOrders(data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userId]);

  const tabs = [
    { key: 'All', label: 'All' },
    { key: 'To Pay', label: 'To Pay' },
    { key: 'To Ship', label: 'To Ship' },
    { key: 'To Receive', label: 'To Receive' },
    { key: 'Delivered', label: 'Delivered' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#ff9800';
      case 'Processing': return '#2196f3';
      case 'Shipped': return '#4caf50';
      case 'Delivered': return '#4caf50';
      case 'Cancelled': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).replace(',', '') : 'N/A';
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'All') return true;
    if (activeTab === 'To Pay') return order.status === 'Pending';
    if (activeTab === 'To Ship') return order.status === 'Processing';
    if (activeTab === 'To Receive') return order.status === 'Shipped';
    if (activeTab === 'Delivered') return order.status === 'Delivered';
    return false;
  });

  const handleRefreshTracking = (orderId) => {
    console.log(`Refreshing tracking for order ${orderId}`);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="orders-container">
      <h1 className="orders-title">My Orders</h1>
      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="orders-list">
        {filteredOrders.length === 0 ? (
          <p className="no-orders">No orders found.</p>
        ) : (
          filteredOrders.map(order => (
            <div key={order.orderId} className="order-card">
              <div className="order-header">
                <div className="order-id">Order ID: #{order.orderId || 'N/A'}</div>
                <div className="order-date">{formatDate(order.orderDate)}</div>
              </div>
              <div className="order-details">
                <div className="detail-row">
                  <label>Tracking:</label>
                  <span>-</span>
                </div>
                <div className="detail-row">
                  <label>Delivery:</label>
                  <span>{order.status || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <label>Status:</label>
                  <span className="status" style={{ color: getStatusColor(order.status) }}>
                    {order.status || 'Unknown'}
                  </span>
                </div>
                <div className="detail-row">
                  <label>Total price:</label>
                  <span className="price">Rs. {(order.totalPrice || 0)?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
              <div className="items-section">
                <label>Items:</label>
                <ul className="items-list">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <li key={index} className="item-row">
                        <span>{item.name || 'Unknown'} x {item.quantity || 0}</span>
                        <span>Rs. {(item.unitPrice || 0)?.toFixed(2) || '0.00'}</span>
                      </li>
                    ))
                  ) : (
                    <li className="item-row">No items details available</li>
                  )}
                </ul>
              </div>
              <div className="order-actions">
                <button
                  className="refresh-btn"
                  onClick={() => handleRefreshTracking(order.orderId)}
                >
                  Refresh tracking
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Order;