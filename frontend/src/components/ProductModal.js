import React, { useState, useEffect } from 'react';
import './ProductModal.css';

/**
 * ProductModal — used by Admin to create or edit a product.
 */
export default function ProductModal({ product, onSave, onClose, loading }) {
  const [form, setForm] = useState({
    name: '', description: '', price: '', category: '',
    imageUrl: '', stock: '', rating: '', reviewCount: '',
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '',
        imageUrl: product.imageUrl || '',
        stock: product.stock || '',
        rating: product.rating || '',
        reviewCount: product.reviewCount || '',
      });
    }
  }, [product]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock) || 0,
      rating: form.rating ? parseFloat(form.rating) : null,
      reviewCount: form.reviewCount ? parseInt(form.reviewCount) : null,
    });
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box fade-in">
        <div className="modal-header">
          <h2>{product?.id ? 'Edit Product' : 'Add New Product'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Product Name *</label>
              <input name="name" value={form.name} onChange={handleChange}
                className="form-input" placeholder="iPhone 15 Pro" required />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <input name="category" value={form.category} onChange={handleChange}
                className="form-input" placeholder="Electronics" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              className="form-input" placeholder="Product description..." rows={3} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Price (₹) *</label>
              <input name="price" type="number" min="0" step="0.01" value={form.price}
                onChange={handleChange} className="form-input" placeholder="29999" required />
            </div>
            <div className="form-group">
              <label className="form-label">Stock</label>
              <input name="stock" type="number" min="0" value={form.stock}
                onChange={handleChange} className="form-input" placeholder="100" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Rating (0-5)</label>
              <input name="rating" type="number" min="0" max="5" step="0.1" value={form.rating}
                onChange={handleChange} className="form-input" placeholder="4.5" />
            </div>
            <div className="form-group">
              <label className="form-label">Review Count</label>
              <input name="reviewCount" type="number" min="0" value={form.reviewCount}
                onChange={handleChange} className="form-input" placeholder="1234" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Image URL</label>
            <input name="imageUrl" value={form.imageUrl} onChange={handleChange}
              className="form-input" placeholder="https://..." />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : (product?.id ? 'Update Product' : 'Create Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
