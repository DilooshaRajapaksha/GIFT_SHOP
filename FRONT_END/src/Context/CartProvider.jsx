import { useEffect, useMemo, useState } from "react";
import { CartContext } from "./cartContext";

const STORAGE_KEY = "pearlGiftsCart";

// read the saved cart when the site opens
const loadCart = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

// cart line: { id, name, price, imageUrl, qty, stock?, contents?: [{name, qty}] }
export default function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  // save every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage full / blocked - cart still works until the page is closed
    }
  }, [items]);

  const addItem = (product, qty = 1) => {
    setItems((prev) => {
      const i = prev.findIndex((x) => x.id === product.id);
      if (i >= 0) {
        const next = [...prev];
        const max = next[i].stock ?? Infinity;
        next[i] = { ...next[i], qty: Math.min(next[i].qty + qty, max) };
        return next;
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: Number(product.price),
          imageUrl: product.imageUrl,
          stock: product.stock ?? null,      // null = no stock limit (gift boxes)
          contents: product.contents || null,
          qty,
        },
      ];
    });
  };

  const setQty = (id, qty) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((x) => x.id !== id)
        : prev.map((x) => (x.id === id ? { ...x, qty: Math.min(qty, x.stock ?? qty) } : x))
    );
  };

  const removeItem = (id) => setItems((prev) => prev.filter((x) => x.id !== id));
  const clearCart = () => setItems([]);

  const count = items.reduce((sum, x) => sum + x.qty, 0);
  const subtotal = items.reduce((sum, x) => sum + Number(x.price) * x.qty, 0);

  const value = useMemo(
    () => ({ items, count, subtotal, addItem, setQty, removeItem, clearCart }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
