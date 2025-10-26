import axios from 'axios';

const API_BASE = 'http://localhost:8082/api/orders';

export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options
  };
  const response = await fetch(url, config);
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  return response.json();
};
export default api;