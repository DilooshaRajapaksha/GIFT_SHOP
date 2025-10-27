import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082';
const isMock = false;

export const authHeaders = () => {
  const token = localStorage.getItem('jwt');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  Object.assign(config.headers, authHeaders());
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 ) {
      ['jwt', 'role', 'userId'].forEach(key => localStorage.removeItem(key));
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

const mockResponse = async (endpoint) => {
  await new Promise(r => setTimeout(r, 500));
  if (endpoint.includes('/orders')) return { data: { content: [{ orderId: 1, userId: '1', orderDate: '2025-10-26', totalPrice: 2300, status: 'PENDING', paymentStatus: 'UNPAID', deliveryAddress: 'Test St' }] } };
  if (endpoint.includes('/products')) return { data: { content: [{ id: 1, name: 'Test Product', price: 100, stock: 10 }] } };
  throw new Error('Mock not ready');
};

const apiCall = async (endpoint, options = {}) => {
  const { method = 'GET', data = {} } = options;
  if (isMock) return mockResponse(endpoint);
  try {
    return await api({ method, url: endpoint, data });
  } catch (err) {
    console.error('API Error:', err);
    throw err;
  }
};

export const Products = {
  list: async (q = {}) => {
    try {
      const params = new URLSearchParams(q);
      const res = await api.get(`/api/products?${params.toString()}`);
      return res;
    } catch (err) {
      console.error('Products API Error:', err);
      return { data: { content: [], totalPages: 0 } };
    }
  },
};

export const authApi = {
  login: async (creds) => {
    const res = await apiCall('/login', { method: 'POST', data: creds });
    if (res.data?.token) {
      localStorage.setItem('jwt', res.data.token);
      localStorage.setItem('role', res.data.role || 'USER');
      localStorage.setItem('userId', res.data.userId || '1');
    }
    return res;
  },
};

export default apiCall;