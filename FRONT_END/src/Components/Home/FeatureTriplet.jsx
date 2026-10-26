import { Heart, MessageCircle, Gift } from "lucide-react";
import styles from "./FeatureTriplet.module.css";

const features = [
  { icon: <Heart size={22} />, title: "Picked by hand", text: "We choose every candle, treat and mug ourselves." },
  { icon: <MessageCircle size={22} />, title: "Order on WhatsApp", text: "Fill your cart, tap the green button and chat with us." },
  { icon: <Gift size={22} />, title: "Wrapped for you", text: "Every order leaves the shop gift-wrapped and ready to give." },
];

export default function FeatureTriplet() {
  return (
    <section className={styles.features}>
      <ul className={styles.list}>
        {features.map((f) => (
          <li className={styles.item} key={f.title}>
            <span className={styles.icon}>{f.icon}</span>
            <div>
              <h4>{f.title}</h4>
              <p>{f.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
