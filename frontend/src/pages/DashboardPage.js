import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import productService from '../services/productService';
import './Dashboard.css';

/**
 * Dashboard — main product listing page.
 * - All users: view products, search, filter by category
 * - Admin: add, edit, delete products
 */
export default function DashboardPage() {
  const { isAdmin, user } = useAuth();

  const [products, setProducts]       = useState([]);
  const [filtered, setFiltered]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [category, setCategory]       = useState('All');
  const [modalOpen, setModalOpen]     = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [saving, setSaving]           = useState(false);

  // Load all products on mount
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

  // Filter products by search and category
  useEffect(() => {
    let result = products;
    if (category !== 'All') {
      result = result.filter(p => p.category === category);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [products, search, category]);

  // Derive unique categories from products
  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

  // ── CRUD Handlers ──────────────────────────────────────────────────────────

  const openAddModal = () => { setEditProduct(null); setModalOpen(true); };
  const openEditModal = (product) => { setEditProduct(product); setModalOpen(true); };
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
      const msg = err.response?.data?.message || 'Failed to save product';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
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

      <main className="dashboard-main">
        <div className="container">

          {/* Page header */}
          <div className="dashboard-header fade-in">
            <div>
              <h1 className="dashboard-title">
                {isAdmin ? '🛠️ Product Management' : '🛍️ Shop'}
              </h1>
              <p className="dashboard-subtitle">
                {isAdmin
                  ? `Manage your inventory — ${products.length} product${products.length !== 1 ? 's' : ''} total`
                  : `Hello ${user?.firstName || user?.username}! Browse our collection.`}
              </p>
            </div>
            {isAdmin && (
              <button className="btn btn-primary" onClick={openAddModal}>
                + Add Product
              </button>
            )}
          </div>

          {/* Search + Filter bar */}
          <div className="filter-bar fade-in">
            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search products…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button className="search-clear" onClick={() => setSearch('')}>✕</button>
              )}
            </div>

            <div className="category-pills">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`category-pill ${category === cat ? 'active' : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product grid */}
          {loading ? (
            <div className="loading-center" style={{ minHeight: 300 }}>
              <div className="spinner" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state fade-in">
              <span className="empty-icon">📦</span>
              <h3>No products found</h3>
              <p>{search ? `No results for "${search}"` : 'No products in this category yet.'}</p>
              {isAdmin && (
                <button className="btn btn-primary" onClick={openAddModal}>Add First Product</button>
              )}
            </div>
          ) : (
            <>
              <p className="result-count fade-in">
                Showing <strong>{filtered.length}</strong> product{filtered.length !== 1 ? 's' : ''}
                {category !== 'All' && ` in ${category}`}
                {search && ` matching "${search}"`}
              </p>
              <div className="product-grid">
                {filtered.map((product, i) => (
                  <div key={product.id} style={{ animationDelay: `${i * 0.06}s` }}>
                    <ProductCard
                      product={product}
                      isAdmin={isAdmin}
                      onEdit={openEditModal}
                      onDelete={handleDelete}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Product modal (admin only) */}
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
