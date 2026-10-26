import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { adminApi, productApi, getErrorMessage } from "../../Service/api";

const STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

// turn a local number (07X...) into WhatsApp format (947X...)
const toWhatsAppNumber = (phone) => {
  const digits = (phone || "").replace(/\D/g, "");
  if (digits.startsWith("0")) return "94" + digits.slice(1);
  return digits;
};

// for gift boxes: click to load what is inside the box
function BoxContents({ boxId }) {
  const [items, setItems] = useState(null);
  const [failed, setFailed] = useState(false);

  const load = () => {
    productApi
      .giftboxById(boxId)
      .then((res) => setItems(res.data.items || []))
      .catch(() => setFailed(true));
  };

  if (failed) return <div className="admin-hint">Box contents not available</div>;
  if (!items) {
    return (
      <button type="button" className="admin-btn-text" onClick={load}>
        Show what's inside
      </button>
    );
  }
  return (
    <div className="admin-hint">
      {items.map((c) => `${c.productName} x ${c.quantity}`).join(", ") || "Empty box"}
    </div>
  );
}

const formatDate = (d) =>
  d ? new Date(d).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) : "";

export default function AdminOrders({ onAuthError }) {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleError = (err) => {
    if (err.response?.status === 401) onAuthError();
    else setError(getErrorMessage(err));
  };

  const load = () => {
    setLoading(true);
    adminApi
      .orders()
      .then((res) => setOrders(res.data))
      .catch(handleError)
      .finally(() => setLoading(false));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(load, []);

  const changeStatus = async (order, status) => {
    setError("");
    try {
      await adminApi.updateOrderStatus(order.orderId, status);
      setOrders((prev) => prev.map((o) => (o.orderId === order.orderId ? { ...o, status } : o)));
    } catch (err) {
      handleError(err);
    }
  };

  const handleDelete = async (order) => {
    if (!window.confirm(`Delete order #${order.orderId}? This cannot be undone.`)) return;
    try {
      await adminApi.deleteOrder(order.orderId);
      setOrders((prev) => prev.filter((o) => o.orderId !== order.orderId));
    } catch (err) {
      handleError(err);
    }
  };

  const shown = statusFilter === "All" ? orders : orders.filter((o) => o.status === statusFilter);

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <h2>Orders</h2>
        <button className="admin-btn-light" onClick={load}>Refresh</button>
      </div>

      <div className="admin-filters">
        {["All", ...STATUSES].map((s) => (
          <button key={s} className={statusFilter === s ? "active" : ""} onClick={() => setStatusFilter(s)}>
            {s} ({s === "All" ? orders.length : orders.filter((o) => o.status === s).length})
          </button>
        ))}
      </div>

      {error && <div className="msg msg-error">{error}</div>}
      {loading ? (
        <p>Loading...</p>
      ) : shown.length === 0 ? (
        <p className="admin-hint">No orders here.</p>
      ) : (
        <div className="admin-orders">
          {shown.map((o) => (
            <div key={o.orderId} className={`admin-order status-${(o.status || "pending").toLowerCase()}`}>
              <div className="admin-order-head">
                <strong>Order #{o.orderId}</strong>
                <span className="admin-hint">{formatDate(o.orderDate)}</span>
                <select
                  aria-label={`Status of order ${o.orderId}`}
                  value={o.status || "Pending"}
                  onChange={(e) => changeStatus(o, e.target.value)}
                >
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div className="admin-order-body">
                <div>
                  <div><strong>{o.customerName || "-"}</strong></div>
                  <div>{o.customerPhone}</div>
                  <div>{[o.deliveryAddress, o.deliveryCity].filter(Boolean).join(", ")}</div>
                  {o.note && <div className="admin-note">Note: {o.note}</div>}
                  {o.customerPhone && (
                    <a
                      className="admin-wa"
                      href={`https://wa.me/${toWhatsAppNumber(o.customerPhone)}?text=${encodeURIComponent(
                        `Hello ${o.customerName || ""}, about your Pearl Gifts order #${o.orderId}:`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircle size={16} /> Chat with customer
                    </a>
                  )}
                </div>

                <ul className="admin-order-items">
                  {(o.items || []).map((it) => (
                    <li key={it.orderItemId}>
                      <span>
                        {it.name} x {it.quantity}
                        {it.productType === "giftbox" && (
                          <>
                            <em> (gift box)</em>
                            {it.productId && <BoxContents boxId={it.productId} />}
                          </>
                        )}
                      </span>
                      <span>Rs {(Number(it.unitPrice) * it.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                  <li className="total">
                    <span>Total</span>
                    <span>Rs {Number(o.totalPrice).toFixed(2)}</span>
                  </li>
                </ul>
              </div>

              <div className="admin-row-actions">
                <button className="admin-btn-text danger" onClick={() => handleDelete(o)}>Delete order</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
