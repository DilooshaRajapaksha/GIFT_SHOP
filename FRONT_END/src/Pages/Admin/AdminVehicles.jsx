import { useEffect, useState } from "react";
import { adminApi, getErrorMessage, imageSrc } from "../../Service/api";

const MAX_PHOTOS = 8;
const EMPTY = { name: "", price: "", description: "", includes: "", sortOrder: 1, active: true, images: [] };

// several photos for one package: upload, remove, move left / right
function PhotoList({ images, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files).slice(0, MAX_PHOTOS - images.length);
    e.target.value = "";
    if (!files.length) return;
    setUploading(true);
    setError("");
    const added = [];
    try {
      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
          setError(`${file.name} is too big (max 5MB)`);
          continue;
        }
        const res = await adminApi.uploadImage(file);
        added.push(res.data.url);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      onChange([...images, ...added]);
      setUploading(false);
    }
  };

  const remove = (i) => onChange(images.filter((_, j) => j !== i));
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= images.length) return;
    const copy = [...images];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    onChange(copy);
  };

  return (
    <div className="photo-list">
      <div className="photo-grid">
        {images.map((url, i) => (
          <div key={url + i} className="photo-item">
            <img src={imageSrc(url)} alt={`Photo ${i + 1}`} />
            {i === 0 && <span className="photo-cover">Cover</span>}
            <div className="photo-tools">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move left">‹</button>
              <button type="button" onClick={() => remove(i)} aria-label="Remove photo">✕</button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === images.length - 1} aria-label="Move right">›</button>
            </div>
          </div>
        ))}
        {images.length < MAX_PHOTOS && (
          <label className="photo-add">
            {uploading ? "Uploading..." : "+ Add photos"}
            <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple hidden onChange={handleFiles} disabled={uploading} />
          </label>
        )}
      </div>
      <p className="admin-hint">Up to {MAX_PHOTOS} photos. The first one is the cover picture.</p>
      {error && <div className="field-error">{error}</div>}
    </div>
  );
}

export default function AdminVehicles({ onAuthError }) {
  const [packages, setPackages] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleError = (err) => {
    if (err.response?.status === 401) onAuthError();
    else setError(getErrorMessage(err));
  };

  const load = () => {
    adminApi.vehiclePackages().then((res) => setPackages(res.data)).catch(handleError);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(load, []);

  const startNew = () => {
    setEditing({ ...EMPTY, sortOrder: packages.length + 1 });
    setError("");
    setMessage("");
  };

  const startEdit = (p) => {
    setEditing({
      ...EMPTY,
      ...p,
      price: p.price ?? "",
      description: p.description || "",
      includes: p.includes || "",
      images: p.images || [],
    });
    setError("");
    setMessage("");
  };

  const change = (field, value) => setEditing((prev) => ({ ...prev, [field]: value }));

  const handleSave = async (e) => {
    e.preventDefault();
    const body = {
      ...editing,
      price: editing.price === "" ? null : Number(editing.price),
      sortOrder: Number(editing.sortOrder) || 0,
    };
    setSaving(true);
    setError("");
    try {
      if (editing.id) await adminApi.updateVehiclePackage(editing.id, body);
      else await adminApi.createVehiclePackage(body);
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
    try {
      await adminApi.deleteVehiclePackage(p.id);
      load();
    } catch (err) {
      handleError(err);
    }
  };

  if (editing) {
    return (
      <form className="admin-panel" onSubmit={handleSave}>
        <h2>{editing.id ? `Edit: ${editing.name}` : "Add a Vehicle Surprise package"}</h2>

        <PhotoList images={editing.images} onChange={(imgs) => change("images", imgs)} />

        <div className="admin-form-fields vs-admin-fields">
          <label className="span-2">
            Package name
            <input value={editing.name} onChange={(e) => change("name", e.target.value)} required maxLength={150} />
          </label>
          <label>
            Price (Rs) <span className="admin-hint">leave empty for "price on request"</span>
            <input type="number" min="0" step="0.01" value={editing.price} onChange={(e) => change("price", e.target.value)} />
          </label>
          <label>
            Order (1 = first)
            <input type="number" value={editing.sortOrder} onChange={(e) => change("sortOrder", e.target.value)} />
          </label>
          <label className="span-2">
            Description
            <textarea rows="3" value={editing.description} onChange={(e) => change("description", e.target.value)} maxLength={3000} />
          </label>
          <label className="span-2">
            What's included (one per line)
            <textarea rows="5" value={editing.includes} onChange={(e) => change("includes", e.target.value)} maxLength={3000}
              placeholder={"Helium balloons\nHappy Birthday banner\nRose petals"} />
          </label>
          <label className="check">
            <input type="checkbox" checked={editing.active} onChange={(e) => change("active", e.target.checked)} />
            Show on the Vehicle Surprise page
          </label>
        </div>

        {error && <div className="msg msg-error">{error}</div>}

        <div className="admin-form-buttons">
          <button className="admin-btn" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
          <button type="button" className="admin-btn-light" onClick={() => setEditing(null)}>Cancel</button>
        </div>
      </form>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <h2>Vehicle Surprise</h2>
        <button className="admin-btn" onClick={startNew}>+ Add package</button>
      </div>
      {message && <div className="msg msg-success">{message}</div>}
      {error && <div className="msg msg-error">{error}</div>}

      {packages.length === 0 ? (
        <p className="admin-hint">No packages yet. Add your first one.</p>
      ) : (
        <div className="admin-list">
          {packages.map((p) => (
            <div key={p.id} className="admin-row">
              <div className="admin-thumb">
                {p.images?.[0] ? <img src={imageSrc(p.images[0])} alt={p.name} /> : <span>No photo</span>}
              </div>
              <div className="admin-row-main">
                <strong>{p.name}</strong>
                <span className="admin-tags">
                  <span>{p.price != null ? `Rs ${Number(p.price).toFixed(2)}` : "Price on request"}</span>
                  <span className="tag">{p.images?.length || 0} photos</span>
                  {!p.active && <span className="tag">Hidden</span>}
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
