import React from 'react';
import './ProductCard.css';

/**
 * ProductCard — displays a single product in the grid.
 * Admin users see Edit/Delete buttons.
 */
export default function ProductCard({ product, isAdmin, onEdit, onDelete }) {
  const stars = (rating) => {
    const full = Math.floor(rating || 0);
    const half = (rating || 0) - full >= 0.5;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - (half ? 1 : 0));
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  return (
    <div className="product-card fade-in">
      <div className="product-image-wrap">
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400'}
          alt={product.name}
          className="product-image"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400'; }}
        />
        {product.category && (
          <span className="product-category-tag">{product.category}</span>
        )}
        {product.stock === 0 && (
          <div className="out-of-stock-overlay">Out of Stock</div>
        )}
      </div>

      <div className="product-body">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.description}</p>

        <div className="product-meta">
          {product.rating && (
            <div className="product-rating">
              <span className="stars">{stars(product.rating)}</span>
              <span className="rating-val">{product.rating.toFixed(1)}</span>
              {product.reviewCount && (
                <span className="review-count">({product.reviewCount.toLocaleString()})</span>
              )}
            </div>
          )}
          <div className="product-stock">
            {product.stock > 0 ? (
              <span className="in-stock">✓ In Stock ({product.stock})</span>
            ) : (
              <span className="no-stock">✗ Out of Stock</span>
            )}
          </div>
        </div>

        <div className="product-footer">
          <span className="product-price">{formatPrice(product.price)}</span>

          {isAdmin ? (
            <div className="admin-actions">
              <button className="btn btn-outline btn-sm" onClick={() => onEdit(product)}>
                ✏️ Edit
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => onDelete(product.id)}>
                🗑️ Delete
              </button>
            </div>
          ) : (
            <button className="btn btn-primary btn-sm" disabled={product.stock === 0}>
              {product.stock > 0 ? '🛒 Add to Cart' : 'Unavailable'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
