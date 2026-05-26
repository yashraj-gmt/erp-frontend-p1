// src/constants/routes.js
export const ROUTES = {
  // ── Auth ────────────────────────────────────────────────────────────────────
  LOGIN:        '/login',

  // ── Core ────────────────────────────────────────────────────────────────────
  DASHBOARD:    '/dashboard',
  PROFILE:      '/profile',
  UNAUTHORIZED: '/unauthorized',

  // ── Roles & Permissions ───────────────────────────────────────────────────
  ROLES:        '/roles',

  // ── Inventory — Phase 1 ───────────────────────────────────────────────────
  PRODUCTS:        '/inventory/products',
  PRODUCT_ADD:     '/inventory/products/add',
  PRODUCT_EDIT:    '/inventory/products/:id/edit',
  PRODUCT_DETAIL:  '/inventory/products/:id',
  CATEGORIES:      '/inventory/categories',
  CATEGORY_ADD:    '/inventory/categories/add',
  CATEGORY_EDIT:   '/inventory/categories/:id/edit',

  // ── Phase 2 (reserved, not wired yet) ─────────────────────────────────────
  // CUSTOMERS: '/customers',

  // ── Phase 3 (reserved) ────────────────────────────────────────────────────
  // ORDERS: '/orders',
}