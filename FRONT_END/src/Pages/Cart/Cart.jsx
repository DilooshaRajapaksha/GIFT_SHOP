import { useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import CartItem from "./CartItem";
import { useCart } from "../../Context/cartContext";
import { orderApi, getErrorMessage, imageSrc, WHATSAPP_DISPLAY } from "../../Service/api";
import { buildOrderMessage, whatsappLink } from "../../Utils/whatsapp";
import "./Cart.css";

const DETAILS_KEY = "pearlGiftsCustomer";

// remember the customer's details for next time (only in their own browser)
const loadDetails = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(DETAILS_KEY));
    if (saved) return { ...saved, note: "" };
  } catch {
    // ignore
  }
  return { name: "", phone: "", address: "", city: "", note: "" };
};

export default function Cart() {
  const { items, count, subtotal, setQty, removeItem, clearCart } = useCart();
  const [form, setForm] = useState(loadDetails);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState("");
  const [done, setDone] = useState(null);   // { orderId, link } after a successful order

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Enter your name";
    if (!/^[0-9+\s-]{9,15}$/.test(form.phone.trim())) e.phone = "Enter a phone number, for example 0771234567";
    if (!form.address.trim()) e.address = "Enter the address we should deliver to";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /*
   * 1. save the order in the database (so the shop sees it in the admin panel)
   * 2. open WhatsApp with the order already typed in the message
   * 3. empty the cart
   */
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // open the new tab right away (inside the click), otherwise the browser
    // may block it as a pop-up because we wait for the server first
    const waWindow = window.open("", "_blank");

    setSending(true);
    setServerError("");
    try {
      const res = await orderApi.place({
        customerName: form.name.trim(),
        customerPhone: form.phone.trim(),
        deliveryAddress: form.address.trim(),
        deliveryCity: form.city.trim(),
        note: form.note.trim(),
        items: items.map((it) => ({ productId: it.id, quantity: it.qty })),
      });

      const message = buildOrderMessage({
        orderId: res.data.orderId,
        items,
        total: res.data.totalPrice,   // total calculated by the server
        customer: form,
      });
      const link = whatsappLink(message);

      if (waWindow) waWindow.location.href = link;
      else window.location.href = link;   // pop-up was blocked -> open in this tab

      try {
        const { note: _note, ...keep } = form;   // don't remember the one-time note
        localStorage.setItem(DETAILS_KEY, JSON.stringify(keep));
      } catch {
        // ignore
      }
      clearCart();
      setDone({ orderId: res.data.orderId, link });
    } catch (err) {
      if (waWindow) waWindow.close();
      setServerError(getErrorMessage(err));
    } finally {
      setSending(false);
    }
  };

  // ---------- after ordering ----------
  if (done) {
    return (
      <div className="page-wrap cart-page">
        <div className="glass cart-done">
          <h1>Order #{done.orderId} is on its way to us</h1>
          <p>
            WhatsApp should now be open with your order typed in. Press <strong>Send</strong> and we will
            reply to confirm delivery and payment.
          </p>
          <a className="btn btn-whatsapp" href={done.link} target="_blank" rel="noreferrer">
            <MessageCircle size={20} /> Open WhatsApp again
          </a>
          <p className="cart-done-small">
            If WhatsApp did not open, message <strong>{WHATSAPP_DISPLAY}</strong> with your order number.
          </p>
          <Link to="/" className="btn btn-ghost">Back to the shop</Link>
        </div>
      </div>
    );
  }

  // ---------- empty cart ----------
  if (items.length === 0) {
    return (
      <div className="page-wrap cart-page">
        <h1 className="page-title">Your cart</h1>
        <div className="glass cart-empty">
          <p>Your cart is empty. Find something they will love:</p>
          <div className="cart-empty-links">
            <Link to="/giftbox" className="btn btn-ribbon">Gift boxes</Link>
            <Link to="/shopitems" className="btn btn-ghost">Shop items</Link>
            <Link to="/buildown" className="btn btn-ghost">Build your own</Link>
          </div>
        </div>
      </div>
    );
  }

  // ---------- cart + order form ----------
  return (
    <div className="page-wrap cart-page">
      <h1 className="page-title">
        Your cart <span className="cart-count">{count} {count === 1 ? "item" : "items"}</span>
      </h1>

      <div className="cart-layout">
        <section className="glass cart-items">
          <ul className="cart-lines">
            {items.map((line) => (
              <li key={line.id}>
                <CartItem
                  name={line.name}
                  price={line.price}
                  qty={line.qty}
                  img={imageSrc(line.imageUrl)}
                  onDec={() => line.qty > 1 && setQty(line.id, line.qty - 1)}
                  onInc={() => setQty(line.id, line.qty + 1)}
                  onDelete={() => removeItem(line.id)}
                />
                {line.contents && (
                  <div className="cart-contents">
                    Inside: {line.contents.map((c) => `${c.name} x ${c.qty}`).join(", ")}
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div className="cart-footer">
            <Link to="/shopitems" className="btn btn-ghost">Add more</Link>
            <button className="cart-clear" onClick={clearCart} disabled={sending}>Empty cart</button>
          </div>
        </section>

        <form className="glass order-form" onSubmit={handlePlaceOrder} noValidate>
          <h2>Your details</h2>

          <div className="order-grid">
            <label>
              Name
              <input name="name" value={form.name} onChange={handleChange} autoComplete="name" maxLength={100} />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </label>
            <label>
              WhatsApp number
              <input name="phone" value={form.phone} onChange={handleChange} inputMode="tel" autoComplete="tel" placeholder="07X XXX XXXX" maxLength={15} />
              {errors.phone && <span className="field-error">{errors.phone}</span>}
            </label>
            <label className="span-2">
              Delivery address
              <textarea name="address" rows="2" value={form.address} onChange={handleChange} autoComplete="street-address" maxLength={255} />
              {errors.address && <span className="field-error">{errors.address}</span>}
            </label>
            <label>
              <span>City <span className="optional">(optional)</span></span>
              <input name="city" value={form.city} onChange={handleChange} maxLength={100} />
            </label>
            <label>
              <span>Note <span className="optional">(optional)</span></span>
              <input name="note" value={form.note} onChange={handleChange} maxLength={500} placeholder="Gift message, delivery day..." />
            </label>
          </div>

          <div className="order-total">
            <span>Total</span>
            <strong>Rs {subtotal.toFixed(2)}</strong>
          </div>
          <p className="cart-hint">Delivery charge is added when we confirm on WhatsApp.</p>

          {serverError && <div className="msg msg-error">{serverError}</div>}

          <button type="submit" className="btn btn-whatsapp btn-whatsapp-big" disabled={sending}>
            <MessageCircle size={22} />
            {sending ? "Sending your order..." : "Place order on WhatsApp"}
          </button>
        </form>
      </div>
    </div>
  );
}
