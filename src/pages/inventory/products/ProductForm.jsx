import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useParams }                          from 'react-router-dom'
import { productService }         from '@/services/inventoryService'
import { useCategories }          from '@/hooks/useCategories'
import { useWarehouses }          from '@/hooks/useWarehouses'
import { useToast }               from '@/components/shared/toast/ToastProvider'
import SearchableSelect           from '@/components/shared/SearchableSelect'
import { SpinnerInline }          from '@/components/shared'
import defaultImg                 from '@/assets/images/default.png'
import { getImageUrl } from '@/utils/imageUrl'


/* ── Constants ─────────────────────────────────────────────────────────── */
const MAX_IMAGES       = 8
const MAX_FILE_SIZE_MB = 10
const MAX_FILE_SIZE_B  = MAX_FILE_SIZE_MB * 1024 * 1024
const ALLOWED_TYPES    = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_EXTS     = 'JPEG, JPG, PNG, WEBP, GIF'

/* ── Icons ─────────────────────────────────────────────────────────────── */
const Icon = {
  ArrowLeft:   () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>,
  Upload:      () => <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
  X:           () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>,
  Image:       () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"   viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  Package:     () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"   viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  Warehouse:   () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"   viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  DollarSign:  () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"   viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  Star:        () => <svg width="10" height="10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  Check:       () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
  AlertCircle: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"   viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
}

/* ══════════════════════════════════════════════════════════════════════════
   SUB-COMPONENTS — defined OUTSIDE ProductForm so their identity is stable
   across re-renders and React never unmounts/remounts them on each keystroke.
   ══════════════════════════════════════════════════════════════════════════ */

function Label({ children, req, hint }) {
  return (
    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--color-text)', marginBottom: 6 }}>
      {children}{' '}
      {req  && <span style={{ color: 'var(--color-danger)' }}>*</span>}
      {hint && <span style={{ fontWeight: 400, color: 'var(--color-text-subtle)', fontSize: 11, marginLeft: 4 }}>{hint}</span>}
    </label>
  )
}

function TextField({ name, value, onChange, hasError, style: extraStyle, ...props }) {
  return (
    <input
      {...props}
      name={name}
      value={value}
      onChange={onChange}
      style={{
        width: '100%', padding: '11px 14px',
        border: `1.5px solid ${hasError ? 'var(--color-danger)' : 'var(--color-border)'}`,
        borderRadius: 'var(--radius-md)', fontSize: 14, color: 'var(--color-text)',
        background: 'var(--color-surface)', outline: 'none', transition: 'border-color 0.2s',
        ...extraStyle,
      }}
      className="pf-input"
    />
  )
}

