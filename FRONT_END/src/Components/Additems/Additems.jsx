// src/Components/Additems/Additems.jsx
// Left side of "Build Your Own" - lists single items from the backend.
// When the user clicks (+) we call the onAdd function that Buildown passes in.
import { useEffect, useState } from "react";
import { builderApi, getErrorMessage, imageSrc } from "../../Service/api";
import "./Additems.css";

export default function AddItems({ onAdd }) {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // load one page of items. page 0 replaces the list, other pages are added to the end
  const loadItems = async (pageNo, searchText) => {
    setLoading(true);
    setError("");
    try {
      const res = await builderApi.catalog({
        query: searchText || undefined,
        page: pageNo,
        size: 12,
      });
      const data = res.data;
      setItems((prev) => (pageNo === 0 ? data.content : [...prev, ...data.content]));
      setPage(pageNo);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // first load when the page opens
  useEffect(() => {
    loadItems(0, "");
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadItems(0, query.trim());
  };

  return (
    <section className="add-box">
      <h2 className="add-title">Pick your items</h2>

      <form className="add-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search candles, tea, mugs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {error && <div className="msg msg-error">{error}</div>}

      {!loading && !error && items.length === 0 && (
        <p className="add-empty">Nothing matches that. Try another word.</p>
      )}

      <ul className="list">
        {items.map((item) => (
          <li key={item.id} className="row">
            <div className="media">
              {item.imageUrl ? <img src={imageSrc(item.imageUrl)} alt={item.name} /> : null}
            </div>

            <div className="meta">
              <div className="name">{item.name}</div>
              <div className="price">Rs {Number(item.price).toFixed(2)}</div>
              {item.stock <= 0 && <div className="stock-out">Out of stock</div>}
            </div>

            <button
              className="add-btn"
              onClick={() => onAdd(item)}
              disabled={item.stock <= 0}
              aria-label={`Add ${item.name}`}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="11" />
                <path d="M12 7v10M7 12h10" />
              </svg>
            </button>
          </li>
        ))}
      </ul>

      {loading && <p className="add-empty">Loading...</p>}

      {!loading && page + 1 < totalPages && (
        <button className="add-more" onClick={() => loadItems(page + 1, query.trim())}>
          Load more
        </button>
      )}
    </section>
  );
}
