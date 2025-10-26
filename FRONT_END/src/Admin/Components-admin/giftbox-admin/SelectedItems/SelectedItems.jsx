import { useState } from "react";
import { useGiftbox } from "../../../context-admin/GiftboxContext";
import "./SelectedItems.css";

const mockCatalog = [
  { id: "p1", name: "Milk Chocolate Bar", price: 120 },
  { id: "p2", name: "Dark Chocolate Truffles", price: 250 },
  { id: "p3", name: "Scented Candle", price: 300 },
  { id: "p4", name: "Greeting Card", price: 75 }
];

export default function SelectedItems() {
  const { items, addItem, updateQty, removeItem } = useGiftbox();
  const [showPicker, setShowPicker] = useState(false);

  return (
    <section className="card selected-items">
      <div className="card-header row-between">
        <h2>Selected Items ({items.length})</h2>
        <button className="btn btn-small" onClick={() => setShowPicker(true)}>
          + Add Item
        </button>
      </div>

      <div className="card-body">
        {items.length === 0 && <p className="muted">No items added yet</p>}

        {items.map((it) => (
          <div key={it.id} className="item-row">
            <div className="item-main">
              <div className="item-name">{it.name}</div>
              <div className="item-price">Rs. {Number(it.price).toFixed(2)}</div>
            </div>

            <div className="item-actions">
              <button
                className="icon-btn"
                aria-label="decrease"
                onClick={() => updateQty(it.id, it.qty - 1)}
              >
                −
              </button>
              <input
                className="qty"
                type="number"
                min="1"
                value={it.qty}
                onChange={(e) => updateQty(it.id, e.target.value)}
              />
              <button
                className="icon-btn"
                aria-label="increase"
                onClick={() => updateQty(it.id, it.qty + 1)}
              >
                +
              </button>
              <button className="link danger" onClick={() => removeItem(it.id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {showPicker && (
        <div className="picker-overlay">
          <div className="picker">
            <div className="picker-header">
              <strong>Select Items</strong>
              <button className="icon-btn" onClick={() => setShowPicker(false)}>
                ✕
              </button>
            </div>

            <div className="picker-body">
              {mockCatalog.map((p) => (
                <div key={p.id} className="picker-row">
                  <div className="picker-name">{p.name}</div>
                  <div className="picker-price">Rs. {p.price.toFixed(2)}</div>
                  <button
                    className="btn btn-small"
                    onClick={() => {
                      addItem({ ...p, qty: 1 });
                      setShowPicker(false);
                    }}
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
