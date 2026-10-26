import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Filters from "../../Components/FilterBy/Filter";
import { PRICE_RANGES } from "../../Components/FilterBy/priceRanges";
import ProductCard from "../../Components/ProductCard/ProductCard";
import { productApi, getErrorMessage } from "../../Service/api";
import { useCart } from "../../Context/cartContext";
import "./Shopitems.css";

function Shopitems() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [addedId, setAddedId] = useState(null);
  const { addItem } = useCart();
  const [priceId, setPriceId] = useState(null);

  // text typed in the header search box comes as ?search=...
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  // useCallback so Filters doesn't think onChange is new on every render
  const handleFilterChange = useCallback((filterState) => {
    setPriceId(filterState.price);
  }, []);

  useEffect(() => {
    const range = PRICE_RANGES.find((r) => r.id === priceId);

    setLoading(true);
    setError("");
    productApi
      .list({
        type: "single",
        visible: "public",
        search: search || undefined,
        min: range?.min ?? undefined,
        max: range?.max ?? undefined,
      })
      .then((res) => setProducts(res.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [priceId, search]);

  // the cart is saved in the browser now, so adding is instant (no API call)
  const handleAdd = (product) => {
    addItem(product, 1);
    setMessage(`${product.name} was added to your cart.`);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="page-wrap shop-layout">
      {/* only price works for now - occasion/recipient are not in the database yet */}
      <Filters onChange={handleFilterChange} showOccasion={false} showRecipient={false} />

      <div className="shop-main">
        <h1 className="page-title">Shop items</h1>
        <p className="page-sub">
          {search
            ? `Showing items that match "${search}".`
            : "Little things on their own, or mixed into a box of your own."}
        </p>

        {message && <div className="msg msg-success">{message}</div>}
        {error && <div className="msg msg-error">{error}</div>}

        {loading ? (
          <p>Loading...</p>
        ) : products.length === 0 ? (
          <p>Nothing matches that yet. Try another word or clear the price filter.</p>
        ) : (
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAdd={handleAdd}
                added={addedId === p.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Shopitems;
