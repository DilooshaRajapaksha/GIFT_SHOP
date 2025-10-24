import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrdersManagement.css';

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [updatingOrder, setUpdatingOrder] = useState(null);
    const [updatingPayment, setUpdatingPayment] = useState(null);
    const [orderStatus, setOrderStatus] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');

    const token = localStorage.getItem('token');

    const fetchOrders = async (paymentStatusFilter = null) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const url = paymentStatusFilter && paymentStatusFilter !== 'All' 
                ? `/api/orders?paymentStatus=${paymentStatusFilter}` 
                : '/api/orders';
            const response = await axios.get(`http://localhost:8082${url}`, config);
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(filterStatus);
    }, [filterStatus]);

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            const config = {
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                }
            };
            await axios.put(`http://localhost:8082/api/orders/${orderId}/status`, 
                { status: newStatus }, config);
            fetchOrders(filterStatus);
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handlePaymentUpdate = async (orderId, newPaymentStatus) => {
        try {
            const config = {
                headers: { 
                    Authorization: `Bearer ${token}` 
                }
            };
            await axios.put(`http://localhost:8082/api/orders/${orderId}/payment/status?status=${newPaymentStatus}`, {}, config);
            fetchOrders(filterStatus);
        } catch (error) {
            console.error('Error updating payment status:', error);
        }
    };

    const openModal = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    const orderStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    const paymentStatuses = ['PENDING', 'VERIFIED', 'FAILED', 'REFUNDED'];

    if (loading) return <div className="loading">Loading orders...</div>;

    const filteredOrders = filterStatus === 'All' ? orders : orders.filter(order => 
        order.payment?.paymentStatus === filterStatus
    );

    return (
        <div className="manage-orders">
            <div className="header">
                <h1>Manage Orders</h1>
                <p>Manage customer orders, view order details, update order status, and handle returns.</p>
            </div>

            <div className="filters">
                <label>Filter by Payment Status: </label>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="All">All</option>
                    {paymentStatuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
            </div>

            <table className="orders-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>User ID</th>
                        <th>Order Date</th>
                        <th>Total Price</th>
                        <th>Order Status</th>
                        <th>Payment Status</th>
                        <th>Delivery Address</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map(order => (
                        <tr key={order.orderId}>
                            <td>{order.orderId}</td>
                            <td>{order.userId}</td>
                            <td>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}</td>
                            <td>${order.totalPrice || 0}</td>
                            <td>{order.status || 'N/A'}</td>
                            <td>{order.payment?.paymentStatus || 'N/A'}</td>
                            <td>{order.deliveryAddress}, {order.deliveryCity} {order.deliveryPostalCode}</td>
                            <td>
                                <button onClick={() => openModal(order)}>View Details</button>
                                <select 
                                    value={order.status || ''} 
                                    onChange={(e) => {
                                        setUpdatingOrder(order.orderId);
                                        setOrderStatus(e.target.value);
                                    }}
                                    onBlur={() => {
                                        if (updatingOrder === order.orderId && orderStatus) {
                                            handleStatusUpdate(order.orderId, orderStatus);
                                            setUpdatingOrder(null);
                                            setOrderStatus('');
                                        }
                                    }}
                                >
                                    {orderStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                                </select>
                                <select 
                                    value={order.payment?.paymentStatus || ''} 
                                    onChange={(e) => {
                                        setUpdatingPayment(order.orderId);
                                        setPaymentStatus(e.target.value);
                                    }}
                                    onBlur={() => {
                                        if (updatingPayment === order.orderId && paymentStatus) {
                                            handlePaymentUpdate(order.orderId, paymentStatus);
                                            setUpdatingPayment(null);
                                            setPaymentStatus('');
                                        }
                                    }}
                                >
                                    {paymentStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && selectedOrder && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Order Details - ID: {selectedOrder.orderId}</h2>
                        <p><strong>User ID:</strong> {selectedOrder.userId}</p>
                        <p><strong>Date:</strong> {new Date(selectedOrder.orderDate).toLocaleString()}</p>
                        <p><strong>Total:</strong> ${selectedOrder.totalPrice}</p>
                        <p><strong>Status:</strong> {selectedOrder.status}</p>
                        <p><strong>Payment Status:</strong> {selectedOrder.payment?.paymentStatus}</p>
                        {selectedOrder.payment?.paymentSlipPath && (
                            <p><strong>Payment Slip:</strong> <a href={`http://localhost:8082${selectedOrder.payment.paymentSlipPath}`} target="_blank" rel="noopener noreferrer">View Slip</a></p>
                        )}
                        <p><strong>Address:</strong> {selectedOrder.deliveryAddress}, {selectedOrder.deliveryCity} {selectedOrder.deliveryPostalCode}</p>
                        <h3>Items:</h3>
                        <ul>
                            {selectedOrder.items?.map(item => (
                                <li key={item.orderItemId}>
                                    {item.name || 'N/A'} - Qty: {item.quantity} - Price: ${item.unitPrice}
                                </li>
                            )) || <li>No items</li>}
                        </ul>
                        <button onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageOrders;