import "./GiftboxSummary.css";
import { useGiftbox } from "../../../context/GiftboxContext";

export default function GiftboxSummary() {
  const { details, items, totals } = useGiftbox();

  const canCreate =
    details.name.trim().length > 0 && details.theme && items.length > 0;

  const handleCreate = () => {
    if (!canCreate) return;

    const payload = {
      name: details.name.trim(),
      theme: details.theme,
      description: details.description.trim(),
      items: items.map(({ id, qty }) => ({ productId: id, quantity: qty }))
    };

    alert("Giftbox created (demo):\n" + JSON.stringify(payload, null, 2));
  };

  return (
    <aside className="card giftbox-summary">
      <div className="card-header">
        <h3>Summary</h3>
      </div>

      <div className="card-body">
        <div className="summary-row">
          <span>Items:</span>
          <span>{items.length}</span>
        </div>
        <div className="summary-row">
          <span>Total Quantity:</span>
          <span>{totals.totalQty}</span>
        </div>

        <hr className="divider" />

        <div className="cost-breakdown">
          <h4 className="muted">Cost Breakdown:</h4>
          {items.length === 0 && <p className="muted">—</p>}
          {items.map((it) => (
            <div key={it.id} className="summary-line">
              <span>
                {it.name} × {it.qty}
              </span>
              <span>Rs. {(Number(it.price) * Number(it.qty)).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <hr className="divider" />

        <div className="summary-total">
          <span>Total:</span>
          <strong>Rs. {Number(totals.totalPrice).toFixed(2)}</strong>
        </div>

        <button
          className="btn btn-primary w-100"
          disabled={!canCreate}
          onClick={handleCreate}
          title={canCreate ? "Create Giftbox" : "Fill required fields & add items"}
        >
          <span className="icon" aria-hidden>💾</span> Create Giftbox
        </button>
      </div>
    </aside>
  );
}
