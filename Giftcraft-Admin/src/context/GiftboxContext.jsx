import { createContext, useContext, useMemo, useState } from "react";

const GiftboxContext = createContext(null);

export function GiftboxProvider({ children }) {
  const [details, setDetails] = useState({ name: "", theme: "", description: "" });
  const [items, setItems] = useState([]); // {id, name, price, qty}

  const totals = useMemo(() => {
    const totalQty = items.reduce((s, it) => s + Number(it.qty || 0), 0);
    const totalPrice = items.reduce((s, it) => s + Number(it.qty || 0) * Number(it.price || 0), 0);
    return { totalQty, totalPrice };
  }, [items]);

  const updateDetails = (patch) => setDetails((d) => ({ ...d, ...patch }));

  const addItem = (item) => {
    setItems((prev) => {
      const i = prev.findIndex((p) => p.id === item.id);
      if (i !== -1) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + (item.qty ?? 1) };
        return next;
      }
      return [...prev, { ...item, qty: item.qty ?? 1 }];
    });
  };

  const updateQty = (id, qty) =>
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, qty: Math.max(1, Number(qty) || 1) } : it))
    );

  const removeItem = (id) => setItems((prev) => prev.filter((it) => it.id !== id));
  const clearAll = () => {
    setItems([]);
    setDetails({ name: "", theme: "", description: "" });
  };

  const value = { details, items, totals, updateDetails, addItem, updateQty, removeItem, clearAll };
  return <GiftboxContext.Provider value={value}>{children}</GiftboxContext.Provider>;
}

export const useGiftbox = () => useContext(GiftboxContext);