function ErrMsg({ message }) {
  if (!message) return null
  return (
    <div style={{ fontSize: 12, color: 'var(--color-danger)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
      <Icon.AlertCircle />{message}
    </div>
  )
}

function SectionBtn({ sid, label, icon, hasError, isActive, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(sid)}
      style={{
        display: 'flex', alignItems: 'center', gap: 7,
        padding: '8px 14px', borderRadius: 'var(--radius-sm)',
        border:      hasError  ? '1.5px solid var(--color-danger)' : 'none',
        background:  isActive  ? 'var(--color-primary)' : 'transparent',
        color:       isActive  ? '#fff' : hasError ? 'var(--color-danger)' : 'var(--color-text-muted)',
        fontWeight: 600, fontSize: 13, cursor: 'pointer',
        transition: 'all 0.15s', whiteSpace: 'nowrap', flexShrink: 0,
      }}
    >
      {icon} {label}
    </button>
  )
}

/* ── Main component ────────────────────────────────────────────────────── */
export default function ProductForm() {
  const navigate = useNavigate()
  const { id }   = useParams()
  const isEdit   = !!id
  const toast    = useToast()
  const fileRef  = useRef(null)

  /* ── Form state ───────────────────────────────────────────────── */
  const [form, setForm] = useState({
    name: '', sku: '', categoryId: null, description: '',
    price: '', costPrice: '', weight: '', unit: 'piece',
    hsnCode: '', gstPercent: '', isActive: true,
    warehouseId: null, stockQuantity: '', stockAlert: '', warehouseCapacity: '',
  })

  const [existingImages,  setExistingImages]  = useState([])
  const [removeImageIds,  setRemoveImageIds]  = useState([])
  const [newImageFiles,   setNewImageFiles]   = useState([])

  const { categories, loading: catLoading, error: catError } = useCategories()
  const { warehouses, loading: whLoading,  error: whError  } = useWarehouses()

  const [errors,        setErrors]        = useState({})
  const [saving,        setSaving]        = useState(false)
  const [loadingPage,   setLoadingPage]   = useState(isEdit)
  const [dragging,      setDragging]      = useState(false)
  const [activeSection, setActiveSection] = useState('basic')

  /* ── Surface hook errors via toast ───────────────────────────── */
  useEffect(() => {
    if (catError) toast({ type: 'warning', title: 'Could not load categories', message: catError })
  }, [catError, toast])

  useEffect(() => {
    if (whError) toast({ type: 'warning', title: 'Could not load warehouses', message: whError })
  }, [whError, toast])

  /* ── Load product (edit mode) ─────────────────────────────────── */
  const fetchProduct = useCallback(async () => {
    if (!isEdit) return
    setLoadingPage(true)
    try {
      const res = await productService.getById(id)
      const p   = res.data?.data ?? res.data
      if (!p) throw new Error('Not found')
      setForm({
        name:              p.name              ?? '',
        sku:               p.productCode       ?? '',
        categoryId:        p.categoryId        ?? null,
        description:       p.description       ?? '',
        price:             p.sellingPrice      != null ? String(p.sellingPrice)  : '',
        costPrice:         p.purchasePrice     != null ? String(p.purchasePrice) : '',
        weight:            p.weight            != null ? String(p.weight)        : '',
        unit:              p.unit              ?? 'piece',
        hsnCode:           p.hsnCode           ?? '',
        gstPercent:        p.gstPercent        != null ? String(p.gstPercent)    : '',
        isActive:          p.isActive          ?? true,
        warehouseId:       p.inventories?.[0]?.warehouseId       ?? null,
        stockQuantity:     p.inventories?.[0]?.stockQuantity     != null ? String(p.inventories[0].stockQuantity)     : '',
        stockAlert:        p.inventories?.[0]?.stockAlert        != null ? String(p.inventories[0].stockAlert)        : '',
        warehouseCapacity: p.inventories?.[0]?.warehouseCapacity != null ? String(p.inventories[0].warehouseCapacity) : '',
      })
      setExistingImages(p.images ?? [])
    } catch (err) {
      toast({ type: 'error', title: 'Failed to load product', message: err?.response?.data?.message ?? 'Please try again.' })
      navigate('/inventory/products')
    } finally {
      setLoadingPage(false)
    }
  }, [id, isEdit, toast, navigate])

  useEffect(() => { fetchProduct() }, [fetchProduct])

  /* ── Field change helper ──────────────────────────────────────── */
  const field = useCallback((k, v) => {
    setForm(f  => ({ ...f,  [k]: v }))
    setErrors(e => ({ ...e, [k]: '' }))
  }, [])

  /* ── Image helpers ────────────────────────────────────────────── */
  const totalImgCount  = existingImages.filter(i => !removeImageIds.includes(i.id)).length + newImageFiles.length
  const visibleExisting = existingImages.filter(i => !removeImageIds.includes(i.id))

  const validateFiles = (files) => {
    const results = { valid: [], errors: [] }
    Array.from(files).forEach(file => {
      if (!ALLOWED_TYPES.includes(file.type?.toLowerCase())) {
        results.errors.push(`"${file.name}": unsupported format. Allowed: ${ALLOWED_EXTS}`)
        return
      }
      if (file.size > MAX_FILE_SIZE_B) {
        results.errors.push(`"${file.name}": exceeds ${MAX_FILE_SIZE_MB} MB limit`)
        return
      }
      results.valid.push(file)
    })
    return results
  }

  const addFiles = (files) => {
    const { valid, errors: fileErrors } = validateFiles(files)
    if (fileErrors.length) toast({ type: 'error', title: 'Some files were rejected', message: fileErrors.join(' | ') })
    const remaining = MAX_IMAGES - totalImgCount
    const toAdd     = valid.slice(0, remaining)
    if (valid.length > remaining) toast({ type: 'warning', title: `Max ${MAX_IMAGES} images allowed`, message: `${valid.length - remaining} file(s) were not added.` })
    if (!toAdd.length) return
    const newEntries = toAdd.map((file, i) => ({
      id: `new-${Date.now()}-${i}`, file,
      previewUrl: URL.createObjectURL(file), name: file.name,
    }))
    setNewImageFiles(prev => [...prev, ...newEntries])
    setErrors(e => ({ ...e, images: '' }))
  }

  const removeExistingImage = (imgId) => setRemoveImageIds(prev => [...prev, imgId])

  const removeNewImage = (tmpId) => {
    setNewImageFiles(prev => {
      const img = prev.find(i => i.id === tmpId)
      if (img) URL.revokeObjectURL(img.previewUrl)
      return prev.filter(i => i.id !== tmpId)
    })
  }

  const setPrimaryExisting = (imgId) => {
    setExistingImages(prev => prev.map(i => ({ ...i, isPrimary: i.id === imgId })))
    setNewImageFiles(prev  => prev.map(i => ({ ...i, _isPrimary: false })))
  }

  const setPrimaryNew = (tmpId) => {
    setExistingImages(prev => prev.map(i => ({ ...i, isPrimary: false })))
    setNewImageFiles(prev  => prev.map(i => ({ ...i, _isPrimary: i.id === tmpId })))
  }

  /* ── Validation ───────────────────────────────────────────────── */
  const validate = () => {
    const e = {}
    if (!form.name.trim())                                  e.name       = 'Product name is required.'
    if (!form.sku.trim())                                   e.sku        = 'SKU / product code is required.'
    if (!form.categoryId)                                   e.categoryId = 'Select a category.'
    if (!form.price)                                        e.price      = 'Selling price is required.'
    else if (isNaN(form.price) || Number(form.price) < 0)  e.price      = 'Enter a valid price.'
    if (!isEdit && totalImgCount === 0)                     e.images     = 'At least one product image is required.'
    return e
  }

  /* ── Submit ───────────────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      setActiveSection(errs.name || errs.sku || errs.categoryId ? 'basic' : errs.price ? 'pricing' : errs.images ? 'images' : 'basic')
      return
    }
    setSaving(true)
    try {
      const requestData = {
        name:              form.name.trim(),
        productCode:       form.sku.trim().toUpperCase(),
        categoryId:        form.categoryId        ? Number(form.categoryId)        : null,
        unit:              form.unit              || null,
        purchasePrice:     form.costPrice         ? Number(form.costPrice)         : null,
        sellingPrice:      form.price             ? Number(form.price)             : null,
        weight:            form.weight            ? Number(form.weight)            : null,
        hsnCode:           form.hsnCode           || null,
        gstPercent:        form.gstPercent        ? Number(form.gstPercent)        : null,
        description:       form.description       || null,
        isActive:          form.isActive,
        status:            form.isActive ? 'PUBLISHED' : 'DRAFT',
        warehouseId:       form.warehouseId       ? Number(form.warehouseId)       : null,
        stockQuantity:     form.stockQuantity     ? Number(form.stockQuantity)     : 0,
        stockAlert:        form.stockAlert        ? Number(form.stockAlert)        : null,
        warehouseCapacity: form.warehouseCapacity ? Number(form.warehouseCapacity) : null,
        minimumStock:      form.stockAlert        ? Number(form.stockAlert)        : 0,
        ...(isEdit && { removeImageIds }),
      }
      const imageFiles = newImageFiles.map(i => i.file)
      if (isEdit) {
        await productService.update(id, requestData, imageFiles)
        toast({ type: 'success', title: 'Product updated', message: `"${form.name}" has been saved successfully.` })
      } else {
        await productService.create(requestData, imageFiles)
        toast({ type: 'success', title: 'Product created', message: `"${form.name}" has been added to inventory.` })
      }
      navigate('/inventory/products')
    } catch (err) {
      toast({ type: 'error', title: isEdit ? 'Update failed' : 'Create failed', message: err?.response?.data?.message ?? 'Something went wrong. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  /* ── Derived ──────────────────────────────────────────────────── */
  const categoryOptions = categories.map(c => ({ value: c.id, label: c.name }))
  const warehouseOptions = warehouses.map(w => ({ value: w.id, label: w.name + (w.code ? ` (${w.code})` : '') }))
  const marginAmt = form.price && form.costPrice && Number(form.price) > Number(form.costPrice)
    ? Number(form.price) - Number(form.costPrice) : null
  const marginPct = marginAmt ? ((marginAmt / Number(form.price)) * 100).toFixed(1) : null

  const selectStyle = (hasError) => ({
    width: '100%', padding: '11px 14px',
    border: `1.5px solid ${hasError ? 'var(--color-danger)' : 'var(--color-border)'}`,
    borderRadius: 'var(--radius-md)', fontSize: 14, color: 'var(--color-text)',
    background: 'var(--color-surface)', outline: 'none',
  })

  /* ── Loading skeleton ─────────────────────────────────────────── */
  if (loadingPage) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <SpinnerInline message="Loading product…" />
      </div>
    )
  }

  /* ── Render ───────────────────────────────────────────────────── */
  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        .pf-container   { min-height: 100vh; background: var(--color-bg); padding: 28px 32px; }
        .pf-page-header { display: flex; align-items: center; gap: 14px; margin-bottom: 28px; }
        .pf-main-grid   { display: grid; grid-template-columns: 1fr 340px; gap: 20px; align-items: start; }
        .pf-tabs        { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 2px; -webkit-overflow-scrolling: touch; }
        .pf-tabs::-webkit-scrollbar { height: 0; }
        .pf-inner-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .pf-full        { grid-column: 1 / -1; }
        .pf-input:focus { border-color: var(--color-primary) !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.12) !important; }
        .pf-drop        { transition: all 0.2s; }
        .pf-drop:hover  { border-color: var(--color-primary) !important; background: var(--color-primary-50) !important; }
        .img-card       { transition: transform 0.15s; }
        .img-card:hover .img-overlay { opacity: 1 !important; }
        .img-card:hover { transform: scale(1.03); }
        .submit-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(37,99,235,0.4) !important; }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 900px)  { .pf-main-grid { grid-template-columns: 1fr !important; } .pf-right-col { order: -1; } }
        @media (max-width: 640px)  { .pf-container { padding: 14px !important; } .pf-page-header { margin-bottom: 18px !important; } .pf-inner-grid { grid-template-columns: 1fr !important; } .pf-full { grid-column: 1 !important; } }
        @media (max-width: 400px)  { .pf-container { padding: 10px !important; } }
      `}</style>

      <div className="pf-container">

        {/* Page Header */}
        <div className="pf-page-header">
          <button onClick={() => navigate('/inventory/products')}
            style={{ width: 38, height: 38, borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', background: 'var(--color-surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', flexShrink: 0 }}>
            <Icon.ArrowLeft />
          </button>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text)', margin: 0, letterSpacing: '-0.4px' }}>
              {isEdit ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p style={{ fontSize: 13, color: 'var(--color-text-subtle)', margin: '3px 0 0' }}>
              <a href="#" onClick={e => { e.preventDefault(); navigate('/inventory/products') }} style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Inventory</a> ›{' '}
              <a href="#" onClick={e => { e.preventDefault(); navigate('/inventory/products') }} style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Products</a> › {isEdit ? 'Edit' : 'Add'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="pf-main-grid">

            {/* ── LEFT COLUMN ─────────────────────────────────── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Section Tabs */}
              <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: '12px 16px', boxShadow: 'var(--shadow-sm)' }}>
                <div className="pf-tabs">
                  <SectionBtn sid="basic"     label="Basic Info"  icon={<Icon.Package />}    hasError={!!(errors.name || errors.sku || errors.categoryId)} isActive={activeSection === 'basic'}     onClick={setActiveSection} />
                  <SectionBtn sid="pricing"   label="Pricing"     icon={<Icon.DollarSign />} hasError={!!errors.price}                                      isActive={activeSection === 'pricing'}   onClick={setActiveSection} />
                  <SectionBtn sid="inventory" label="Inventory"   icon={<Icon.Warehouse />}  hasError={false}                                               isActive={activeSection === 'inventory'} onClick={setActiveSection} />
                  <SectionBtn sid="images"    label="Images"      icon={<Icon.Image />}      hasError={!!errors.images}                                     isActive={activeSection === 'images'}    onClick={setActiveSection} />
                </div>
              </div>

              {/* ── Basic Info ────────────────────────────────── */}
              {activeSection === 'basic' && (
                <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: 'var(--shadow-sm)' }}>
                  <h3 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 700, color: 'var(--color-text)', paddingBottom: 12, borderBottom: '1px solid var(--color-surface-2)' }}>Basic Information</h3>
                  <div className="pf-inner-grid">

                    <div className="pf-full">
                      <Label req>Product Name</Label>
                      <TextField name="name" value={form.name} onChange={e => field('name', e.target.value)} hasError={!!errors.name} placeholder="Enter product name" />
                      <ErrMsg message={errors.name} />
                    </div>

                    <div>
                      <Label req>SKU / Product Code</Label>
                      <TextField name="sku" value={form.sku} onChange={e => field('sku', e.target.value)} hasError={!!errors.sku} placeholder="e.g. PRD-0001" />
                      <ErrMsg message={errors.sku} />
                    </div>

                    <div>
                      <Label req>Category</Label>
                      <SearchableSelect
                        options={categoryOptions}
                        value={form.categoryId}
                        onChange={val => field('categoryId', val)}
                        placeholder="Select category…"
                        loading={catLoading}
                        error={errors.categoryId}
                      />
                      <ErrMsg message={errors.categoryId} />
                    </div>

                    <div>
                      <Label>Unit</Label>
                      <select value={form.unit} onChange={e => field('unit', e.target.value)} style={selectStyle(false)} className="pf-input">
                        <option value="piece">Piece</option>
                        <option value="kg">Kilogram (kg)</option>
                        <option value="litre">Litre</option>
                        <option value="box">Box</option>
                        <option value="set">Set</option>
                        <option value="meter">Meter</option>
                      </select>
                    </div>

                    <div>
                      <Label hint="(optional)">Weight (kg)</Label>
                      <TextField name="weight" value={form.weight} onChange={e => field('weight', e.target.value)} hasError={false} placeholder="0.000" type="number" min="0" step="0.001" />
                    </div>

                    <div>
                      <Label hint="(optional)">HSN Code</Label>
                      <TextField name="hsnCode" value={form.hsnCode} onChange={e => field('hsnCode', e.target.value)} hasError={false} placeholder="e.g. 8518" />
                    </div>

                    <div>
                      <Label hint="(optional)">GST %</Label>
                      <TextField name="gstPercent" value={form.gstPercent} onChange={e => field('gstPercent', e.target.value)} hasError={false} placeholder="e.g. 18" type="number" min="0" max="100" step="0.01" />
                    </div>

                    <div className="pf-full">
                      <Label>Description</Label>
                      <textarea
                        value={form.description}
                        onChange={e => field('description', e.target.value)}
                        placeholder="Product description, features, specifications…"
                        style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: 14, color: 'var(--color-text)', background: 'var(--color-surface)', outline: 'none', resize: 'vertical', minHeight: 100, lineHeight: 1.6 }}
                        className="pf-input"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ── Pricing ───────────────────────────────────── */}
              {activeSection === 'pricing' && (
                <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: 'var(--shadow-sm)' }}>
                  <h3 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 700, color: 'var(--color-text)', paddingBottom: 12, borderBottom: '1px solid var(--color-surface-2)' }}>Pricing Details</h3>
                  <div className="pf-inner-grid">
                    <div>
                      <Label req>Selling Price (₹)</Label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)', fontSize: 14, fontWeight: 600 }}>₹</span>
                        <TextField name="price" value={form.price} onChange={e => field('price', e.target.value)} hasError={!!errors.price} placeholder="0.00" type="number" min="0" step="0.01" style={{ paddingLeft: 26 }} />
                      </div>
                      <ErrMsg message={errors.price} />
                    </div>
                    <div>
                      <Label>Cost / Purchase Price (₹)</Label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)', fontSize: 14, fontWeight: 600 }}>₹</span>
                        <TextField name="costPrice" value={form.costPrice} onChange={e => field('costPrice', e.target.value)} hasError={false} placeholder="0.00" type="number" min="0" step="0.01" style={{ paddingLeft: 26 }} />
                      </div>
                    </div>
                    {marginAmt != null && (
                      <div className="pf-full" style={{ background: 'var(--color-success-light)', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-md)', padding: '12px 16px' }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#166534' }}>
                          Margin: ₹{marginAmt.toLocaleString('en-IN')} &nbsp;({marginPct}%)
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── Inventory ─────────────────────────────────── */}
              {activeSection === 'inventory' && (
                <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: 'var(--shadow-sm)' }}>
                  <h3 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 700, color: 'var(--color-text)', paddingBottom: 12, borderBottom: '1px solid var(--color-surface-2)' }}>Inventory &amp; Warehouse</h3>
                  <div className="pf-inner-grid">
                    <div className="pf-full">
                      <Label>Warehouse</Label>
                      <SearchableSelect
                        options={warehouseOptions}
                        value={form.warehouseId}
                        onChange={val => field('warehouseId', val)}
                        placeholder="Select warehouse…"
                        loading={whLoading}
                      />
                    </div>
                    <div>
                      <Label>Stock Quantity</Label>
                      <TextField name="stockQuantity" value={form.stockQuantity} onChange={e => field('stockQuantity', e.target.value)} hasError={false} placeholder="0" type="number" min="0" />
                    </div>
                    <div>
                      <Label hint="(low-stock trigger)">Stock Alert Threshold</Label>
                      <TextField name="stockAlert" value={form.stockAlert} onChange={e => field('stockAlert', e.target.value)} hasError={false} placeholder="e.g. 20" type="number" min="0" />
                    </div>
                    <div>
                      <Label>Warehouse Capacity</Label>
                      <TextField name="warehouseCapacity" value={form.warehouseCapacity} onChange={e => field('warehouseCapacity', e.target.value)} hasError={false} placeholder="e.g. 500" type="number" min="0" />
                    </div>
                    {form.stockQuantity && form.warehouseCapacity && Number(form.warehouseCapacity) > 0 && (
                      <div className="pf-full">
                        <Label>Capacity Utilisation</Label>
                        <div style={{ background: 'var(--color-surface-2)', borderRadius: 8, height: 8, overflow: 'hidden' }}>
                          <div style={{
                            width: `${Math.min(100, (Number(form.stockQuantity) / Number(form.warehouseCapacity)) * 100)}%`,
                            height: '100%', borderRadius: 8, transition: 'width 0.3s',
                            background: Number(form.stockQuantity) / Number(form.warehouseCapacity) > 0.9 ? 'var(--color-danger)'
                                      : Number(form.stockQuantity) / Number(form.warehouseCapacity) > 0.7 ? 'var(--color-warning)'
                                      : 'var(--color-success)',
                          }} />
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
                          {form.stockQuantity} / {form.warehouseCapacity} units ({Math.min(100, ((Number(form.stockQuantity) / Number(form.warehouseCapacity)) * 100)).toFixed(1)}%)
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── Images ────────────────────────────────────── */}
              {activeSection === 'images' && (
                <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: 'var(--shadow-sm)' }}>
                  <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700, color: 'var(--color-text)' }}>Product Images</h3>
                  <p style={{ margin: '0 0 20px', fontSize: 13, color: 'var(--color-text-muted)' }}>
                    Up to {MAX_IMAGES} images · Allowed: {ALLOWED_EXTS} · Max {MAX_FILE_SIZE_MB} MB each.
                    {totalImgCount > 0 && <> · <strong style={{ color: 'var(--color-primary)' }}>{totalImgCount}/{MAX_IMAGES}</strong> added</>}
                  </p>

                  {totalImgCount < MAX_IMAGES && (
                    <div
                      className="pf-drop"
                      style={{ border: `2px dashed ${dragging ? 'var(--color-primary)' : errors.images ? 'var(--color-danger)' : 'var(--color-primary-100)'}`, borderRadius: 'var(--radius-lg)', padding: 32, background: dragging ? 'var(--color-primary-50)' : 'var(--color-surface-2)', textAlign: 'center', cursor: 'pointer', marginBottom: 20 }}
                      onClick={() => fileRef.current.click()}
                      onDragOver={e => { e.preventDefault(); setDragging(true) }}
                      onDragLeave={() => setDragging(false)}
                      onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files) }}
                    >
                      <div style={{ color: 'var(--color-primary)', marginBottom: 10, display: 'flex', justifyContent: 'center' }}><Icon.Upload /></div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-text)' }}>Drop images here or click to upload</div>
                      <div style={{ fontSize: 13, color: 'var(--color-text-subtle)', marginTop: 4 }}>{ALLOWED_EXTS} — max {MAX_FILE_SIZE_MB} MB each, up to {MAX_IMAGES} images</div>
                      <input ref={fileRef} type="file" multiple accept={ALLOWED_TYPES.join(',')} style={{ display: 'none' }} onChange={e => addFiles(e.target.files)} />
                    </div>
                  )}
                  <ErrMsg message={errors.images} />

                  {(visibleExisting.length > 0 || newImageFiles.length > 0) && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 12 }}>
                      {visibleExisting.map(img => (
                        <div key={img.id} className="img-card" onClick={() => setPrimaryExisting(img.id)}
                          style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: img.isPrimary ? '2.5px solid var(--color-primary)' : '2px solid var(--color-border)', aspectRatio: '1', cursor: 'pointer' }}>
                          <img src={getImageUrl(img.imageUrl) || defaultImg} alt="" onError={e => { e.target.onerror = null; e.target.src = defaultImg }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <div className="img-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(37,99,235,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.15s' }}>
                            <div style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>Set Primary</div>
                          </div>
                          {img.isPrimary && (
                            <div style={{ position: 'absolute', top: 6, left: 6, background: 'var(--color-primary)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 3 }}>
                              <Icon.Star /> Primary
                            </div>
                          )}
                          <button type="button" onClick={e => { e.stopPropagation(); removeExistingImage(img.id) }}
                            style={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: '50%', background: 'var(--color-danger)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon.X />
                          </button>
                          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.55)', padding: '4px 6px', fontSize: 10, color: '#fff' }}>Saved</div>
                        </div>
                      ))}
                      {newImageFiles.map(img => (
                        <div key={img.id} className="img-card" onClick={() => setPrimaryNew(img.id)}
                          style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: img._isPrimary ? '2.5px solid var(--color-primary)' : '2px solid var(--color-border)', aspectRatio: '1', cursor: 'pointer' }}>
                          <img src={img.previewUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <div className="img-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(37,99,235,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.15s' }}>
                            <div style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>Set Primary</div>
                          </div>
                          {img._isPrimary && (
                            <div style={{ position: 'absolute', top: 6, left: 6, background: 'var(--color-primary)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 3 }}>
                              <Icon.Star /> Primary
                            </div>
                          )}
                          <button type="button" onClick={e => { e.stopPropagation(); removeNewImage(img.id) }}
                            style={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: '50%', background: 'var(--color-danger)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon.X />
                          </button>
                          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.55)', padding: '4px 6px', fontSize: 10, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {img.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── RIGHT COLUMN ─────────────────────────────────── */}
            <div className="pf-right-col" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Publish Card */}
              <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 20, boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>Publish Settings</h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-text)' }}>Active Status</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>{form.isActive ? 'Visible in catalog' : 'Hidden from catalog'}</div>
                  </div>
                  <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24, cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.isActive} onChange={e => field('isActive', e.target.checked)} style={{ opacity: 0, width: 0, height: 0 }} />
                    <span style={{ position: 'absolute', inset: 0, borderRadius: 12, background: form.isActive ? 'var(--color-primary)' : 'var(--color-border-strong)', transition: 'background 0.2s' }} />
                    <span style={{ position: 'absolute', top: 3, left: form.isActive ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', boxShadow: 'var(--shadow-sm)', transition: 'left 0.2s' }} />
                  </label>
                </div>
                <button type="submit" className="submit-btn" disabled={saving}
                  style={{ width: '100%', padding: 13, borderRadius: 'var(--radius-md)', border: 'none', background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 14px rgba(37,99,235,0.35)', transition: 'all 0.2s', marginBottom: 10 }}>
                  {saving
                    ? <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />Saving…</>
                    : <><Icon.Check />{isEdit ? 'Save Changes' : 'Create Product'}</>
                  }
                </button>
                <button type="button" onClick={() => navigate('/inventory/products')}
                  style={{ width: '100%', padding: 11, borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-muted)', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
                  Discard
                </button>
              </div>

              {/* Live Preview */}
              {(form.name || form.price || visibleExisting.length > 0 || newImageFiles.length > 0) && (
                <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 20, boxShadow: 'var(--shadow-sm)' }}>
                  <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>Preview</h3>
                  {(visibleExisting.length > 0 || newImageFiles.length > 0) && (() => {
                    const src = getImageUrl(visibleExisting.find(i => i.isPrimary)?.imageUrl)
                             || newImageFiles.find(i => i._isPrimary)?.previewUrl
                             || visibleExisting[0]?.imageUrl
                             || newImageFiles[0]?.previewUrl
                             || defaultImg
                    return <img src={src} alt="Preview" onError={e => { e.target.onerror = null; e.target.src = defaultImg }} style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: 12, border: '1px solid var(--color-border)' }} />
                  })()}
                  <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-text)', lineHeight: 1.3 }}>{form.name || '—'}</div>
                  {form.categoryId && categories.find(c => c.id === form.categoryId) && (
                    <div style={{ fontSize: 12, color: 'var(--color-primary)', marginTop: 4, fontWeight: 600 }}>{categories.find(c => c.id === form.categoryId)?.name}</div>
                  )}
                  {form.price && <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-text)', marginTop: 8 }}>₹{Number(form.price).toLocaleString('en-IN')}</div>}
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 6 }}>{totalImgCount} image{totalImgCount !== 1 ? 's' : ''} · {form.stockQuantity || '0'} in stock</div>
                </div>
              )}

              {/* Completion Checklist */}
              <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Completion</h3>
                {[
                  { label: 'Product Name', done: !!form.name.trim() },
                  { label: 'SKU',          done: !!form.sku.trim()  },
                  { label: 'Category',     done: !!form.categoryId  },
                  { label: 'Price',        done: !!form.price       },
                  { label: 'Images',       done: totalImgCount > 0  },
                  { label: 'Description',  done: !!form.description },
                  { label: 'Inventory',    done: !!form.stockQuantity },
                ].map(c => (
                  <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: c.done ? 'var(--color-success-light)' : 'var(--color-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {c.done && <span style={{ color: 'var(--color-success)', fontSize: 11 }}>✓</span>}
                    </div>
                    <span style={{ fontSize: 13, color: c.done ? 'var(--color-text)' : 'var(--color-text-subtle)', fontWeight: c.done ? 600 : 400 }}>{c.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}