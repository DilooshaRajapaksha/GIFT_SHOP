import { useEffect, useRef, useState } from "react";
import { Categories } from "../../lib-admin/api.js";
/** Clean, minimal state shape to match your backend */
const EMPTY = {
  name: "",
  price: "",
  stock: "",
  description: "",
  categoryId: "",
  imageUrl: "",
};

export default function ProductForm({ initial, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(initial || EMPTY);
  const [cats, setCats] = useState([]);
  const [preview, setPreview] = useState(initial?.imageUrl || "");
  const fileRef = useRef(null);

  useEffect(() => setForm(initial || EMPTY), [initial]);
  useEffect(() => { Categories.list().then(setCats).catch(() => {}); }, []);

  const up = (patch) => setForm((f) => ({ ...f, ...patch }));
  const chooseFile = () => fileRef.current?.click();
  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    // For real uploads, replace with your upload logic and set imageUrl to the returned URL.
  };

  const submit = (e) => {
    e.preventDefault();
    onSubmit?.({
      name: form.name,
      price: Number(form.price),
      stock: Number(form.stock || 0),
      description: form.description || "",
      categoryId: form.categoryId ? Number(form.categoryId) : null,
      imageUrl: form.imageUrl || preview || null,
      status: "ACTIVE",
      productType: "single",
      visible: "public",
    });
  };

  return (
    <form onSubmit={submit} className="form-grid">
      <div className="full">
        <div className="label">Product</div>
        <input
          className="input"
          placeholder="Eg: Rose Scented Candle"
          value={form.name}
          onChange={(e) => up({ name: e.target.value })}
          required
        />
      </div>

      <div>
        <div className="label">Price</div>
        <input
          className="input"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={form.price}
          onChange={(e) => up({ price: e.target.value })}
          required
        />
      </div>

      <div>
        <div className="label">Stock quantity</div>
        <input
          className="input"
          type="number"
          min="0"
          step="1"
          placeholder="0"
          value={form.stock}
          onChange={(e) => up({ stock: e.target.value })}
          required
        />
      </div>

      <div className="full">
        <div className="label">Description</div>
        <textarea
          className="textarea"
          placeholder="Add an optional description…"
          value={form.description}
          onChange={(e) => up({ description: e.target.value })}
        />
      </div>

      <div>
        <div className="label">Category</div>
        <select
          className="select"
          value={form.categoryId}
          onChange={(e) => up({ categoryId: e.target.value })}
        >
          <option value="">None</option>
          {cats.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="full">
        <div className="label">Product image</div>
        <div className="uploader" onClick={chooseFile} role="button" tabIndex={0}>
          {preview ? (
            <>
              <img src={preview} alt="preview" />
              <div className="hint">Click to replace</div>
            </>
          ) : (
            <div className="hint">Upload an image</div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={onFile}
            style={{ display: "none" }}
          />
        </div>
        <div style={{ marginTop: 8 }}>
          <input
            className="input"
            placeholder="…or paste an image URL"
            value={form.imageUrl}
            onChange={(e) => {
              up({ imageUrl: e.target.value });
              setPreview(e.target.value);
            }}
          />
        </div>
      </div>

      <div className="form-actions full">
        <button className="btn ghost" type="button" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn primary" type="submit" disabled={submitting}>
          {initial?.id ? "Save changes" : "Create Product"}
        </button>
      </div>
    </form>
  );
}
