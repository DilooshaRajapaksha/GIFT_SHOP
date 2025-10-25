import "./CartItem.css";

export default function CartItem({
  id, name, price, qty, img,
  onDec, onInc, onDelete, disabled
}) {
  return (
    <div className="cart-item">
      <div className="ci-media">
        {img
          ? <img src={img} alt={name} />
          : <div className="ci-placeholder">[Image]</div>}
      </div>

      <div className="ci-main">
        <div className="ci-name">{name}</div>
        <div className="ci-price">Rs {price.toFixed(2)}</div>
      </div>

      <div className="ci-qty">
        <button className="chip" onClick={onDec} disabled={disabled}>−</button>
        <span className="qty">{qty}</span>
        <button className="chip" onClick={onInc} disabled={disabled}>+</button>
      </div>

      <div className="ci-total">Rs {(price * qty).toFixed(2)}</div>

      <button className="ci-remove" onClick={onDelete} title="Remove" disabled={disabled}>
        ✕
      </button>
    </div>
  );
}
