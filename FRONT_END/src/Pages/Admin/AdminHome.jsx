import { useEffect, useState } from "react";
import { adminApi, getErrorMessage, imageSrc } from "../../Service/api";
import ImageUpload from "./ImageUpload";

// the three parts of the home page the admin can change
const SECTIONS = [
  { type: "HERO", title: "Hero slides (big pictures at the top)", hasText: true, hasButton: true },
  { type: "CATEGORY", title: "Categories (scrolling circles)", hasText: false, hasButton: false },
  { type: "BANNER", title: "Banners (wide slides in the middle)", hasText: true, hasButton: true },
];

// pages a button / category can link to
const LINK_HINT = "e.g. /giftbox, /shopitems, /buildown or /shopitems?search=candle";

export default function AdminHome({ onAuthError }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleError = (err) => {
    if (err.response?.status === 401) onAuthError();
    else setError(getErrorMessage(err));
  };

  const load = () => {
    adminApi
      .homeItems()
      .then((res) => setItems(res.data))
      .catch(handleError);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(load, []);

  const startNew = (type) => {
    const next = items.filter((i) => i.type === type).length + 1;
    setEditing({ type, title: "", subtitle: "", buttonText: "", linkUrl: "", imageUrl: "", sortOrder: next, active: true });
    setError("");
    setMessage("");
  };

  const startEdit = (item) => {
    setEditing({
      ...item,
      title: item.title || "",
      subtitle: item.subtitle || "",
      buttonText: item.buttonText || "",
      linkUrl: item.linkUrl || "",
      imageUrl: item.imageUrl || "",
    });
    setError("");
    setMessage("");
  };

  const change = (field, value) => setEditing((prev) => ({ ...prev, [field]: value }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editing.imageUrl) {
      setError("Please upload an image first");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const body = { ...editing, sortOrder: Number(editing.sortOrder) || 0 };
      if (editing.id) await adminApi.updateHomeItem(editing.id, body);
      else await adminApi.createHomeItem(body);
      setMessage("Saved. Open the shop home page to see it.");
      setEditing(null);
      load();
    } catch (err) {
      handleError(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.title || "this item"}"?`)) return;
    try {
      await adminApi.deleteHomeItem(item.id);
      load();
    } catch (err) {
      handleError(err);
    }
  };

  // ---------- form ----------
  if (editing) {
    const section = SECTIONS.find((s) => s.type === editing.type);
    return (
      <form className="admin-panel" onSubmit={handleSave}>
        <h2>{editing.id ? "Edit" : "Add"}: {section.title}</h2>

        <div className="admin-form">
          <div className="admin-form-image">
            <ImageUpload value={editing.imageUrl} onChange={(url) => change("imageUrl", url)} />
            <p className="admin-hint">
              {editing.type === "CATEGORY" ? "Square picture works best." : "Wide picture works best (for example 1600 x 700)."}
            </p>
          </div>

          <div className="admin-form-fields">
            <label className="span-2">
              {editing.type === "CATEGORY" ? "Category name *" : "Title *"}
              <input value={editing.title} onChange={(e) => change("title", e.target.value)} required maxLength={150} />
            </label>
            {section.hasText && (
              <label className="span-2">
                Small text under the title
                <input value={editing.subtitle} onChange={(e) => change("subtitle", e.target.value)} maxLength={300} />
              </label>
            )}
            {section.hasButton && (
              <label>
                Button text
                <input value={editing.buttonText} onChange={(e) => change("buttonText", e.target.value)} maxLength={60} />
              </label>
            )}
            <label>
              {editing.type === "CATEGORY" ? "Opens page" : "Button opens page"}
              <input value={editing.linkUrl} onChange={(e) => change("linkUrl", e.target.value)} placeholder={LINK_HINT} maxLength={255} />
            </label>
            <label>
              Order (1 = first)
              <input type="number" value={editing.sortOrder} onChange={(e) => change("sortOrder", e.target.value)} />
            </label>
            <label className="check">
              <input type="checkbox" checked={editing.active} onChange={(e) => change("active", e.target.checked)} />
              Show on the home page
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
  return (
    <div className="admin-panel">
      <h2>Home page</h2>
      <p className="admin-hint">Best Sellers are chosen in the Products tab (tick "Best Sellers").</p>
      {message && <div className="msg msg-success">{message}</div>}
      {error && <div className="msg msg-error">{error}</div>}

      {SECTIONS.map((section) => {
        const list = items.filter((i) => i.type === section.type);
        return (
          <section key={section.type} className="admin-section">
            <div className="admin-panel-head">
              <h3>{section.title}</h3>
              <button className="admin-btn" onClick={() => startNew(section.type)}>+ Add</button>
            </div>
            {list.length === 0 ? (
              <p className="admin-hint">None yet.</p>
            ) : (
              <div className={section.type === "CATEGORY" ? "admin-grid small" : "admin-grid"}>
                {list.map((item) => (
                  <div key={item.id} className={item.active ? "admin-tile" : "admin-tile off"}>
                    <div className="admin-tile-img">
                      {item.imageUrl ? <img src={imageSrc(item.imageUrl)} alt={item.title} /> : <span>No image</span>}
                    </div>
                    <strong>{item.title || "(no title)"}</strong>
                    {!item.active && <span className="admin-hint">Hidden</span>}
                    <div className="admin-row-actions">
                      <button className="admin-btn-light" onClick={() => startEdit(item)}>Edit</button>
                      <button className="admin-btn-text danger" onClick={() => handleDelete(item)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
