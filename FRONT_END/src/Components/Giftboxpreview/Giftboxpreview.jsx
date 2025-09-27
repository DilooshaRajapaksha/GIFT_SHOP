// src/Components/GiftBoxPreview/GiftBoxPreview.jsx
import "./Giftboxpreview.css";

export default function GiftboxPpreview({
  items = [],                 // [{id, title, price, img}] if you want to show added items later
  total = 0,                  // number
  onCheckout = () => {},      // handler for checkout
}) {
  const isEmpty = items.length === 0;

  return (
    <section className="preview-box">
      <h1 className="preview-title">Your Gift Box Preview</h1>

      {/* Canvas area */}
      <div className="preview-canvas">
        {isEmpty ? (
          <div className="empty">
            {/* swap with your own image path */}
            <img
              src="/img/empty-box.jpg"
              alt="Empty gift box"
              className="empty-img"
            />
            <p className="empty-msg">
              Your gift box is empty. Add some delightful items!
            </p>
          </div>
        ) : (
          <div className="items-grid">
            {items.map((it) => (
              <div key={it.id} className="thumb">
                <img src={it.img} alt={it.title} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Total */}
      <div className="total-row">
        <span>Total Cost:</span>
        <strong>£{total.toFixed(2)}</strong>
      </div>

      {/* Checkout */}
      <button
        className="checkout-btn"
        disabled={isEmpty}
        onClick={onCheckout}
      >
        Proceed to Checkout
      </button>
    </section>
  );
}
