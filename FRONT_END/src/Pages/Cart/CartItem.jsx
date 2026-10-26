import "./CartItem.css";

export default function CartItem({
  name, price, qty, img,
  onDec, onInc, onDelete, disabled
}) {
  // BigDecimal from the backend can come as a string, so convert it first
  const unitPrice = Number(price) || 0;

  return (
    <div className="cart-item">
      <div className="ci-media">
        {img
          ? <img src={img} alt={name} />
          : <div className="ci-placeholder" aria-hidden="true" />}
      </div>

      <div className="ci-main">
        <div className="ci-name">{name}</div>
        <div className="ci-price">Rs {unitPrice.toFixed(2)}</div>
      </div>

      <div className="ci-qty">
        <button className="chip" onClick={onDec} disabled={disabled} aria-label="One less">−</button>
        <span className="qty">{qty}</span>
        <button className="chip" onClick={onInc} disabled={disabled} aria-label="One more">+</button>
      </div>

      <div className="ci-total">Rs {(unitPrice * qty).toFixed(2)}</div>

      <button className="ci-remove" onClick={onDelete} title="Remove" aria-label={`Remove ${name}`} disabled={disabled}>
        ✕
      </button>
    </div>
  );
}
