// src/Components/Giftboxpreview/Giftboxpreview.jsx
// Right side of "Build Your Own" - shows what the user picked.
import { imageSrc } from "../../Service/api";
import "./Giftboxpreview.css";

export default function GiftboxPreview({
  items = [],              // [{ id, name, price, imageUrl, qty }]
  total = 0,               // number
  onQtyChange = () => {},  // (id, newQty) => void
  onRemove = () => {},     // (id) => void
  onCheckout = () => {},   // create the box and go to cart
  creating = false,        // true while the API call is running
}) {
  const isEmpty = items.length === 0;

  return (
    <section className="preview-box">
      <h2 className="preview-title">Your box</h2>

      <div className="preview-canvas">
        {isEmpty ? (
          <div className="empty">
            <div className="empty-box" aria-hidden="true" />
            <p className="empty-msg">Your box is empty. Tap + next to an item to put it in.</p>
          </div>
        ) : (
          <ul className="picked-list">
            {items.map((it) => (
              <li key={it.id} className="picked-row">
                <div className="thumb">
                  {it.imageUrl ? <img src={imageSrc(it.imageUrl)} alt={it.name} /> : null}
                </div>

                <div className="picked-info">
                  <div className="picked-name">{it.name}</div>
                  <div className="picked-price">Rs {Number(it.price).toFixed(2)} each</div>
                </div>

                <div className="picked-qty">
                  {/* going to 0 removes the item (handled in Buildown) */}
                  <button onClick={() => onQtyChange(it.id, it.qty - 1)} disabled={creating}>−</button>
                  <span>{it.qty}</span>
                  <button onClick={() => onQtyChange(it.id, it.qty + 1)} disabled={creating}>+</button>
                </div>

                <button
                  className="picked-remove"
                  onClick={() => onRemove(it.id)}
                  disabled={creating}
                  title="Remove"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="total-row">
        <span>Box total</span>
        <strong>Rs {Number(total).toFixed(2)}</strong>
      </div>

      <button className="checkout-btn" disabled={isEmpty || creating} onClick={onCheckout}>
        {creating ? "Saving your box..." : "Add box to cart"}
      </button>
    </section>
  );
}
