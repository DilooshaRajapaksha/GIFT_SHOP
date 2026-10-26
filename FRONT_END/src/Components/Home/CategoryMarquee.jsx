import Marquee from "react-fast-marquee";
import { useNavigate } from "react-router-dom";
import { imageSrc } from "../../Service/api";
import styles from "./CategoryMarquee.module.css";

// scrolling category circles (admin panel -> Home page -> Categories)
export default function CategoryMarquee({ categories = [] }) {
  const navigate = useNavigate();
  if (categories.length === 0) return null;

  return (
    <div className={styles.wrap}>
      <Marquee pauseOnHover gradient={false} speed={70}>
        {categories.map((c) => (
          <div
            className={styles.item}
            key={c.id}
            onClick={() => c.linkUrl && navigate(c.linkUrl)}
            role={c.linkUrl ? "link" : undefined}
          >
            <img src={imageSrc(c.imageUrl)} alt={c.title} />
            <p>{c.title}</p>
          </div>
        ))}
      </Marquee>
    </div>
  );
}
