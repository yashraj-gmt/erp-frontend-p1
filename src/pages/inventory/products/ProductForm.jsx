// src/pages/inventory/products/ProductForm.jsx
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import demo1 from "../../../assets/images/demo-1.jpg";
import demo2 from "../../../assets/images/demo-2.jpg";
import demo3 from "../../../assets/images/demo-3.jpg";

const Icon = {
  ArrowLeft:  () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>,
  Upload:     () => <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
  X:          () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>,
  Image:      () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"   viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  Package:    () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"   viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  Warehouse:  () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"   viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  DollarSign: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"   viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  Star:       () => <svg width="10" height="10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  Check:      () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
};

const CATEGORIES = ["Electronics", "Apparel", "Home & Living", "Sports", "Automotive", "Books", "Health & Beauty", "Toys & Games"];
const WAREHOUSES  = ["Main Warehouse - Mumbai", "North Hub - Delhi", "South Depot - Chennai", "East Store - Kolkata"];

export default function ProductForm({ isEdit = false }) {
  const navigate = useNavigate();
  const fileRef  = useRef(null);

  const [form, setForm] = useState({
    name:              isEdit ? "Wireless Headphones Pro" : "",
    sku:               isEdit ? "PRD-0001" : "",
    category:          isEdit ? "Electronics" : "",
    description:       isEdit ? "Premium wireless headphones with active noise cancellation, 30-hour battery life, and superior audio quality for music lovers and professionals." : "",
    price:             isEdit ? "4999" : "",
    costPrice:         isEdit ? "3200" : "",
    weight:            isEdit ? "0.35" : "",
    unit:              isEdit ? "piece" : "piece",
    isActive:          true,
    stockQuantity:     isEdit ? "142" : "",
    stockAlert:        isEdit ? "20"  : "",
    warehouseCapacity: isEdit ? "500" : "",
    warehouse:         isEdit ? "Main Warehouse - Mumbai" : "",
  });

  const [images, setImages]         = useState(isEdit ? [
    { id: 1, url: demo1, isPrimary: true,  name: "headphones-main.jpg" },
    { id: 2, url: demo2, isPrimary: false, name: "headphones-side.jpg" },
    { id: 3, url: demo3, isPrimary: false, name: "headphones-box.jpg"  },
  ] : []);
  const [errors, setErrors]         = useState({});
  const [saving, setSaving]         = useState(false);
  const [dragging, setDragging]     = useState(false);
  const [activeSection, setActiveSection] = useState("basic");

  const field = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const addFiles = (files) => {
    const newImgs = Array.from(files).map((file, i) => ({
      id: Date.now() + i, url: URL.createObjectURL(file),
      isPrimary: images.length === 0 && i === 0, name: file.name, file,
    }));
    setImages((prev) => [...prev, ...newImgs]);
  };

  const removeImage = (id) => {
    setImages((prev) => {
      const next = prev.filter((img) => img.id !== id);
      if (next.length > 0 && !next.some((img) => img.isPrimary)) next[0].isPrimary = true;
      return next;
    });
  };

  const setPrimary = (id) => setImages((prev) => prev.map((img) => ({ ...img, isPrimary: img.id === id })));

  const validate = () => {
    const e = {};
    if (!form.name.trim())                          e.name     = "Product name is required.";
    if (!form.sku.trim())                           e.sku      = "SKU is required.";
    if (!form.category)                             e.category = "Select a category.";
    if (!form.price)                                e.price    = "Price is required.";
    else if (isNaN(form.price) || +form.price < 0) e.price    = "Enter a valid price.";
    if (images.length === 0)                        e.images   = "At least one product image is required.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    navigate("/inventory/products");
  };

  /* ─── Sub-components ───────────────────── */
  const Label = ({ children, required }) => (
    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--color-text)", marginBottom: 6 }}>
      {children} {required && <span style={{ color: "var(--color-danger)" }}>*</span>}
    </label>
  );

  const Input = ({ name, ...props }) => (
    <input
      {...props}
      value={form[name]}
      onChange={(e) => { field(name, e.target.value); setErrors((err) => ({ ...err, [name]: "" })); }}
      style={{
        width: "100%", padding: "11px 14px",
        border: `1.5px solid ${errors[name] ? "var(--color-danger)" : "var(--color-border)"}`,
        borderRadius: "var(--radius-md)", fontSize: 14, color: "var(--color-text)",
        background: "var(--color-surface)", outline: "none", transition: "border-color 0.2s",
        ...props.style,
      }}
      className="pf-input"
    />
  );

  const ErrMsg = ({ k }) => errors[k]
    ? <div style={{ fontSize: 12, color: "var(--color-danger)", marginTop: 4 }}>{errors[k]}</div>
    : null;

  const SectionBtn = ({ id, label, icon }) => (
    <button
      type="button"
      onClick={() => setActiveSection(id)}
      style={{
        display: "flex", alignItems: "center", gap: 7,
        padding: "8px 14px", borderRadius: "var(--radius-sm)", border: "none",
        background: activeSection === id ? "var(--color-primary)" : "transparent",
        color: activeSection === id ? "#fff" : "var(--color-text-muted)",
        fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.15s",
        whiteSpace: "nowrap", flexShrink: 0,
      }}
    >
      {icon} {label}
    </button>
  );

  const selectStyle = (hasError) => ({
    width: "100%", padding: "11px 14px",
    border: `1.5px solid ${hasError ? "var(--color-danger)" : "var(--color-border)"}`,
    borderRadius: "var(--radius-md)", fontSize: 14, color: "var(--color-text)",
    background: "var(--color-surface)", outline: "none",
  });

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }

        /* ── Base classes ─────────────────────────── */
        .pf-container  { min-height: 100vh; background: var(--color-bg); padding: 28px 32px; }
        .pf-page-header{ display: flex; align-items: center; gap: 14px; margin-bottom: 28px; }
        .pf-main-grid  { display: grid; grid-template-columns: 1fr 340px; gap: 20px; align-items: start; }
        .pf-tabs       { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 2px; -webkit-overflow-scrolling: touch; }
        .pf-tabs::-webkit-scrollbar { height: 0; }
        .pf-inner-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .pf-full       { grid-column: 1 / -1; }

        .pf-input:focus { border-color: var(--color-primary) !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.12) !important; }
        .pf-drop  { transition: all 0.2s; }
        .pf-drop:hover  { border-color: var(--color-primary) !important; background: var(--color-primary-50) !important; }
        .img-card { transition: transform 0.15s; }
        .img-card:hover .img-overlay { opacity: 1 !important; }
        .img-card:hover { transform: scale(1.03); }
        .submit-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(37,99,235,0.4) !important; }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Tablet ≤ 900px ───────────────────────── */
        @media (max-width: 900px) {
          .pf-main-grid { grid-template-columns: 1fr !important; }
          .pf-right-col { order: -1; }
        }

        /* ── Mobile ≤ 640px ───────────────────────── */
        @media (max-width: 640px) {
          .pf-container   { padding: 14px !important; }
          .pf-page-header { margin-bottom: 18px !important; }
          .pf-inner-grid  { grid-template-columns: 1fr !important; }
          .pf-full        { grid-column: 1 !important; }
        }

        /* ── Small Mobile ≤ 400px ─────────────────── */
        @media (max-width: 400px) {
          .pf-container { padding: 10px !important; }
        }
      `}</style>

      <div className="pf-container">

        {/* ── Page Header ─────────────────────────── */}
        <div className="pf-page-header">
          <button
            onClick={() => navigate("/inventory/products")}
            style={{ width: 38, height: 38, borderRadius: "var(--radius-md)", border: "1.5px solid var(--color-border)", background: "var(--color-surface)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)", flexShrink: 0 }}
          >
            <Icon.ArrowLeft />
          </button>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--color-text)", margin: 0, letterSpacing: "-0.4px" }}>
              {isEdit ? "Edit Product" : "Add New Product"}
            </h1>
            <p style={{ fontSize: 13, color: "var(--color-text-subtle)", margin: "3px 0 0" }}>
              <a href="#" style={{ color: "var(--color-primary)", textDecoration: "none" }}>Inventory</a> ›{" "}
              <a href="#" style={{ color: "var(--color-primary)", textDecoration: "none" }}>Products</a> › {isEdit ? "Edit" : "Add"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="pf-main-grid">

            {/* ── LEFT COLUMN ─────────────────────── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Section Tabs */}
              <div style={{ background: "var(--color-surface)", borderRadius: "var(--radius-lg)", padding: "12px 16px", boxShadow: "var(--shadow-sm)" }}>
                <div className="pf-tabs">
                  <SectionBtn id="basic"     label="Basic Info"  icon={<Icon.Package />} />
                  <SectionBtn id="pricing"   label="Pricing"     icon={<Icon.DollarSign />} />
                  <SectionBtn id="inventory" label="Inventory"   icon={<Icon.Warehouse />} />
                  <SectionBtn id="images"    label="Images"      icon={<Icon.Image />} />
                </div>
              </div>

              {/* Basic Info */}
              {activeSection === "basic" && (
                <div style={{ background: "var(--color-surface)", borderRadius: "var(--radius-lg)", padding: 24, boxShadow: "var(--shadow-sm)" }}>
                  <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 700, color: "var(--color-text)", paddingBottom: 12, borderBottom: "1px solid var(--color-surface-2)" }}>Basic Information</h3>
                  <div className="pf-inner-grid">
                    <div className="pf-full">
                      <Label required>Product Name</Label>
                      <Input name="name" placeholder="Enter product name" />
                      <ErrMsg k="name" />
                    </div>
                    <div>
                      <Label required>SKU</Label>
                      <Input name="sku" placeholder="e.g. PRD-0001" />
                      <ErrMsg k="sku" />
                    </div>
                    <div>
                      <Label required>Category</Label>
                      <select value={form.category} onChange={(e) => { field("category", e.target.value); setErrors((err) => ({ ...err, category: "" })); }} style={selectStyle(errors.category)} className="pf-input">
                        <option value="">Select category…</option>
                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ErrMsg k="category" />
                    </div>
                    <div>
                      <Label>Unit</Label>
                      <select value={form.unit} onChange={(e) => field("unit", e.target.value)} style={selectStyle(false)} className="pf-input">
                        <option value="piece">Piece</option>
                        <option value="kg">Kilogram (kg)</option>
                        <option value="litre">Litre</option>
                        <option value="box">Box</option>
                        <option value="set">Set</option>
                      </select>
                    </div>
                    <div>
                      <Label>Weight (kg)</Label>
                      <Input name="weight" placeholder="0.00" type="number" min="0" step="0.01" />
                    </div>
                    <div className="pf-full">
                      <Label>Description</Label>
                      <textarea
                        value={form.description}
                        onChange={(e) => field("description", e.target.value)}
                        placeholder="Product description, features, specifications…"
                        style={{ width: "100%", padding: "11px 14px", border: "1.5px solid var(--color-border)", borderRadius: "var(--radius-md)", fontSize: 14, color: "var(--color-text)", background: "var(--color-surface)", outline: "none", resize: "vertical", minHeight: 100, lineHeight: 1.6 }}
                        className="pf-input"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Pricing */}
              {activeSection === "pricing" && (
                <div style={{ background: "var(--color-surface)", borderRadius: "var(--radius-lg)", padding: 24, boxShadow: "var(--shadow-sm)" }}>
                  <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 700, color: "var(--color-text)", paddingBottom: 12, borderBottom: "1px solid var(--color-surface-2)" }}>Pricing Details</h3>
                  <div className="pf-inner-grid">
                    <div>
                      <Label required>Selling Price (₹)</Label>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-subtle)", fontSize: 14, fontWeight: 600 }}>₹</span>
                        <Input name="price" placeholder="0.00" type="number" min="0" step="0.01" style={{ paddingLeft: 26 }} />
                      </div>
                      <ErrMsg k="price" />
                    </div>
                    <div>
                      <Label>Cost Price (₹)</Label>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-subtle)", fontSize: 14, fontWeight: 600 }}>₹</span>
                        <Input name="costPrice" placeholder="0.00" type="number" min="0" step="0.01" style={{ paddingLeft: 26 }} />
                      </div>
                    </div>
                    {form.price && form.costPrice && +form.price > +form.costPrice && (
                      <div className="pf-full" style={{ background: "var(--color-success-light)", border: "1px solid #bbf7d0", borderRadius: "var(--radius-md)", padding: "12px 16px" }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#166534" }}>
                          💰 Margin: ₹{(+form.price - +form.costPrice).toLocaleString("en-IN")} &nbsp;
                          ({(((+form.price - +form.costPrice) / +form.price) * 100).toFixed(1)}%)
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Inventory */}
              {activeSection === "inventory" && (
                <div style={{ background: "var(--color-surface)", borderRadius: "var(--radius-lg)", padding: 24, boxShadow: "var(--shadow-sm)" }}>
                  <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 700, color: "var(--color-text)", paddingBottom: 12, borderBottom: "1px solid var(--color-surface-2)" }}>Inventory & Warehouse</h3>
                  <div className="pf-inner-grid">
                    <div className="pf-full">
                      <Label>Warehouse</Label>
                      <select value={form.warehouse} onChange={(e) => field("warehouse", e.target.value)} style={selectStyle(false)} className="pf-input">
                        <option value="">Select warehouse…</option>
                        {WAREHOUSES.map((w) => <option key={w} value={w}>{w}</option>)}
                      </select>
                    </div>
                    <div>
                      <Label>Stock Quantity</Label>
                      <Input name="stockQuantity" placeholder="0" type="number" min="0" />
                    </div>
                    <div>
                      <Label>Stock Alert Threshold <span style={{ fontSize: 11, color: "var(--color-text-subtle)", fontWeight: 400 }}>(low-stock trigger)</span></Label>
                      <Input name="stockAlert" placeholder="e.g. 20" type="number" min="0" />
                    </div>
                    <div>
                      <Label>Warehouse Capacity</Label>
                      <Input name="warehouseCapacity" placeholder="e.g. 500" type="number" min="0" />
                    </div>
                    {form.stockQuantity && form.warehouseCapacity && +form.warehouseCapacity > 0 && (
                      <div className="pf-full">
                        <Label>Capacity Utilisation</Label>
                        <div style={{ background: "var(--color-surface-2)", borderRadius: 8, height: 8, overflow: "hidden" }}>
                          <div style={{
                            width: `${Math.min(100, (+form.stockQuantity / +form.warehouseCapacity) * 100)}%`,
                            height: "100%", borderRadius: 8, transition: "width 0.3s",
                            background: (+form.stockQuantity / +form.warehouseCapacity) > 0.9 ? "var(--color-danger)"
                                      : (+form.stockQuantity / +form.warehouseCapacity) > 0.7 ? "var(--color-warning)"
                                      : "var(--color-success)",
                          }} />
                        </div>
                        <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 4 }}>
                          {form.stockQuantity} / {form.warehouseCapacity} units ({Math.min(100, ((+form.stockQuantity / +form.warehouseCapacity) * 100)).toFixed(1)}%)
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Images */}
              {activeSection === "images" && (
                <div style={{ background: "var(--color-surface)", borderRadius: "var(--radius-lg)", padding: 24, boxShadow: "var(--shadow-sm)" }}>
                  <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700, color: "var(--color-text)" }}>Product Images</h3>
                  <p style={{ margin: "0 0 20px", fontSize: 13, color: "var(--color-text-muted)" }}>
                    Add up to 8 images. The primary image will be shown as the main product photo.
                  </p>
                  {/* Drop Zone */}
                  <div
                    className="pf-drop"
                    style={{ border: `2px dashed ${dragging ? "var(--color-primary)" : errors.images ? "var(--color-danger)" : "var(--color-primary-100)"}`, borderRadius: "var(--radius-lg)", padding: 32, background: dragging ? "var(--color-primary-50)" : "var(--color-surface-2)", textAlign: "center", cursor: "pointer", marginBottom: 20 }}
                    onClick={() => fileRef.current.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
                  >
                    <div style={{ color: "var(--color-primary)", marginBottom: 10, display: "flex", justifyContent: "center" }}><Icon.Upload /></div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "var(--color-text)" }}>Drop images here or click to upload</div>
                    <div style={{ fontSize: 13, color: "var(--color-text-subtle)", marginTop: 4 }}>PNG, JPG, WEBP — max 5 MB each, up to 8 images</div>
                    <input ref={fileRef} type="file" multiple accept="image/*" style={{ display: "none" }} onChange={(e) => addFiles(e.target.files)} />
                  </div>
                  <ErrMsg k="images" />
                  {images.length > 0 && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 12 }}>
                      {images.map((img) => (
                        <div key={img.id} className="img-card" onClick={() => setPrimary(img.id)}
                          style={{ position: "relative", borderRadius: "var(--radius-lg)", overflow: "hidden", border: img.isPrimary ? "2.5px solid var(--color-primary)" : "2px solid var(--color-border)", aspectRatio: "1", cursor: "pointer" }}>
                          <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          <div className="img-overlay" style={{ position: "absolute", inset: 0, background: "rgba(37,99,235,0.7)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.15s" }}>
                            <div style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>Set Primary</div>
                          </div>
                          {img.isPrimary && (
                            <div style={{ position: "absolute", top: 6, left: 6, background: "var(--color-primary)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20, display: "flex", alignItems: "center", gap: 3 }}>
                              <Icon.Star /> Primary
                            </div>
                          )}
                          <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                            style={{ position: "absolute", top: 6, right: 6, width: 22, height: 22, borderRadius: "50%", background: "var(--color-danger)", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Icon.X />
                          </button>
                          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.55)", padding: "4px 6px", fontSize: 10, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {img.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── RIGHT COLUMN ────────────────────── */}
            <div className="pf-right-col" style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Publish Card */}
              <div style={{ background: "var(--color-surface)", borderRadius: "var(--radius-lg)", padding: 20, boxShadow: "var(--shadow-sm)" }}>
                <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, color: "var(--color-text)" }}>Publish Settings</h3>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "var(--color-text)" }}>Active Status</div>
                    <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 2 }}>
                      {form.isActive ? "Visible in catalog" : "Hidden from catalog"}
                    </div>
                  </div>
                  <label style={{ position: "relative", display: "inline-block", width: 44, height: 24, cursor: "pointer" }}>
                    <input type="checkbox" checked={form.isActive} onChange={(e) => field("isActive", e.target.checked)} style={{ opacity: 0, width: 0, height: 0 }} />
                    <span style={{ position: "absolute", inset: 0, borderRadius: 12, background: form.isActive ? "var(--color-primary)" : "var(--color-border-strong)", transition: "background 0.2s" }} />
                    <span style={{ position: "absolute", top: 3, left: form.isActive ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", boxShadow: "var(--shadow-sm)", transition: "left 0.2s" }} />
                  </label>
                </div>

                <button type="submit" className="submit-btn" disabled={saving}
                  style={{ width: "100%", padding: 13, borderRadius: "var(--radius-md)", border: "none", background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 14px rgba(37,99,235,0.35)", transition: "all 0.2s", marginBottom: 10 }}>
                  {saving
                    ? <><span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />Saving…</>
                    : <><Icon.Check />{isEdit ? "Save Changes" : "Create Product"}</>
                  }
                </button>

                <button type="button" onClick={() => navigate("/inventory/products")}
                  style={{ width: "100%", padding: 11, borderRadius: "var(--radius-md)", border: "1.5px solid var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-muted)", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
                  Discard
                </button>
              </div>

              {/* Preview */}
              {(form.name || form.price || images.length > 0) && (
                <div style={{ background: "var(--color-surface)", borderRadius: "var(--radius-lg)", padding: 20, boxShadow: "var(--shadow-sm)" }}>
                  <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700, color: "var(--color-text)" }}>Preview</h3>
                  {images.length > 0 && (
                    <img src={images.find((i) => i.isPrimary)?.url || images[0].url} alt="Primary"
                      style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: "var(--radius-md)", marginBottom: 12, border: "1px solid var(--color-border)" }} />
                  )}
                  <div style={{ fontWeight: 700, fontSize: 15, color: "var(--color-text)", lineHeight: 1.3 }}>{form.name || "—"}</div>
                  {form.category && <div style={{ fontSize: 12, color: "var(--color-primary)", marginTop: 4, fontWeight: 600 }}>{form.category}</div>}
                  {form.price && <div style={{ fontSize: 18, fontWeight: 800, color: "var(--color-text)", marginTop: 8 }}>₹{Number(form.price).toLocaleString("en-IN")}</div>}
                  <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 6 }}>
                    {images.length} image{images.length !== 1 ? "s" : ""} · {form.stockQuantity || "0"} in stock
                  </div>
                </div>
              )}

              {/* Completion Checklist */}
              <div style={{ background: "var(--color-surface)", borderRadius: "var(--radius-lg)", padding: "16px 20px", boxShadow: "var(--shadow-sm)" }}>
                <h3 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Completion</h3>
                {[
                  { label: "Product Name", done: !!form.name },
                  { label: "SKU",          done: !!form.sku },
                  { label: "Category",     done: !!form.category },
                  { label: "Price",        done: !!form.price },
                  { label: "Images",       done: images.length > 0 },
                  { label: "Description",  done: !!form.description },
                  { label: "Inventory",    done: !!form.stockQuantity },
                ].map((c) => (
                  <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: c.done ? "var(--color-success-light)" : "var(--color-surface-2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {c.done && <span style={{ color: "var(--color-success)", fontSize: 11 }}>✓</span>}
                    </div>
                    <span style={{ fontSize: 13, color: c.done ? "var(--color-text)" : "var(--color-text-subtle)", fontWeight: c.done ? 600 : 400 }}>{c.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}