import { useEffect, useState } from "react";
import { Reviews } from "../../lib/api";

export default function ReviewsDrawer({ productId, onClose }) {
  const [list, setList] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) return;
    Reviews.forProduct(productId).then(setList).catch((e) => setError(e.message));
  }, [productId]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header>Reviews</header>
        <div className="body">
          {error && <p style={{ color: "crimson" }}>{error}</p>}
          {!list && !error && <p>Loading…</p>}
          {list && list.length === 0 && <p>No reviews yet.</p>}
          {list && list.length > 0 && (
            <div style={{ display: "grid", gap: 10 }}>
              {list.map((r) => (
                <div key={r.reviewId} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}>
                  <b>Rating: {r.rating} / 5</b>
                  <div style={{ fontSize: 13, color: "#6b7280" }}>{r.createdAt}</div>
                  {r.comment && <p style={{ marginTop: 6 }}>{r.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
