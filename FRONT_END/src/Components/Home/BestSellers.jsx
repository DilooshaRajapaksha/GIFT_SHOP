import { useState } from "react";
import { imageSrc } from "../../Service/api";
import { useCart } from "../../Context/cartContext";
import styles from "./BestSellers.module.css";

// products ticked as "Best seller" in the admin panel
export default function BestSellers({ products = [] }) {
  const { addItem } = useCart();
  const [addedId, setAddedId] = useState(null);

  if (products.length === 0) return null;

  const handleAdd = (p) => {
    addItem(p, 1);
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <section className={styles.products}>
      <div className={styles.container}>
        {products.map((p) => {
          const outOfStock = p.stock !== null && p.stock !== undefined && p.stock <= 0;
          return (
            <div className={styles.card} key={p.id}>
              <img src={imageSrc(p.imageUrl)} alt={p.name} />
              <h4>{p.name}</h4>
              <p>Rs {Number(p.price).toFixed(2)}</p>
              <button className={styles.addBtn} onClick={() => handleAdd(p)} disabled={outOfStock}>
                {outOfStock ? "Out of stock" : addedId === p.id ? "Added" : "Add to cart"}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
