// src/lib/api.js
export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function api(path, { method = "GET", params, body, headers } = {}) {
  const url = new URL(API_BASE + path);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
    });
  }
  const res = await fetch(url.toString(), {
    method,
    headers: { "Content-Type": "application/json", ...authHeaders(), ...(headers || {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let msg = text;
    try { msg = JSON.parse(text).message || text; } catch {}
    throw new Error(`HTTP ${res.status}: ${msg || res.statusText}`);
  }
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

export const Products = {
  list: (q) => api("/api/products", { params: q }),
  get: (id) => api(`/api/products/${id}`),
  create: (data) => api("/api/products", { method: "POST", body: data }),
  update: (id, data) => api(`/api/products/${id}`, { method: "PUT", body: data }),
  remove: (id) => api(`/api/products/${id}`, { method: "DELETE" }),
  lowStock: (t = 5, params = {}) => api("/api/products/low-stock", { params: { threshold: t, ...params } }),
  adjustStock: (id, delta, t = 5) => api(`/api/products/${id}/stock`, { method: "PATCH", params: { threshold: t }, body: { delta } }),
};

export const Categories = { list: () => api("/api/categories") };
export const Reviews   = { forProduct: (id) => api(`/api/reviews/product/${id}`) };
