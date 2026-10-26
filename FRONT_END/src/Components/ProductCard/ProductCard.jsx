// src/Components/ProductCard/ProductCard.jsx
// One product tile. Used on Home, Shop Items and Gift Boxes pages.
import { imageSrc } from "../../Service/api";
import "./ProductCard.css";

export default function ProductCard({ product, onAdd, added = false, buttonText = "Add to cart", classic = false }) {
  // price comes from BigDecimal in Java, so make sure it's a number before toFixed
  const price = Number(product.price || 0);
  const outOfStock = product.stock !== undefined && product.stock !== null && product.stock <= 0;

  return (
    <div className={classic ? "pcard classic" : "pcard"}>
      <div className="pcard-media">
        {product.imageUrl ? (
          <img src={imageSrc(product.imageUrl)} alt={product.name} />
        ) : (
          <div className="pcard-noimg">No image</div>
        )}
      </div>

      <div className="pcard-title">{product.name}</div>
      {classic && product.description && <p className="pcard-desc">{product.description}</p>}
      <div className="pcard-price">Rs {price.toFixed(2)}</div>

      {onAdd && (
        <button
          className="pcard-btn"
          onClick={() => onAdd(product)}
          disabled={outOfStock}
        >
          {outOfStock ? "Out of stock" : added ? "Added" : buttonText}
        </button>
      )}
    </div>
  );
}
