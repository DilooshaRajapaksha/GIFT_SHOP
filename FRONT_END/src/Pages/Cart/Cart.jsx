import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { cartApi } from "../../Service/api";
import CartItem from "./CartItem";
import "./Cart.css";
// Optional: your tabs UI; keep or remove if you don’t have it
// import CheckoutTabs from "../../components/Checkout/CheckoutTabs";

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);       // {cartId, userId, items, totalItems, subtotal}
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    try {
      const r = await cartApi.get();
      setCart(r.data);
    } catch {
      // if no cart exists yet, create and re-load
      try {
        await cartApi.create();
        const r2 = await cartApi.get();
        setCart(r2.data);
      } catch (e) {
        setError("Couldn't load your cart. Please refresh.");
      }
    }
  };

  useEffect(() => { load(); }, []);

  const setQty = async (productId, qty) => {
    if (qty < 1 || busy) return;
    setBusy(true);
    await cartApi.setQty(productId, qty);
    await load();
    setBusy(false);
  };

  const remove = async (productId) => {
    if (busy) return;
    setBusy(true);
    await cartApi.remove(productId);
    await load();
    setBusy(false);
  };

  const clear = async () => {
    if (busy) return;
    setBusy(true);
    await cartApi.clear();
    await load();
    setBusy(false);
  };

  const goToDelivery = () => {
    if (!cart || cart.items.length === 0) return;
    // If you store subtotal for the next step:
    localStorage.setItem("subtotal", String(Number(cart.subtotal || 0)));
    navigate("/delivery");
  };

  if (error) return <div className="cart-page"><p>{error}</p></div>;
  if (!cart) return <div className="cart-page"><div className="loader">Loading…</div></div>;

  return (
    <div className="cart-page">
      {/* <CheckoutTabs /> */}
      <div className="cart-shell">
        <header className="cart-header">
          <nav className="cart-steps">
            <button className="step active" aria-selected="true">Cart</button>
            <button className="step" disabled>Delivery</button>
            <button className="step" disabled>Payment</button>
          </nav>
          <h1 className="cart-title">
            Your Cart <span>({cart.totalItems} {cart.totalItems === 1 ? "item" : "items"})</span>
          </h1>
        </header>

        {cart.items.length === 0 ? (
          <div className="cart-empty">
            <p>Your cart is empty.</p>
            <Link to="/shopitems" className="btn-secondary">Shop Items</Link>
          </div>
        ) : (
          <>
            <ul className="cart-lines">
              {cart.items.map((line) => (
                <li key={line.productId}>
                  <CartItem
                    id={line.productId}
                    name={line.name}
                    price={Number(line.unitPrice)}
                    qty={line.quantity}
                    img={line.imageUrl}
                    onDec={() => setQty(line.productId, line.quantity - 1)}
                    onInc={() => setQty(line.productId, line.quantity + 1)}
                    onDelete={() => remove(line.productId)}
                    disabled={busy}
                  />
                </li>
              ))}
            </ul>

            <div className="cart-footer">
              <button className="btn-secondary" onClick={() => navigate("/shopitems")}>ADD MORE</button>

              <div className="cart-totals">
                <div className="subtotal">
                  Subtotal: <strong>Rs {Number(cart.subtotal).toFixed(2)}</strong>
                </div>

                <div className="actions">
                  <button className="btn-link" onClick={clear} disabled={busy}>Clear cart</button>
                  <button className="btn-primary" onClick={goToDelivery} disabled={busy}>
                    PROCEED TO DELIVERY
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
