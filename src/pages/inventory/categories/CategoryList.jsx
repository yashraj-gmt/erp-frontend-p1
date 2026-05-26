// src/pages/inventory/categories/CategoryList.jsx
import React, { useState } from "react";
import CategoryForm from "./CategoryForm";

/* ─── Mock Data ──────────────────────────────────────────────── */
const MOCK_CATEGORIES = [
  { id: 1, name: "Electronics",    description: "Smartphones, laptops, tablets and accessories",  isActive: true,  products: 42  },
  { id: 2, name: "Apparel",        description: "Clothing, footwear and fashion accessories",     isActive: true,  products: 118 },
  { id: 3, name: "Home & Living",  description: "Furniture, decor and kitchen essentials",        isActive: true,  products: 67  },
  { id: 4, name: "Sports",         description: "Equipment and gear for outdoor activities",      isActive: false, products: 23  },
  { id: 5, name: "Automotive",     description: "Spare parts, tools and car accessories",         isActive: true,  products: 89  },
  { id: 6, name: "Books",          description: "Fiction, non-fiction and educational titles",    isActive: true,  products: 204 },
  { id: 7, name: "Health & Beauty",description: "Personal care, supplements and cosmetics",      isActive: false, products: 55  },
  { id: 8, name: "Toys & Games",   description: "Indoor games, outdoor toys and collectibles",   isActive: true,  products: 31  },
];

/* ─── Icons ──────────────────────────────────────────────────── */
const Icon = {
  Search: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  ),
  Plus: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path d="M12 5v14M5 12h14"/>
    </svg>
  ),
  Edit: () => (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  Trash: () => (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
      <path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
    </svg>
  ),
  ChevronLeft: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M15 18l-6-6 6-6"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M9 18l6-6-6-6"/>
    </svg>
  ),
  Tag: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
      <line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  ),
};

/* ─── Shared derived style helpers (CSS-var based) ───────────── */
const thStyle = {
  padding: "12px 16px",
  textAlign: "left",
  fontSize: 11.5,
  fontWeight: 700,
  color: "var(--color-text-muted)",
  textTransform: "uppercase",
  letterSpacing: "0.6px",
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "14px 16px",
  fontSize: 14,
  color: "var(--color-text)",
  verticalAlign: "middle",
};

const catIconStyle = {
  width: 32,
  height: 32,
  borderRadius: 8,
  background: "var(--color-primary-100)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--color-primary)",
  flexShrink: 0,
};

const countBadgeStyle = {
  display: "inline-block",
  background: "var(--color-primary-100)",
  color: "var(--color-primary)",
  fontWeight: 700,
  fontSize: 13,
  padding: "2px 10px",
  borderRadius: 20,
};

const badgeStyle = (active) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  padding: "4px 10px",
  borderRadius: 20,
  fontSize: 12,
  fontWeight: 600,
  background: active ? "var(--color-success-light)" : "var(--color-danger-light)",
  color: active ? "var(--color-success)" : "var(--color-danger)",
});

const actionBtnStyle = (type) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 32,
  height: 32,
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  background: type === "indigo" ? "var(--color-primary-100)" : "var(--color-danger-light)",
  color: type === "indigo" ? "var(--color-primary)" : "var(--color-danger)",
  transition: "all 0.15s",
});

const pageBtnStyle = (active) => ({
  width: 34,
  height: 34,
  borderRadius: 8,
  border: active ? "none" : "1.5px solid var(--color-border)",
  background: active ? "var(--color-primary)" : "var(--color-surface)",
  color: active ? "var(--color-text-inverse)" : "var(--color-text)",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.15s",
});

