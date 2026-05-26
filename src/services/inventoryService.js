// src/services/inventoryService.js
import api from './api'

// ── Products ──────────────────────────────────────────────────────────────
export const productService = {
  getAll:   (params) => api.get('/products', { params }),
  getById:  (id)     => api.get(`/products/${id}`),
  create:   (data)   => api.post('/products', data),
  update:   (id, data) => api.put(`/products/${id}`, data),
  delete:   (id)     => api.delete(`/products/${id}`),
}

// ── Categories ────────────────────────────────────────────────────────────
export const categoryService = {
  getAll:   (params) => api.get('/categories', { params }),
  getById:  (id)     => api.get(`/categories/${id}`),
  create:   (data)   => api.post('/categories', data),
  update:   (id, data) => api.put(`/categories/${id}`, data),
  delete:   (id)     => api.delete(`/categories/${id}`),
}