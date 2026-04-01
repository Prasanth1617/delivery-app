import { useState } from "react";
import "./ProductCard.css";

function ProductCard({ product, onAdd, onRemove, cartQty = 0 }) {
  const [imgError, setImgError] = useState(false);

  const hasDiscount  = product.mrp && product.mrp > product.price;
  const savings      = hasDiscount ? product.mrp - product.price : 0;
  const discountPct  = hasDiscount ? Math.round((savings / product.mrp) * 100) : 0;
  const isOutOfStock = product.stock <= 0;
  const isLowStock   = product.stock > 0 && product.stock <= 10;

  return (
    <div className={`pcard ${isOutOfStock ? "pcard-out" : ""}`}>

      {discountPct > 0 && (
        <div className="pcard-discount-badge">{discountPct}% OFF</div>
      )}

      {isOutOfStock && (
        <div className="pcard-out-overlay">
          <span>Out of stock</span>
        </div>
      )}

      <div className="pcard-image-wrap">
        {product.image && !imgError ? (
          <img
            src={product.image}
            alt={product.name}
            className="pcard-image"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="pcard-image-fallback">🛍️</div>
        )}
      </div>

      <div className="pcard-body">
        {product.category && (
          <div className="pcard-category">{product.category}</div>
        )}

        <h4 className="pcard-name">{product.name}</h4>

        {product.unit && (
          <span className="pcard-unit">{product.unit}</span>
        )}

        {product.rating > 0 && (
          <div className="pcard-rating">
            {"★".repeat(Math.round(product.rating))}
            {"☆".repeat(5 - Math.round(product.rating))}
            <span className="pcard-rating-count">({product.ratingCount || 0})</span>
          </div>
        )}

        <div className="pcard-price-row">
          <span className="pcard-price">₹{product.price}</span>
          {hasDiscount && (
            <span className="pcard-mrp">₹{product.mrp}</span>
          )}
        </div>

        {savings > 0 && (
          <div className="pcard-savings">Save ₹{savings}</div>
        )}

        <div className={`pcard-stock ${isOutOfStock ? "out" : isLowStock ? "low" : "in"}`}>
          {isOutOfStock
            ? "✕ Out of stock"
            : isLowStock
            ? `⚠ Only ${product.stock} left`
            : "✓ In stock"}
        </div>

        {isOutOfStock ? (
          <button className="pcard-add-btn pcard-add-disabled" disabled type="button">
            Coming Soon
          </button>
        ) : cartQty > 0 ? (
          <div className="pcard-qty-row">
            <button className="pcard-qty-btn pcard-qty-minus" onClick={() => onRemove(product)} type="button">−</button>
            <span className="pcard-qty-val">{cartQty}</span>
            <button className="pcard-qty-btn pcard-qty-plus" onClick={() => onAdd(product)} type="button">+</button>
          </div>
        ) : (
          <button className="pcard-add-btn" onClick={() => onAdd(product)} type="button">
            + Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductCard;