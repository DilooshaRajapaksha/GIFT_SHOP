// src/Service/api.js
import axios from "axios";

// ONE place to change base URL
export const API_BASE = import.meta.env.VITE_API || "http://localhost:9000";

// ------- PRODUCTS (shop + giftbox pages) -------
export const productApi = {
  // /api/products?type=single&visible=public&search=&categoryId=&min=&max=
  list: (params) => 
    axios.get(`${API_BASE}/api/v1/products`, { params }),
  categories: () => 
    axios.get(`${API_BASE}/api/v1/categories`),
  byId: (id) => 
    axios.get(`${API_BASE}/api/v1/products/${id}`), // if you later add detail endpoint
  myGiftboxes: () => 
    axios.get(`${API_BASE}/api/v1/products/mine/giftboxes`),

  // NEW: create a giftbox on the backend
  // payload example: { items: [{ productId: "...", quantity: 2 }, ...], name?: "My Box", notes?: "..." }
  createGiftbox: (payload) =>
    axios.post(`${API_BASE}/api/v1/giftboxes/save`, payload),
};

// ------- BUILD YOUR OWN (singles with paging/search) -------
export const builderApi = {
  // /api/v1/builder/catalog?query=&category=&page=0&size=12
  catalog: (params) =>
    axios.get(`${API_BASE}/api/v1/builder/catalog`, { params }),
};

// ------- CART (your CartController) -------
export const cartApi = {
  create: () => 
    axios.post(`${API_BASE}/api/v1/cart/create`),
  get: () => 
    axios.get(`${API_BASE}/api/v1/cart`),
  add: (productId, quantity = 1) =>
    axios.post(`${API_BASE}/api/v1/cart/items`, { productId, quantity }),
  setQty: (productId, quantity) =>
    axios.put(`${API_BASE}/api/v1/cart/items`, { productId, quantity }),
  remove: (productId) =>
    axios.delete(`${API_BASE}/api/v1/cart/items/${productId}`),
  clear: () => 
    axios.delete(`${API_BASE}/api/v1/cart/clear`),
};
