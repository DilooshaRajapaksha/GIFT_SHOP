import { useMemo, useState } from "react";
import AddItems from "../../Components/Additems/Additems";
import GiftBoxPreview from "../../Components/Giftboxpreview/Giftboxpreview";
import { productApi } from "../../Service/api";
import "./Buildown.css";

export default function Buildown() {
  // items user picked for this custom box: [{id,name,price,imageUrl,qty}]
  const [picked, setPicked] = useState([]);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [giftboxName, setGiftboxName] = useState("");   // <-- NEW

  // Optional: a readable fallback if user leaves it empty
  const makeDefaultName = () => {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `Gift Box • ${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  // add or +1
  const handleAdd = (item) => {
    setPicked((prev) => {
      const i = prev.findIndex((x) => x.id === item.id);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + 1 };
        return next;
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, imageUrl: item.imageUrl, qty: 1 }];
    });
  };

  // change qty (min 1), or remove if qty becomes 0
  const handleQty = (id, qty) => {
    setPicked((prev) => {
      if (qty <= 0) return prev.filter((x) => x.id !== id);
      return prev.map((x) => (x.id === id ? { ...x, qty } : x));
    });
  };

  const handleRemove = (id) => setPicked((prev) => prev.filter((x) => x.id !== id));

  const total = useMemo(
    () => picked.reduce((sum, it) => sum + Number(it.price) * it.qty, 0),
    [picked]
  );

  // Create giftbox handler
  const handleCreateGiftbox = async () => {
    if (!picked.length) {
      alert("Please add at least one item to create a gift box.");
      return;
    }

    const trimmedName = giftboxName.trim();
    const nameToUse = trimmedName || makeDefaultName();     // <-- use input or fallback

    const payload = {
      name: nameToUse,
      items: picked.map(it => ({ productId: it.id, quantity: it.qty }))
    };

    try {
      setLoadingCreate(true);
      const resp = await productApi.createGiftbox(payload);
      console.log("Created giftbox:", resp?.data);
      alert(`Giftbox "${nameToUse}" created successfully!`);
      // Optionally clear / navigate:
      // setPicked([]); setGiftboxName("");
      // navigate(`/giftboxes/${resp.data.id}`);
    } catch (err) {
      console.error("Create failed:", err);
      if (!err.response) {
        alert("Network error — cannot reach backend. Check server or CORS.");
      } else {
        const body = err.response.data;
        alert(`Failed to create giftbox: ${body?.message || JSON.stringify(body)}`);
      }
    } finally {
      setLoadingCreate(false);
    }
  };

  return (
    <main className="builder">
      <div className="builder-layout">
        <aside className="builder-left">
          <AddItems onAdd={handleAdd} />
        </aside>

        <section className="builder-right">
          {/* NEW: Name input bar */}
          <div className="builder-namebar">
            <label htmlFor="giftboxName" className="builder-namebar__label">Giftbox name</label>
            <input
              id="giftboxName"
              className="builder-namebar__input"
              type="text"
              placeholder="e.g., Chocolate Lover's Box"
              value={giftboxName}
              onChange={(e) => setGiftboxName(e.target.value)}
              maxLength={150}
            />
          </div>

          <GiftBoxPreview
            items={picked}
            total={total}
            onQtyChange={handleQty}
            onRemove={handleRemove}
            onCheckout={handleCreateGiftbox}
            creating={loadingCreate}
            // If GiftBoxPreview can show the name, pass it:
            // name={giftboxName.trim() || "Untitled Gift Box"}
          />
        </section>
      </div>
    </main>
  );
}
