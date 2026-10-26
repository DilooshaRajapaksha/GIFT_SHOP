import { useEffect, useState } from "react";
import { adminApi, getErrorMessage, imageSrc } from "../../Service/api";
import ImageUpload from "./ImageUpload";

const EMPTY = {
  name: "",
  description: "",
  price: "",
  stock: 0,
  productType: "single",
  visible: "public",
  categoryId: "",
  imageUrl: "",
  bestSeller: false,
};

const FILTERS = [
  { key: "single", label: "Single items" },
  { key: "readymade", label: "Ready-made boxes" },
  { key: "custom", label: "Customer-built boxes" },
];

// which list a product belongs to
const groupOf = (p) => {
  if (p.productType === "single") return "single";
  return p.visible === "public" ? "readymade" : "custom";
};

export default function AdminProducts({ onAuthError }) {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("single");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);   // null = list view, {} = form
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleError = (err) => {
    if (err.response?.status === 401) onAuthError();
    else setError(getErrorMessage(err));
  };

  const load = () => {
    adminApi
      .products()
      .then((res) => setProducts(res.data))
      .catch(handleError);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(load, []);

  const startNew = () => {
    setEditing({ ...EMPTY, productType: filter === "single" ? "single" : "giftbox" });
    setError("");
    setMessage("");
  };

  const startEdit = (p) => {
    setEditing({
      ...EMPTY,
      ...p,
      description: p.description || "",
      categoryId: p.categoryId ?? "",
      imageUrl: p.imageUrl || "",
      bestSeller: !!p.bestSeller,
    });
    setError("");
    setMessage("");
  };

  const change = (field, value) => setEditing((prev) => ({ ...prev, [field]: value }));

  const handleSave = async (e) => {
    e.preventDefault();
    const body = {
      ...editing,
      price: Number(editing.price),
      stock: Number(editing.stock),
      categoryId: editing.categoryId === "" ? null : Number(editing.categoryId),
    };
    setSaving(true);
    setError("");
    try {
      if (editing.id) await adminApi.updateProduct(editing.id, body);
      else await adminApi.createProduct(body);
      setMessage(`"${editing.name}" was saved.`);
      setEditing(null);
      load();
    } catch (err) {
      handleError(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p) => {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    setError("");
    try {
      await adminApi.deleteProduct(p.id);
      setMessage(`"${p.name}" was deleted.`);
      load();
    } catch (err) {
      handleError(err);
    }
  };

  // ---------- add / edit form ----------
  if (editing) {
    return (
      <form className="admin-panel" onSubmit={handleSave}>
        <h2>{editing.id ? `Edit: ${editing.name}` : "Add product"}</h2>

        <div className="admin-form">
          <div className="admin-form-image">
            <ImageUpload value={editing.imageUrl} onChange={(url) => change("imageUrl", url)} />
          </div>

          <div className="admin-form-fields">
            <label className="span-2">
              Name *
              <input value={editing.name} onChange={(e) => change("name", e.target.value)} required maxLength={150} />
            </label>
            <label className="span-2">
              Description
              <textarea rows="3" value={editing.description} onChange={(e) => change("description", e.target.value)} />
            </label>
            <label>
              Price (Rs) *
              <input type="number" min="0" step="0.01" value={editing.price} onChange={(e) => change("price", e.target.value)} required />
            </label>
            <label>
              Stock *
              <input type="number" min="0" value={editing.stock} onChange={(e) => change("stock", e.target.value)} required />
            </label>
            <label>
              Type
              <select value={editing.productType} onChange={(e) => change("productType", e.target.value)}>
                <option value="single">Single item</option>
                <option value="giftbox">Gift box</option>
              </select>
            </label>
            <label>
              Shown in shop?
              <select value={editing.visible} onChange={(e) => change("visible", e.target.value)}>
                <option value="public">Yes (public)</option>
                <option value="private">No (hidden)</option>
              </select>
            </label>
            <label>
              Category number (optional)
              <input type="number" min="1" value={editing.categoryId} onChange={(e) => change("categoryId", e.target.value)} />
            </label>
            <label className="check">
              <input type="checkbox" checked={editing.bestSeller} onChange={(e) => change("bestSeller", e.target.checked)} />
              Show in "Best Sellers" on the home page
            </label>
          </div>
        </div>

        {error && <div className="msg msg-error">{error}</div>}

        <div className="admin-form-buttons">
          <button className="admin-btn" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
          <button type="button" className="admin-btn-light" onClick={() => setEditing(null)}>Cancel</button>
        </div>
      </form>
    );
  }

  // ---------- list ----------
  const text = search.trim().toLowerCase();
  const shown = products
    .filter((p) => groupOf(p) === filter)
    .filter((p) => !text || p.name.toLowerCase().includes(text));

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <h2>Products</h2>
        <button className="admin-btn" onClick={startNew}>+ Add product</button>
      </div>

      <div className="admin-filters">
        {FILTERS.map((f) => (
          <button key={f.key} className={filter === f.key ? "active" : ""} onClick={() => setFilter(f.key)}>
            {f.label} ({products.filter((p) => groupOf(p) === f.key).length})
          </button>
        ))}
        <input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {filter === "custom" && (
        <p className="admin-hint">These boxes were made by customers in "Build Your Own". They are hidden from the shop.</p>
      )}
      {message && <div className="msg msg-success">{message}</div>}
      {error && <div className="msg msg-error">{error}</div>}

      {shown.length === 0 ? (
        <p className="admin-hint">Nothing here yet.</p>
      ) : (
        <div className="admin-list">
          {shown.map((p) => (
            <div key={p.id} className="admin-row">
              <div className="admin-thumb">
                {p.imageUrl ? <img src={imageSrc(p.imageUrl)} alt={p.name} /> : <span>No image</span>}
              </div>
              <div className="admin-row-main">
                <strong>{p.name}</strong>
                <span className="admin-tags">
                  <span>Rs {Number(p.price).toFixed(2)}</span>
                  {p.productType === "single" && (
                    <span className={p.stock <= 0 ? "tag tag-warn" : "tag"}>
                      {p.stock <= 0 ? "Out of stock" : `${p.stock} in stock`}
                    </span>
                  )}
                  {p.visible === "private" && <span className="tag">Hidden</span>}
                  {p.bestSeller && <span className="tag tag-star">Best seller</span>}
                </span>
              </div>
              <div className="admin-row-actions">
                <button className="admin-btn-light" onClick={() => startEdit(p)}>Edit</button>
                <button className="admin-btn-text danger" onClick={() => handleDelete(p)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
