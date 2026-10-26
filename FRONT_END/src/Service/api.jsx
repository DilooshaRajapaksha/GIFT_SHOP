// src/Service/api.jsx
// All the backend calls are kept in this one file so we only change the URL in one place.
import axios from "axios";

// backend runs on port 8082 (see application.properties)
// you can override this with VITE_API in the .env file
export const API_BASE = import.meta.env.VITE_API || "http://localhost:8082";

// ------- SHOP DETAILS (change here if the number changes) -------
export const SHOP_NAME = "Pearl Gifts";
// WhatsApp number in international format, no + or spaces (076 292 9032 -> 94762929032)
export const WHATSAPP_NUMBER = "94762929032";
export const WHATSAPP_DISPLAY = "076 292 9032";

// Images uploaded in the admin panel are saved on the backend and the database
// stores a link like "/images/123_abc.jpg". The browser needs the full address,
// so we add the backend URL in front. Links that already start with http are left as they are.
export const imageSrc = (url) => {
  if (!url) return "";
  if (url.startsWith("/images/")) return `${API_BASE}${url}`;
  return url;
};

// ------- HOME PAGE (slides, categories, banners, best sellers) -------
export const homeApi = {
  get: () => axios.get(`${API_BASE}/api/v1/home`),
};

// ------- PRODUCTS (shop items + gift box pages) -------
export const productApi = {
  // GET /api/v1/products?type=single&visible=public&min=&max=&search=
  list: (params) =>
    axios.get(`${API_BASE}/api/v1/products`, { params }),

  giftboxById: (id) =>
    axios.get(`${API_BASE}/api/v1/giftboxes/${id}`),

  // Build Your Own: payload = { name: "My Box", items: [{ productId: 1, quantity: 2 }] }
  createGiftbox: (payload) =>
    axios.post(`${API_BASE}/api/v1/giftboxes/save`, payload),
};

// ------- BUILD YOUR OWN (singles with paging/search) -------
export const builderApi = {
  // /api/v1/builder/catalog?query=&category=&page=0&size=12
  catalog: (params) =>
    axios.get(`${API_BASE}/api/v1/builder/catalog`, { params }),
};

// ------- VEHICLE SURPRISE packages -------
export const vehicleApi = {
  list: () => axios.get(`${API_BASE}/api/v1/vehicle-packages`),
};

// ------- ORDERS (WhatsApp checkout) -------
export const orderApi = {
  // body: { customerName, customerPhone, deliveryAddress, deliveryCity, note, items: [{productId, quantity}] }
  place: (body) =>
    axios.post(`${API_BASE}/api/orders/place`, body),
};

// ------- ADMIN -------
// The password is sent only once, to /login. The backend answers with a token that
// works for 8 hours, and every admin request sends that token instead of the password.
const TOKEN_KEY = "pearlAdminToken";

export const getAdminToken = () => {
  try {
    const saved = JSON.parse(sessionStorage.getItem(TOKEN_KEY));
    if (saved && saved.expiresAt > Date.now()) return saved.token;
  } catch {
    // ignore
  }
  return "";
};

const saveAdminToken = (token, expiresAt) => {
  try {
    if (token) sessionStorage.setItem(TOKEN_KEY, JSON.stringify({ token, expiresAt }));
    else sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    // private mode etc. - admin will just have to log in again
  }
};

export const adminLogout = () => saveAdminToken("");

const auth = () => ({ headers: { Authorization: `Bearer ${getAdminToken()}` } });

export const adminApi = {
  login: async (password) => {
    const res = await axios.post(`${API_BASE}/api/v1/admin/login`, { password });
    saveAdminToken(res.data.token, res.data.expiresAt);
    return res;
  },

  // upload one image file -> { url: "/images/..." }
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return axios.post(`${API_BASE}/api/v1/admin/images`, formData, auth());
  },

  products: () => axios.get(`${API_BASE}/api/v1/admin/products`, auth()),
  createProduct: (data) => axios.post(`${API_BASE}/api/v1/admin/products`, data, auth()),
  updateProduct: (id, data) => axios.put(`${API_BASE}/api/v1/admin/products/${id}`, data, auth()),
  deleteProduct: (id) => axios.delete(`${API_BASE}/api/v1/admin/products/${id}`, auth()),

  homeItems: () => axios.get(`${API_BASE}/api/v1/admin/home-items`, auth()),
  createHomeItem: (data) => axios.post(`${API_BASE}/api/v1/admin/home-items`, data, auth()),
  updateHomeItem: (id, data) => axios.put(`${API_BASE}/api/v1/admin/home-items/${id}`, data, auth()),
  deleteHomeItem: (id) => axios.delete(`${API_BASE}/api/v1/admin/home-items/${id}`, auth()),

  vehiclePackages: () => axios.get(`${API_BASE}/api/v1/admin/vehicle-packages`, auth()),
  createVehiclePackage: (data) => axios.post(`${API_BASE}/api/v1/admin/vehicle-packages`, data, auth()),
  updateVehiclePackage: (id, data) => axios.put(`${API_BASE}/api/v1/admin/vehicle-packages/${id}`, data, auth()),
  deleteVehiclePackage: (id) => axios.delete(`${API_BASE}/api/v1/admin/vehicle-packages/${id}`, auth()),

  orders: () => axios.get(`${API_BASE}/api/v1/admin/orders`, auth()),
  updateOrderStatus: (id, status) =>
    axios.put(`${API_BASE}/api/v1/admin/orders/${id}/status`, { status }, auth()),
  deleteOrder: (id) => axios.delete(`${API_BASE}/api/v1/admin/orders/${id}`, auth()),
};

// small helper so every page shows the backend error message the same way
export const getErrorMessage = (err) => {
  if (!err.response) return "Cannot reach the server. Is the backend running?";
  const body = err.response.data;
  return body?.message || `Request failed (${err.response.status})`;
};
