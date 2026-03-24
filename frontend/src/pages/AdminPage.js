import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import ProductModal from '../components/ProductModal';
import productService from '../services/productService';
import './AdminPage.css';

/**
 * AdminPage — full product management table for ROLE_ADMIN users.
 * Shows all products in a table with inline Edit/Delete actions,
 * plus summary stats cards at the top.
 */
export default function AdminPage() {
  const [products, setProducts]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [modalOpen, setModalOpen]     = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [saving, setSaving]           = useState(false);
  const [search, setSearch]           = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productService.getAll();
      setProducts(res.data);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(search.toLowerCase())
  );

  // ── Stats ────────────────────────────────────────────────────────────────
  const totalValue = products.reduce((sum, p) => sum + (parseFloat(p.price) * (p.stock || 0)), 0);
  const categories = new Set(products.map(p => p.category).filter(Boolean)).size;
  const outOfStock = products.filter(p => (p.stock || 0) === 0).length;

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  // ── CRUD ─────────────────────────────────────────────────────────────────
  const openAdd  = () => { setEditProduct(null); setModalOpen(true); };
  const openEdit = (p) => { setEditProduct(p); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditProduct(null); };

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (editProduct?.id) {
        await productService.update(editProduct.id, form);
        toast.success('Product updated!');
      } else {
        await productService.create(form);
        toast.success('Product created!');
      }
      closeModal();
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await productService.delete(id);
      toast.success('Product deleted');
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="admin-main">
        <div className="container">

          {/* Page header */}
          <div className="admin-header fade-in">
            <div>
              <h1 className="admin-title">⚙️ Admin Panel</h1>
              <p className="admin-subtitle">Manage products, inventory, and catalogue.</p>
            </div>
            <button className="btn btn-primary" onClick={openAdd}>
              + Add Product
            </button>
          </div>

          {/* Stats cards */}
          <div className="stats-grid fade-in">
            <StatCard icon="📦" label="Total Products" value={products.length} />
            <StatCard icon="🏷️" label="Categories"    value={categories} />
            <StatCard icon="⚠️" label="Out of Stock"  value={outOfStock} warn={outOfStock > 0} />
            <StatCard icon="💰" label="Total Value"   value={formatPrice(totalValue)} />
          </div>

          {/* Table */}
          <div className="admin-table-card fade-in">
            <div className="table-toolbar">
              <h2 className="table-title">Product Inventory</h2>
              <input
                type="text"
                className="form-input table-search"
                placeholder="Search products…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="loading-center" style={{ minHeight: 200 }}>
                <div className="spinner" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="table-empty">
                <span>📭</span>
                <p>{search ? `No results for "${search}"` : 'No products yet. Add one!'}</p>
              </div>
            ) : (
              <div className="table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Rating</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(p => (
                      <tr key={p.id} className="table-row">
                        <td className="cell-id">#{p.id}</td>
                        <td className="cell-product">
                          <div className="product-thumb">
                            <img
                              src={p.imageUrl || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=60'}
                              alt={p.name}
                              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=60'; }}
                            />
                            <div>
                              <span className="product-thumb-name">{p.name}</span>
                              <span className="product-thumb-desc">{(p.description || '').substring(0, 50)}{p.description?.length > 50 ? '…' : ''}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          {p.category
                            ? <span className="cell-category">{p.category}</span>
                            : <span className="text-muted">—</span>}
                        </td>
                        <td className="cell-price">{formatPrice(p.price)}</td>
                        <td>
                          <span className={`stock-badge ${p.stock === 0 ? 'stock-zero' : p.stock < 10 ? 'stock-low' : 'stock-ok'}`}>
                            {p.stock === 0 ? 'Out of Stock' : p.stock < 10 ? `Low (${p.stock})` : p.stock}
                          </span>
                        </td>
                        <td>
                          {p.rating
                            ? <span className="cell-rating">⭐ {p.rating.toFixed(1)}</span>
                            : <span className="text-muted">—</span>}
                        </td>
                        <td>
                          <div className="row-actions">
                            <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}>
                              ✏️ Edit
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id, p.name)}>
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && filtered.length > 0 && (
              <div className="table-footer">
                Showing {filtered.length} of {products.length} products
              </div>
            )}
          </div>
        </div>
      </main>

      {modalOpen && (
        <ProductModal
          product={editProduct}
          onSave={handleSave}
          onClose={closeModal}
          loading={saving}
        />
      )}
    </div>
  );
}

function StatCard({ icon, label, value, warn }) {
  return (
    <div className={`stat-card ${warn ? 'stat-warn' : ''}`}>
      <span className="stat-icon">{icon}</span>
      <div>
        <p className="stat-value">{value}</p>
        <p className="stat-label">{label}</p>
      </div>
    </div>
  );
}
