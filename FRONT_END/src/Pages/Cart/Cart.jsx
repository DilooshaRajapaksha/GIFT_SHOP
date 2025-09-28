import { Link } from 'react-router-dom';
import './Cart.css';
import CartItem from './CartItem';

function Header() {
  return (
    <header className="header">
      <nav>
        <ul className="nav-links">
            <Link to="/"></Link>
            <Link to="/Cart"></Link>
            <Link to="/Dilivery"> Dilivery</Link>
        </ul>
      </nav>

      {/* Title */}
      <h1>My Cart</h1>

      <div className="header-right">
        <span>
          <CartItem />
          <CartItem />
          <CartItem />
          <CartItem />
          <CartItem />
        </span>
      </div>
      <div className="total">
        <p>Subtotal: Rs --- </p>
        <p>Shipping: Rs --- </p>
        <p>Tax (10%):Rs --- </p>
        <h3>Grand Total: Rs --- </h3> 
      </div>
    </header>
  );
}

export default Header;
