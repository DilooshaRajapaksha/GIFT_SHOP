import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../Components/ProductCard/ProductCard";
import { productApi, getErrorMessage } from "../../Service/api";
import { useCart } from "../../Context/cartContext";
import "./Giftbox.css";

// Ready-made gift boxes (made by the shop in the admin panel)
function Giftbox() {
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [addedId, setAddedId] = useState(null);
  const { addItem } = useCart();

  useEffect(() => {
    productApi
      .list({ type: "giftbox", visible: "public" })
      .then((res) => setBoxes(res.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = (box) => {
    addItem({ ...box, stock: null }, 1);   // boxes are made to order, no stock limit
    setMessage(`${box.name} was added to your cart.`);
    setAddedId(box.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  if (loading) return <div className="page-wrap">Loading...</div>;

  return (
    <div className="page-wrap">
      <h1 className="page-title">Gift Boxes</h1>
      <p className="page-sub">Ready-made boxes, wrapped and ready to give.</p>

      {message && <div className="msg msg-success">{message}</div>}
      {error && <div className="msg msg-error">{error}</div>}

      <h2 className="gb-heading">Ready-made boxes</h2>
      {boxes.length === 0 && !error ? (
        <p>No ready-made boxes right now.</p>
      ) : (
        <div className="gb-grid">
          {boxes.map((box) => (
            <ProductCard
              key={box.id}
              classic
              product={{ ...box, stock: undefined }}  // don't show "out of stock" for boxes
              onAdd={handleAdd}
              added={addedId === box.id}
            />
          ))}
        </div>
      )}

      <div className="gb-own glass">
        <div>
          <h2>Want to choose what goes inside?</h2>
          <p>Pick candles, treats, mugs and more, and we will wrap them together for you.</p>
        </div>
        <Link to="/buildown" className="btn btn-ribbon">Build your own box</Link>
      </div>
    </div>
  );
}

export default Giftbox;
