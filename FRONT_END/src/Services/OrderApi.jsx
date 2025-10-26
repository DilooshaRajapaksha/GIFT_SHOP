import api from './api';
const API_BASE = 'http://localhost:8082/api/orders';

export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const createOrderFromCart = async (orderData) => {
  try {
    const response = await api.post('/create-from-cart', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order from cart:', error);
    throw error;
  }
};

export const getOrders = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const getUserOrders = async (userId) => {
  try {
    const response = await api.get(`/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

export const getOrder = async (orderId) => {
  try {
    const response = await api.get(`/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

export const updateStatus = async (orderId, status) => {
  try {
    const response = await api.put(`/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating status for order ${orderId}:`, error);
    throw error;
  }
};

export const addItemToOrder = async (orderId, itemData) => {
  try {
    const response = await api.post(`/${orderId}/items`, itemData);
    return response.data;
  } catch (error) {
    console.error('Error adding item to order:', error);
    throw error;
  }
};

export const payOrder = async (orderId, amount, slipFile) => {
  if (!slipFile) {
    throw new Error('Payment slip required!');
  }

  const formData = new FormData();
  formData.append('slip', slipFile);
  formData.append('amount', amount);
  formData.append('orderId', orderId);

  try {
    const response = await fetch(`${API_BASE}/pay`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Payment failed`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error processing payment:', error);
    throw error;
  }
};