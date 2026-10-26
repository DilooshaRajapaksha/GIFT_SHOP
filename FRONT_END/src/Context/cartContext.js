// The cart lives in the browser (localStorage), not in the database.
// There is no login, so a database cart would be SHARED by every customer.
// This way each customer's browser has its own cart, and it survives a page refresh.
import { createContext, useContext } from "react";

export const CartContext = createContext(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
