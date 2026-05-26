// src/pages/inventory/products/ProductList.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import demo1 from "../../../assets/images/demo-1.jpg";
import demo2 from "../../../assets/images/demo-2.jpg";
import demo3 from "../../../assets/images/demo-3.jpg";
import demo4 from "../../../assets/images/demo-4.jpg";
import demo5 from "../../../assets/images/demo-5.jpg";
import demo6 from "../../../assets/images/demo-6.jpg";
import demo7 from "../../../assets/images/demo-7.jpg";
import demo8 from "../../../assets/images/demo-8.jpg";

const DEMO_IMGS = [demo1, demo2, demo3, demo4, demo5, demo6, demo7, demo8];

const MOCK_PRODUCTS = [
  { id: 1,  sku: "PRD-0001", name: "Wireless Headphones Pro",      category: "Electronics",   price: 4999,  costPrice: 3200, stock: 142, stockAlert: 20, isActive: true,  img: DEMO_IMGS[0] },
  { id: 2,  sku: "PRD-0002", name: "Running Shoes X200",           category: "Sports",        price: 2499,  costPrice: 1400, stock: 8,   stockAlert: 15, isActive: true,  img: DEMO_IMGS[1] },
  { id: 3,  sku: "PRD-0003", name: "Cotton Polo Shirt",            category: "Apparel",       price: 799,   costPrice: 350,  stock: 320, stockAlert: 50, isActive: true,  img: DEMO_IMGS[2] },
  { id: 4,  sku: "PRD-0004", name: "Ergonomic Office Chair",       category: "Home & Living", price: 12999, costPrice: 8500, stock: 24,  stockAlert: 5,  isActive: true,  img: DEMO_IMGS[3] },
  { id: 5,  sku: "PRD-0005", name: "Stainless Steel Water Bottle", category: "Sports",        price: 599,   costPrice: 220,  stock: 0,   stockAlert: 25, isActive: false, img: DEMO_IMGS[4] },
  { id: 6,  sku: "PRD-0006", name: "Smart LED Desk Lamp",          category: "Electronics",   price: 1899,  costPrice: 1100, stock: 65,  stockAlert: 10, isActive: true,  img: DEMO_IMGS[5] },
  { id: 7,  sku: "PRD-0007", name: "Yoga Mat Premium",             category: "Sports",        price: 1299,  costPrice: 650,  stock: 88,  stockAlert: 20, isActive: true,  img: DEMO_IMGS[6] },
  { id: 8,  sku: "PRD-0008", name: "Ceramic Coffee Mug Set",       category: "Home & Living", price: 999,   costPrice: 480,  stock: 12,  stockAlert: 15, isActive: false, img: DEMO_IMGS[7] },
  { id: 9,  sku: "PRD-0009", name: "Bluetooth Speaker Mini",       category: "Electronics",   price: 2199,  costPrice: 1300, stock: 55,  stockAlert: 10, isActive: true,  img: DEMO_IMGS[0] },
  { id: 10, sku: "PRD-0010", name: "Winter Jacket Fleece",         category: "Apparel",       price: 3499,  costPrice: 1900, stock: 43,  stockAlert: 10, isActive: true,  img: DEMO_IMGS[1] },
  { id: 11, sku: "PRD-0011", name: "Resistance Band Set",          category: "Sports",        price: 449,   costPrice: 180,  stock: 200, stockAlert: 30, isActive: true,  img: DEMO_IMGS[2] },
  { id: 12, sku: "PRD-0012", name: "Mechanical Keyboard RGB",      category: "Electronics",   price: 5499,  costPrice: 3600, stock: 31,  stockAlert: 8,  isActive: true,  img: DEMO_IMGS[3] },
];

const CATEGORIES = ["All Categories", "Electronics", "Sports", "Apparel", "Home & Living"];

const Icon = {
  Plus:    () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>,
  Search:  () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"   viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  Eye:     () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"   viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Edit:    () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"   viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Trash:   () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"   viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
  ChevL:   () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"   viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>,
  ChevR:   () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"   viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>,
  Warning: () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"   viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
};

const fmt = (n) => "₹" + n.toLocaleString("en-IN");
const stockStatus = (p) => {
  if (p.stock === 0)              return { label: "Out of Stock", bg: "#fce7f3", color: "#9d174d" };
  if (p.stock <= p.stockAlert)    return { label: "Low Stock",    bg: "#fef3c7", color: "#92400e" };
  return                                 { label: "In Stock",     bg: "#dcfce7", color: "#166534" };
};