/* ─── Toggle Component ───────────────────────────────────────── */
function Toggle({ active, onToggle }) {
  return (
    <div className="cl-toggle" onClick={onToggle}>
      <div className={`cl-toggle-track${active ? " on" : ""}`} />
      <div className={`cl-toggle-thumb${active ? " on" : ""}`} />
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function CategoryList() {
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [search,     setSearch]     = useState("");
  const [filter,     setFilter]     = useState("all");
  const [page,       setPage]       = useState(1);
  const [showForm,   setShowForm]   = useState(false);
  const [editItem,   setEditItem]   = useState(null);
  const [deleteId,   setDeleteId]   = useState(null);

  const PAGE_SIZE = 5;

  const filtered = categories.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                        c.description.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" ? true : filter === "active" ? c.isActive : !c.isActive;
    return matchSearch && matchFilter;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleToggle = (id) =>
    setCategories((prev) => prev.map((c) => c.id === id ? { ...c, isActive: !c.isActive } : c));

  const handleDelete = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setDeleteId(null);
  };

  const handleSave = (data) => {
    if (data.id) {
      setCategories((prev) => prev.map((c) => c.id === data.id ? { ...c, ...data } : c));
    } else {
      setCategories((prev) => [...prev, { ...data, id: Date.now(), products: 0 }]);
    }
    setShowForm(false);
    setEditItem(null);
  };

  const totals = {
    all:      categories.length,
    active:   categories.filter((c) => c.isActive).length,
    inactive: categories.filter((c) => !c.isActive).length,
  };

  return (
    <>
      {/* ── Global Styles ─────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        /* ── Page layout ── */
        .cl-page {
          min-height: 100vh;
          background: var(--color-bg);
          font-family: 'DM Sans', 'Segoe UI', sans-serif;
          padding: 28px 32px;
        }

        /* ── Header ── */
        .cl-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 24px;
          gap: 12px;
          flex-wrap: wrap;
        }
        .cl-page-title {
          font-size: clamp(18px, 3vw, 22px);
          font-weight: 700;
          color: var(--color-text);
          letter-spacing: -0.4px;
          margin: 0;
        }
        .cl-breadcrumb {
          font-size: 13px;
          color: var(--color-text-subtle);
          margin: 3px 0 0;
        }
        .cl-breadcrumb a { color: var(--color-primary); text-decoration: none; }

        .cl-add-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary-dark) 100%);
          color: var(--color-text-inverse);
          border: none;
          border-radius: var(--radius-md);
          padding: 10px 18px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: var(--shadow-md);
          transition: all 0.2s;
          white-space: nowrap;
          font-family: inherit;
        }
        .cl-add-btn:hover {
          transform: translateY(-1px);
          box-shadow: var(--shadow-lg);
        }

        /* ── Stats row ── */
        .cl-stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }
        .cl-stat-card {
          background: var(--color-surface);
          border-radius: var(--radius-lg);
          padding: 16px 20px;
          box-shadow: var(--shadow-sm);
        }
        .cl-stat-value {
          font-size: 26px;
          font-weight: 800;
          color: var(--color-text);
          line-height: 1;
        }
        .cl-stat-label {
          font-size: 12px;
          color: var(--color-text-muted);
          margin-top: 4px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* ── Toolbar ── */
        .cl-toolbar {
          display: flex;
          gap: 12px;
          margin-bottom: 18px;
          align-items: center;
          flex-wrap: wrap;
        }
        .cl-search-wrap {
          position: relative;
          flex: 1;
          min-width: 180px;
          max-width: 380px;
        }
        .cl-search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-subtle);
          pointer-events: none;
          display: flex;
        }
        .cl-search-input {
          width: 100%;
          padding: 10px 14px 10px 36px;
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-md);
          font-size: 14px;
          color: var(--color-text);
          background: var(--color-surface);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: inherit;
        }
        .cl-search-input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px var(--color-primary-100);
        }
        .cl-filter-select {
          padding: 10px 14px;
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-md);
          font-size: 14px;
          color: var(--color-text-muted);
          background: var(--color-surface);
          cursor: pointer;
          outline: none;
          min-width: 140px;
          font-family: inherit;
          transition: border-color 0.2s;
        }
        .cl-filter-select:focus { border-color: var(--color-primary); }
        .cl-result-count {
          font-size: 13px;
          color: var(--color-text-muted);
          margin-left: auto;
          white-space: nowrap;
        }

        /* ── Table card wrapper ── */
        .cl-card {
          background: var(--color-surface);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
          overflow: hidden;
        }

        /* ── Table ── */
        .cl-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .cl-table { width: 100%; border-collapse: collapse; }
        .cl-thead { background: var(--color-surface-2); border-bottom: 1.5px solid var(--color-border); }
        .cl-row { border-bottom: 1px solid var(--color-surface-2); transition: background 0.15s; }
        .cl-row:hover td { background: var(--color-primary-50) !important; }
        .cl-row:last-child { border-bottom: none; }

        /* ── Table column visibility ── */
        .cl-col-desc   { /* visible by default */ }
        .cl-col-status { /* visible by default */ }
        .cl-col-active { /* visible by default */ }

        /* ── Action buttons ── */
        .cl-action-btn { transition: transform 0.15s; }
        .cl-action-btn:hover { transform: scale(1.1); }

        /* ── Toggle ── */
        .cl-toggle {
          position: relative;
          display: inline-block;
          width: 38px;
          height: 22px;
          cursor: pointer;
          flex-shrink: 0;
        }
        .cl-toggle-track {
          position: absolute;
          inset: 0;
          border-radius: 11px;
          background: var(--color-border-strong);
          transition: background 0.2s;
        }
        .cl-toggle-track.on { background: var(--color-primary); }
        .cl-toggle-thumb {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--color-surface);
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          transition: left 0.2s;
        }
        .cl-toggle-thumb.on { left: 19px; }

        /* ── Pagination ── */
        .cl-pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          border-top: 1px solid var(--color-border);
          background: var(--color-surface-2);
          flex-wrap: wrap;
          gap: 10px;
        }
        .cl-page-btn { font-family: inherit; }
        .cl-page-btn:not([data-active="true"]):hover {
          background: var(--color-surface-2) !important;
        }

        /* ── Mobile cards (hidden on desktop) ── */
        .cl-mobile-list { display: none; padding: 12px; }
        .cl-mobile-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 14px 16px;
          margin-bottom: 10px;
        }
        .cl-mobile-card:last-child { margin-bottom: 0; }
        .cl-mc-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
        }
        .cl-mc-name {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: var(--color-text);
          font-size: 14px;
        }
        .cl-mc-actions { display: flex; gap: 6px; }
        .cl-mc-desc {
          font-size: 12px;
          color: var(--color-text-muted);
          margin-bottom: 10px;
          line-height: 1.45;
        }
        .cl-mc-footer {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        /* ══════════════════════════════════════════════════════
           RESPONSIVE BREAKPOINTS
        ══════════════════════════════════════════════════════ */

        /* ── Tablet: 640px – 1023px ── */
        @media (min-width: 640px) and (max-width: 1023px) {
          .cl-page { padding: 20px 24px; }
          .cl-col-desc   { display: none; }
          .cl-col-active { display: none; }
          .cl-search-wrap { max-width: none; }
        }

        /* ── Mobile: < 640px ── */
        @media (max-width: 639px) {
          .cl-page { padding: 16px; }

          /* Header */
          .cl-header { margin-bottom: 16px; }

          /* Stats */
          .cl-stats-row { gap: 8px; margin-bottom: 16px; }
          .cl-stat-card { padding: 12px 10px; }
          .cl-stat-value { font-size: 20px; }
          .cl-stat-label { font-size: 10px; }

          /* Toolbar */
          .cl-toolbar { gap: 8px; margin-bottom: 14px; }
          .cl-search-wrap { max-width: none; min-width: 0; flex: 1 1 100%; }
          .cl-filter-select { flex: 1; min-width: 0 !important; }
          .cl-result-count { margin-left: 0; }

          /* Hide desktop table, show mobile cards */
          .cl-table-wrap { display: none; }
          .cl-mobile-list { display: block; }

          /* Pagination */
          .cl-pagination { padding: 12px 16px; }
        }

        /* ── Very small screens: < 360px ── */
        @media (max-width: 359px) {
          .cl-page { padding: 12px; }
          .cl-stats-row { gap: 6px; }
          .cl-stat-card { padding: 10px 8px; }
          .cl-stat-value { font-size: 18px; }
          .cl-stat-label { font-size: 9px; letter-spacing: 0; }
          .cl-add-btn { padding: 9px 12px; font-size: 13px; }
        }
      `}</style>

      {/* ── Page ───────────────────────────────────────────────── */}
      <div className="cl-page">

        {/* Header */}
        <div className="cl-header">
          <div>
            <h1 className="cl-page-title">Product Categories</h1>
            <p className="cl-breadcrumb">
              <a href="#">Inventory</a> › Categories
            </p>
          </div>
          <button
            className="cl-add-btn"
            onClick={() => { setEditItem(null); setShowForm(true); }}
          >
            <Icon.Plus /> Add Category
          </button>
        </div>

        {/* Stats */}
        <div className="cl-stats-row">
          {[
            { color: "var(--color-primary)", value: totals.all,      label: "Total Categories" },
            { color: "var(--color-success)", value: totals.active,   label: "Active"            },
            { color: "var(--color-danger)",  value: totals.inactive, label: "Inactive"          },
          ].map(({ color, value, label }) => (
            <div key={label} className="cl-stat-card" style={{ borderLeft: `4px solid ${color}` }}>
              <div className="cl-stat-value">{value}</div>
              <div className="cl-stat-label">{label}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="cl-toolbar">
          <div className="cl-search-wrap">
            <span className="cl-search-icon"><Icon.Search /></span>
            <input
              className="cl-search-input"
              placeholder="Search categories…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <select
            className="cl-filter-select"
            value={filter}
            onChange={(e) => { setFilter(e.target.value); setPage(1); }}
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
          <span className="cl-result-count">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Main Card */}
        <div className="cl-card">

          {/* ── Desktop / Tablet Table ───────────────────────── */}
          <div className="cl-table-wrap">
            <table className="cl-table">
              <thead className="cl-thead">
                <tr>
                  <th style={{ ...thStyle, width: 48 }}>#</th>
                  <th style={thStyle}>Category Name</th>
                  <th className="cl-col-desc" style={thStyle}>Description</th>
                  <th style={{ ...thStyle, textAlign: "center" }}>Products</th>
                  <th className="cl-col-status" style={{ ...thStyle, textAlign: "center" }}>Status</th>
                  <th className="cl-col-active" style={{ ...thStyle, textAlign: "center" }}>Active</th>
                  <th style={{ ...thStyle, textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "60px 20px" }}>
                      <div style={{ fontSize: 40, marginBottom: 8 }}>📂</div>
                      <div style={{ fontWeight: 600, color: "var(--color-text-muted)" }}>No categories found</div>
                      <div style={{ fontSize: 13, marginTop: 4, color: "var(--color-text-subtle)" }}>
                        Try adjusting your search or filters
                      </div>
                    </td>
                  </tr>
                ) : paged.map((cat, i) => (
                  <tr
                    key={cat.id}
                    className="cl-row"
                    style={{ background: i % 2 === 0 ? "var(--color-surface)" : "var(--color-bg)" }}
                  >
                    <td style={{ ...tdStyle, color: "var(--color-text-subtle)", fontSize: 13, width: 48 }}>
                      {(page - 1) * PAGE_SIZE + i + 1}
                    </td>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 600, color: "var(--color-text)", display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={catIconStyle}><Icon.Tag /></div>
                        {cat.name}
                      </div>
                    </td>
                    <td className="cl-col-desc" style={tdStyle}>
                      <div style={{ fontSize: 13, color: "var(--color-text-muted)", maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {cat.description}
                      </div>
                    </td>
                    <td style={{ ...tdStyle, textAlign: "center" }}>
                      <span style={countBadgeStyle}>{cat.products}</span>
                    </td>
                    <td className="cl-col-status" style={{ ...tdStyle, textAlign: "center" }}>
                      <span style={badgeStyle(cat.isActive)}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: cat.isActive ? "var(--color-success)" : "var(--color-danger)" }} />
                        {cat.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="cl-col-active" style={{ ...tdStyle, textAlign: "center" }}>
                      <Toggle active={cat.isActive} onToggle={() => handleToggle(cat.id)} />
                    </td>
                    <td style={{ ...tdStyle, textAlign: "center" }}>
                      <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                        <button
                          className="cl-action-btn"
                          title="Edit"
                          style={actionBtnStyle("indigo")}
                          onClick={() => { setEditItem(cat); setShowForm(true); }}
                        ><Icon.Edit /></button>
                        <button
                          className="cl-action-btn"
                          title="Delete"
                          style={actionBtnStyle("red")}
                          onClick={() => setDeleteId(cat.id)}
                        ><Icon.Trash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Mobile Cards ─────────────────────────────────── */}
          <div className="cl-mobile-list">
            {paged.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "var(--color-text-subtle)" }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>📂</div>
                <div style={{ fontWeight: 600, color: "var(--color-text-muted)" }}>No categories found</div>
                <div style={{ fontSize: 13, marginTop: 4 }}>Try adjusting your search or filters</div>
              </div>
            ) : paged.map((cat, i) => (
              <div key={cat.id} className="cl-mobile-card">
                <div className="cl-mc-header">
                  <div className="cl-mc-name">
                    <div style={catIconStyle}><Icon.Tag /></div>
                    {cat.name}
                  </div>
                  <div className="cl-mc-actions">
                    <button
                      className="cl-action-btn"
                      style={actionBtnStyle("indigo")}
                      onClick={() => { setEditItem(cat); setShowForm(true); }}
                    ><Icon.Edit /></button>
                    <button
                      className="cl-action-btn"
                      style={actionBtnStyle("red")}
                      onClick={() => setDeleteId(cat.id)}
                    ><Icon.Trash /></button>
                  </div>
                </div>
                <div className="cl-mc-desc">{cat.description}</div>
                <div className="cl-mc-footer">
                  <span style={countBadgeStyle}>{cat.products} products</span>
                  <span style={badgeStyle(cat.isActive)}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: cat.isActive ? "var(--color-success)" : "var(--color-danger)" }} />
                    {cat.isActive ? "Active" : "Inactive"}
                  </span>
                  <Toggle active={cat.isActive} onToggle={() => handleToggle(cat.id)} />
                </div>
              </div>
            ))}
          </div>

          {/* ── Pagination ───────────────────────────────────── */}
          {totalPages > 1 && (
            <div className="cl-pagination">
              <span style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} categories
              </span>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  className="cl-page-btn"
                  style={pageBtnStyle(false)}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                ><Icon.ChevronLeft /></button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    className="cl-page-btn"
                    style={pageBtnStyle(n === page)}
                    data-active={n === page}
                    onClick={() => setPage(n)}
                  >{n}</button>
                ))}

                <button
                  className="cl-page-btn"
                  style={pageBtnStyle(false)}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                ><Icon.ChevronRight /></button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Category Form Modal ─────────────────────────────────── */}
      {showForm && (
        <CategoryForm
          item={editItem}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditItem(null); }}
        />
      )}

      {/* ── Delete Confirm Modal ────────────────────────────────── */}
      {deleteId && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(15,23,42,0.45)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 16,
        }}>
          <div style={{
            background: "var(--color-surface)",
            borderRadius: "var(--radius-xl)",
            padding: "32px 36px",
            maxWidth: 380,
            width: "100%",
            boxShadow: "var(--shadow-lg)",
          }}>
            <div style={{ fontSize: 40, textAlign: "center", marginBottom: 12 }}>🗑️</div>
            <h3 style={{
              textAlign: "center", margin: "0 0 8px",
              fontSize: 18, fontWeight: 700, color: "var(--color-text)",
            }}>Delete Category?</h3>
            <p style={{
              textAlign: "center", color: "var(--color-text-muted)",
              fontSize: 14, marginBottom: 24,
            }}>
              This action cannot be undone. All data associated with this category will be permanently removed.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setDeleteId(null)}
                style={{
                  flex: 1, padding: 11, borderRadius: "var(--radius-md)",
                  border: "1.5px solid var(--color-border)",
                  background: "var(--color-surface)", color: "var(--color-text)",
                  fontWeight: 600, cursor: "pointer", fontSize: 14, fontFamily: "inherit",
                }}
              >Cancel</button>
              <button
                onClick={() => handleDelete(deleteId)}
                style={{
                  flex: 1, padding: 11, borderRadius: "var(--radius-md)",
                  border: "none",
                  background: "linear-gradient(135deg, var(--color-danger), #dc2626)",
                  color: "var(--color-text-inverse)",
                  fontWeight: 600, cursor: "pointer", fontSize: 14,
                  boxShadow: "0 4px 12px var(--color-danger-light)",
                  fontFamily: "inherit",
                }}
              >Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}