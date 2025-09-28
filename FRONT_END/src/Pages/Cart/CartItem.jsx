import './CartItem.css';

function CartItem() {
  return (
    <div className="cart-item">
      <div className="item-image">[Image]</div>
      <div className="item-details">
        <h4>Item Name</h4>
        <p>Rs --</p>
      </div>
      <div className="item-actions">
        <button>-</button>
        <span>0</span>
        <button>+</button>
      </div>
      <p className="item-total">Rs --</p>
      <button className="delete-btn">X</button>
    </div>
  );
}

export default CartItem;
