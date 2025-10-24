import { useEffect, useState } from "react";
import "./ItemsManagement.css";
import ProductForm from "./ProductForm";
import ReviewsDrawer from "./ReviewsDrawer";
import { Products } from "../../lib/api";

/** Minimal modal wrapper with hard scroll lock */
function Modal({ title, children, onClose }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";    // lock background scroll
    return () => { document.body.style.overflow = prev; };
  }, []);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
          <header><span>{title}</span></header>
        <div className="body">{children}</div>
      </div>
    </div>
  );
}

export default function ItemsManagement() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showReviewsFor, setShowReviewsFor] = useState(null);
  const [q, setQ] = useState({ name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = async () => {
    setLoading(true); setError(null);
    try {
      const data = await Products.list({ name: q.name || undefined, page, size, sort: "id,desc" });
      setRows(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); /* eslint-disable-next-line */ }, [page, size]);

  return (
    <div className="pm-container">
      <h1 style={{ margin: 0 }}>Products</h1>
      <p style={{ color: "#6b7280" }}>Create, edit, delete, adjust stock, and view reviews.</p>

      <div className="pm-toolbar">
        <input
          placeholder="Search by name…"
          value={q.name}
          onChange={(e) => setQ({ ...q, name: e.target.value })}
        />
        <button onClick={() => { setPage(0); refresh(); }}>Search</button>
        <button onClick={() => setCreating(true)}> Add Product </button>
      </div>

      <div className="pm-card">
        {error && <div style={{ color: "crimson", marginBottom: 8 }}>{error}</div>}
        {loading ? (
          <p>Loading…</p>
        ) : (
          <table className="table">
            <thead>
              <tr><th>ID</th><th>Image</th><th>Name</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt="" style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 10 }} />
                    ) : "—"}
                  </td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{p.name}</div>
                    <div style={{ color: "#6b7280", fontSize: 12 }}>{p.categoryName || "Uncategorized"}</div>
                  </td>
                  <td>LKR {Number(p.price || 0).toFixed(2)}</td>
                  <td>{p.stock}</td>
                  <td style={{ display: "flex", gap: 8 }}>
                    <button className="btn" onClick={() => setEditing(p)}>Edit</button>
                    <button
                      className="btn"
                      onClick={async () => {
                        if (confirm("Delete this product?")) { await Products.remove(p.id); refresh(); }
                      }}
                    >
                      Delete
                    </button>
                    <button className="btn" onClick={() => setShowReviewsFor(p.id)}>Reviews</button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", color: "#6b7280" }}>
                    No products
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 12 }}>
          <span>Rows</span>
          <select value={size} onChange={(e) => { setSize(Number(e.target.value)); setPage(0); }}>
            {[5, 10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <button className="btn" onClick={() => setPage((p) => Math.max(0, p - 1))}>Prev</button>
          <div style={{ alignSelf: "center" }}>{page + 1} / {Math.max(1, totalPages)}</div>
          <button className="btn" onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}>Next</button>
        </div>
      </div>

      {creating && (
        <Modal title="Create Product" onClose={() => setCreating(false)}>
          <ProductForm
            onCancel={() => setCreating(false)}
            onSubmit={async (payload) => {
              await Products.create(payload);
              setCreating(false);
              setPage(0);
              refresh();
            }}
          />
        </Modal>
      )}

      {editing && (
        <Modal title="Edit Product" onClose={() => setEditing(null)}>
          <ProductForm
            initial={editing}
            onCancel={() => setEditing(null)}
            onSubmit={async (payload) => {
              await Products.update(editing.id, payload);
              setEditing(null);
              refresh();
            }}
          />
        </Modal>
      )}

      {showReviewsFor && (
        <ReviewsDrawer productId={showReviewsFor} onClose={() => setShowReviewsFor(null)} />
      )}
    </div>
  );
}
