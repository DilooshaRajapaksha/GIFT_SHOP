import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddItems from "../../Components/Additems/Additems";
import GiftBoxPreview from "../../Components/Giftboxpreview/Giftboxpreview";
import { productApi, getErrorMessage } from "../../Service/api";
import { useCart } from "../../Context/cartContext";
import "./Buildown.css";

export default function Buildown() {
  const navigate = useNavigate();
  const { addItem } = useCart();

  // items user picked for this custom box: [{id, name, price, imageUrl, qty, stock}]
  const [picked, setPicked] = useState([]);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [giftboxName, setGiftboxName] = useState("");
  const [error, setError] = useState("");

  // a readable fallback name if user leaves it empty
  const makeDefaultName = () => {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `Gift Box • ${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  // add a new item or +1 if it's already in the box
  const handleAdd = (item) => {
    setError("");
    setPicked((prev) => {
      const i = prev.findIndex((x) => x.id === item.id);
      if (i >= 0) {
        // don't let the user pick more than we have in stock
        if (prev[i].qty >= item.stock) return prev;
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + 1 };
        return next;
      }
      return [
        ...prev,
        { id: item.id, name: item.name, price: item.price, imageUrl: item.imageUrl, stock: item.stock, qty: 1 },
      ];
    });
  };

  // change qty, or remove the item if qty becomes 0
  const handleQty = (id, qty) => {
    setPicked((prev) => {
      if (qty <= 0) return prev.filter((x) => x.id !== id);
      return prev.map((x) => (x.id === id ? { ...x, qty: Math.min(qty, x.stock ?? qty) } : x));
    });
  };

  const handleRemove = (id) => setPicked((prev) => prev.filter((x) => x.id !== id));

  const total = useMemo(
    () => picked.reduce((sum, it) => sum + Number(it.price) * it.qty, 0),
    [picked]
  );

  // 1) save the gift box on the backend  2) put it in the cart  3) go to the cart page
  const handleCreateGiftbox = async () => {
    if (!picked.length) {
      setError("Please add at least one item to create a gift box.");
      return;
    }

    const nameToUse = giftboxName.trim() || makeDefaultName();
    const payload = {
      name: nameToUse,
      items: picked.map((it) => ({ productId: it.id, quantity: it.qty })),
    };

    try {
      setLoadingCreate(true);
      setError("");
      const resp = await productApi.createGiftbox(payload);

      // put the new box in the cart, with the list of what's inside
      // (that list is also written in the WhatsApp message)
      addItem({
        id: resp.data.id,
        name: nameToUse,
        price: resp.data.totalPrice,
        imageUrl: picked[0]?.imageUrl,
        stock: null,
        contents: picked.map((it) => ({ name: it.name, qty: it.qty })),
      });

      setPicked([]);
      setGiftboxName("");
      navigate("/cart");
    } catch (err) {
      console.error("Create failed:", err);
      setError("Failed to create gift box: " + getErrorMessage(err));
    } finally {
      setLoadingCreate(false);
    }
  };

  return (
    <main className="page-wrap builder">
      <h1 className="page-title">Build your own box</h1>
      <p className="page-sub">Choose the things they will love. We wrap them together in one box.</p>

      <div className="builder-layout">
        <aside className="builder-left">
          <AddItems onAdd={handleAdd} />
        </aside>

        <section className="builder-right">
          <div className="builder-namebar">
            <label htmlFor="giftboxName" className="builder-namebar__label">Name your box</label>
            <input
              id="giftboxName"
              className="builder-namebar__input"
              type="text"
              placeholder="For example: Amma's birthday box"
              value={giftboxName}
              onChange={(e) => setGiftboxName(e.target.value)}
              maxLength={150}
            />
          </div>

          {error && <div className="msg msg-error">{error}</div>}

          <GiftBoxPreview
            items={picked}
            total={total}
            onQtyChange={handleQty}
            onRemove={handleRemove}
            onCheckout={handleCreateGiftbox}
            creating={loadingCreate}
          />
        </section>
      </div>
    </main>
  );
}