export default function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts]   = useState(MOCK_PRODUCTS);
  const [search, setSearch]       = useState("");
  const [catFilter, setCatFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage]           = useState(1);
  const [pageSize, setPageSize]   = useState(8);
  const [deleteId, setDeleteId]   = useState(null);
  const [sortBy, setSortBy]       = useState("id");
  const [sortDir, setSortDir]     = useState("asc");

  const handleSort = (col) => {
    if (sortBy === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortBy(col); setSortDir("asc"); }
  };

  const filtered = products
    .filter((p) => {
      const q = search.toLowerCase();
      const matchSearch  = p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
      const matchCat     = catFilter === "All Categories" || p.category === catFilter;
      const matchStatus  = statusFilter === "all" ? true : statusFilter === "active" ? p.isActive : !p.isActive;
      return matchSearch && matchCat && matchStatus;
    })
    .sort((a, b) => {
      let va = a[sortBy], vb = b[sortBy];
      if (typeof va === "string") { va = va.toLowerCase(); vb = vb.toLowerCase(); }
      return sortDir === "asc" ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged      = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleDelete = (id) => { setProducts((p) => p.filter((x) => x.id !== id)); setDeleteId(null); };

  const SortIcon = ({ col }) => (
    <span style={{ color: sortBy === col ? "#2563eb" : "#cbd5e1", marginLeft: 4, fontSize: 10 }}>
      {sortBy === col ? (sortDir === "asc" ? "▲" : "▼") : "⇅"}
    </span>
  );

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }

        /* ── Base ─────────────────────────────────── */
        .pl-container { padding: 28px 32px; min-height: 100vh; background: var(--color-bg); }
        .pl-header    { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; gap: 12px; }
        .pl-stats     { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
        .pl-toolbar   { display: flex; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; align-items: center; }
        .pl-search    { position: relative; flex: 1; min-width: 220px; max-width: 360px; }
        .pl-table-wrap{ overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .pl-pagination{ display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-top: 1px solid var(--color-border); background: #fafbfd; flex-wrap: wrap; gap: 10px; }
        .pl-btn:hover { transform: translateY(-1px); }
        .pl-row:hover td { background: #f5f7ff !important; }
        .pl-act:hover { transform: scale(1.08); }
        .pl-input:focus { border-color: var(--color-primary) !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.12) !important; }
        .pl-pgbtn:hover:not(:disabled) { background: var(--color-surface-2) !important; }
        .sort-th { cursor: pointer; user-select: none; }
        .sort-th:hover { color: var(--color-primary) !important; }
        .pl-select { min-width: 140px; }

        /* ── Tablet ≤ 1024px ──────────────────────── */
        @media (max-width: 1024px) {
          .pl-stats { grid-template-columns: repeat(2, 1fr) !important; }
        }

        /* ── Mobile ≤ 768px ───────────────────────── */
        @media (max-width: 768px) {
          .pl-container { padding: 16px 14px !important; }
          .pl-header    { flex-direction: column !important; align-items: stretch !important; }
          .pl-add-btn   { width: 100% !important; justify-content: center !important; }
          .pl-stats     { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; margin-bottom: 16px !important; }
          .pl-toolbar   { flex-direction: column !important; align-items: stretch !important; }
          .pl-search    { max-width: 100% !important; min-width: unset !important; width: 100% !important; }
          .pl-select    { width: 100% !important; min-width: unset !important; }
          .pl-count     { margin-left: 0 !important; }
          .pl-pagesize  { width: 100% !important; }
          .pl-pagination{ flex-direction: column !important; align-items: flex-start !important; }
          .pl-pg-btns   { align-self: center; }
        }

        /* ── Small Mobile ≤ 480px ─────────────────── */
        @media (max-width: 480px) {
          .pl-container { padding: 12px 10px !important; }
          .pl-stats     { grid-template-columns: repeat(2, 1fr) !important; }
          .pl-stat-val  { font-size: 22px !important; }
        }
      `}</style>

      <div className="pl-container">

        {/* ── Page Header ─────────────────────────── */}
        <div className="pl-header">
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--color-text)", margin: 0, letterSpacing: "-0.4px" }}>Products</h1>
            <p style={{ fontSize: 13, color: "var(--color-text-subtle)", margin: "3px 0 0" }}>
              <a href="#" style={{ color: "var(--color-primary)", textDecoration: "none" }}>Inventory</a> › Products
            </p>
          </div>
          <button
            className="pl-btn pl-add-btn"
            onClick={() => navigate("/inventory/products/add")}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)",
              color: "#fff", border: "none", borderRadius: "var(--radius-md)",
              padding: "10px 18px", fontSize: 14, fontWeight: 600, cursor: "pointer",
              boxShadow: "0 4px 14px rgba(37,99,235,0.35)", transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
          >
            <Icon.Plus /> Add Product
          </button>
        </div>

        {/* ── Stats Row ───────────────────────────── */}
        <div className="pl-stats">
          {[
            { label: "Total Products",      value: products.length,                                          color: "var(--color-primary)", },
            { label: "Active",              value: products.filter((p) => p.isActive).length,                color: "var(--color-success)", },
            { label: "Low / Out of Stock",  value: products.filter((p) => p.stock <= p.stockAlert).length,   color: "var(--color-warning)", },
            { label: "Total SKUs",          value: products.length,                                          color: "var(--color-info)",    },
          ].map((s) => (
            <div key={s.label} style={{
              background: "var(--color-surface)", borderRadius: "var(--radius-lg)",
              padding: "16px 18px", boxShadow: "var(--shadow-sm)",
              borderLeft: `4px solid ${s.color}`,
            }}>
              <div className="pl-stat-val" style={{ fontSize: 26, fontWeight: 800, color: "var(--color-text)" }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 3, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── Toolbar ─────────────────────────────── */}
        <div className="pl-toolbar">
          {/* Search */}
          <div className="pl-search">
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-subtle)", pointerEvents: "none" }}>
              <Icon.Search />
            </span>
            <input
              className="pl-input"
              style={{
                width: "100%", padding: "10px 14px 10px 36px",
                border: "1.5px solid var(--color-border)", borderRadius: "var(--radius-md)",
                fontSize: 14, color: "var(--color-text)", background: "var(--color-surface)", outline: "none",
              }}
              placeholder="Search by name or SKU…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          {/* Category filter */}
          <select
            className="pl-input pl-select"
            style={{ padding: "10px 14px", border: "1.5px solid var(--color-border)", borderRadius: "var(--radius-md)", fontSize: 14, color: "var(--color-text)", background: "var(--color-surface)", cursor: "pointer", outline: "none" }}
            value={catFilter}
            onChange={(e) => { setCatFilter(e.target.value); setPage(1); }}
          >
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>

          {/* Status filter */}
          <select
            className="pl-input pl-select"
            style={{ padding: "10px 14px", border: "1.5px solid var(--color-border)", borderRadius: "var(--radius-md)", fontSize: 14, color: "var(--color-text)", background: "var(--color-surface)", cursor: "pointer", outline: "none" }}
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <span className="pl-count" style={{ fontSize: 13, color: "var(--color-text-muted)", marginLeft: "auto", whiteSpace: "nowrap" }}>
            {filtered.length} product{filtered.length !== 1 ? "s" : ""}
          </span>

          {/* Page size */}
          <select
            className="pl-pagesize"
            style={{ padding: "10px 12px", border: "1.5px solid var(--color-border)", borderRadius: "var(--radius-md)", fontSize: 13, color: "var(--color-text)", background: "var(--color-surface)", cursor: "pointer", outline: "none" }}
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
          >
            <option value={5}>5 / page</option>
            <option value={8}>8 / page</option>
            <option value={12}>12 / page</option>
            <option value={20}>20 / page</option>
          </select>
        </div>

        {/* ── Table ───────────────────────────────── */}
        <div style={{ background: "var(--color-surface)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)", overflow: "hidden" }}>
          <div className="pl-table-wrap">
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
              <thead style={{ background: "var(--color-surface-2)", borderBottom: "1.5px solid var(--color-border)" }}>
                <tr>
                  {[
                    { label: "#",        align: "left",   col: null },
                    { label: "Product",  align: "left",   col: null },
                    { label: "SKU",      align: "left",   col: "sku" },
                    { label: "Category", align: "left",   col: "category" },
                    { label: "Price",    align: "right",  col: "price" },
                    { label: "Stock",    align: "center", col: "stock" },
                    { label: "Status",   align: "center", col: null },
                    { label: "Actions",  align: "center", col: null },
                  ].map(({ label, align, col }) => (
                    <th
                      key={label}
                      className={col ? "sort-th" : ""}
                      onClick={col ? () => handleSort(col) : undefined}
                      style={{ padding: "12px 16px", textAlign: align, fontSize: 11.5, fontWeight: 700, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}
                    >
                      {label} {col && <SortIcon col={col} />}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", padding: "64px 20px", color: "var(--color-text-subtle)" }}>
                      <div style={{ fontSize: 44, marginBottom: 10 }}>📦</div>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>No products found</div>
                      <div style={{ fontSize: 13, marginTop: 4 }}>Try adjusting your search or filters</div>
                    </td>
                  </tr>
                ) : paged.map((p, i) => {
                  const ss = stockStatus(p);
                  return (
                    <tr key={p.id} className="pl-row" style={{ borderBottom: "1px solid var(--color-surface-2)" }}>
                      <td style={{ padding: "12px 16px", color: "var(--color-text-subtle)", fontSize: 13 }}>
                        {(page - 1) * pageSize + i + 1}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                          <img src={p.img} alt={p.name} style={{ width: 44, height: 44, borderRadius: "var(--radius-md)", objectFit: "cover", border: "1.5px solid var(--color-border)", flexShrink: 0 }} />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14, color: "var(--color-text)", lineHeight: 1.3 }}>{p.name}</div>
                            <div style={{ fontSize: 12, color: "var(--color-text-subtle)", marginTop: 2 }}>{p.category}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ fontFamily: "monospace", fontSize: 13, background: "var(--color-surface-2)", color: "var(--color-text-muted)", padding: "3px 8px", borderRadius: "var(--radius-sm)", fontWeight: 600 }}>
                          {p.sku}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ fontSize: 13, color: "var(--color-text-muted)", fontWeight: 500 }}>{p.category}</span>
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: "var(--color-text)" }}>{fmt(p.price)}</div>
                        <div style={{ fontSize: 11, color: "var(--color-text-subtle)" }}>Cost: {fmt(p.costPrice)}</div>
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "center" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                          <span style={{ fontWeight: 700, fontSize: 15, color: p.stock === 0 ? "var(--color-danger)" : p.stock <= p.stockAlert ? "var(--color-warning)" : "var(--color-text)" }}>
                            {p.stock}
                          </span>
                          {p.stock <= p.stockAlert && p.stock > 0 && (
                            <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "var(--color-warning)" }}>
                              <Icon.Warning /> Low
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "center" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: ss.bg, color: ss.color, whiteSpace: "nowrap" }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: ss.color, flexShrink: 0 }} />
                          {ss.label}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "center" }}>
                        <div style={{ display: "flex", gap: 5, justifyContent: "center" }}>
                          <button className="pl-act" title="View" onClick={() => navigate(`/inventory/products/${p.id}`)} style={{ width: 32, height: 32, borderRadius: "var(--radius-sm)", border: "none", cursor: "pointer", background: "var(--color-primary-100)", color: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}><Icon.Eye /></button>
                          <button className="pl-act" title="Edit"   onClick={() => navigate(`/inventory/products/${p.id}/edit`)} style={{ width: 32, height: 32, borderRadius: "var(--radius-sm)", border: "none", cursor: "pointer", background: "var(--color-info-light)", color: "var(--color-info)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}><Icon.Edit /></button>
                          <button className="pl-act" title="Delete" onClick={() => setDeleteId(p.id)} style={{ width: 32, height: 32, borderRadius: "var(--radius-sm)", border: "none", cursor: "pointer", background: "var(--color-danger-light)", color: "var(--color-danger)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}><Icon.Trash /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ──────────────────────────── */}
          <div className="pl-pagination">
            <span style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
              Showing {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}
            </span>
            <div className="pl-pg-btns" style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              <button className="pl-pgbtn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                style={{ width: 34, height: 34, borderRadius: "var(--radius-sm)", border: "1.5px solid var(--color-border)", background: "var(--color-surface)", cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon.ChevL />
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let n;
                if (totalPages <= 7)       n = i + 1;
                else if (page <= 4)        n = i + 1;
                else if (page >= totalPages - 3) n = totalPages - 6 + i;
                else                       n = page - 3 + i;
                if (n < 1 || n > totalPages) return null;
                return (
                  <button key={n} className="pl-pgbtn" onClick={() => setPage(n)}
                    style={{ width: 34, height: 34, borderRadius: "var(--radius-sm)", border: n === page ? "none" : "1.5px solid var(--color-border)", background: n === page ? "var(--color-primary)" : "var(--color-surface)", color: n === page ? "#fff" : "var(--color-text)", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {n}
                  </button>
                );
              })}
              <button className="pl-pgbtn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0}
                style={{ width: 34, height: 34, borderRadius: "var(--radius-sm)", border: "1.5px solid var(--color-border)", background: "var(--color-surface)", cursor: page === totalPages ? "not-allowed" : "pointer", opacity: page === totalPages || totalPages === 0 ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon.ChevR />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Delete Confirm Modal ─────────────────── */}
      {deleteId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", backdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}>
          <div style={{ background: "var(--color-surface)", borderRadius: "var(--radius-xl)", padding: "32px 36px", maxWidth: 380, width: "100%", boxShadow: "var(--shadow-lg)" }}>
            <div style={{ fontSize: 40, textAlign: "center", marginBottom: 12 }}>🗑️</div>
            <h3 style={{ textAlign: "center", margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "var(--color-text)" }}>Delete Product?</h3>
            <p style={{ textAlign: "center", color: "var(--color-text-muted)", fontSize: 14, marginBottom: 24 }}>
              This action is permanent. All inventory records linked to this product will also be affected.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: 11, borderRadius: "var(--radius-md)", border: "1.5px solid var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-muted)", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>Cancel</button>
              <button onClick={() => handleDelete(deleteId)} style={{ flex: 1, padding: 11, borderRadius: "var(--radius-md)", border: "none", background: "linear-gradient(135deg, var(--color-danger), #dc2626)", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 14, boxShadow: "0 4px 12px rgba(239,68,68,0.35)" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}