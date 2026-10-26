import useEmblaCarousel from "embla-carousel-react";
import { useNavigate } from "react-router-dom";
import { createAutoplay } from "./emblaAutoplay";
import { imageSrc } from "../../Service/api";
import styles from "./GiftBanner.module.css";

// wide banner slides in the middle of the home page (admin panel -> Home page -> Banners)
export default function GiftBanner({ banners = [] }) {
  const [emblaRef] = useEmblaCarousel({ loop: banners.length > 1 }, [createAutoplay(7000)]);
  const navigate = useNavigate();

  if (banners.length === 0) return null;

  return (
    <div className={styles.wrap}>
      <section className={styles.banner} ref={emblaRef}>
        <div className={styles.container}>
          {banners.map((b) => (
            <div className={styles.slide} key={b.id}>
              <div
                className={styles.picture}
                style={{ backgroundImage: b.imageUrl ? `url(${imageSrc(b.imageUrl)})` : undefined }}
                role="img"
                aria-label={b.title}
              />
              <div className={styles.text}>
                <h2>{b.title}</h2>
                {b.subtitle && <p>{b.subtitle}</p>}
                {b.buttonText && (
                  <button className="btn btn-ribbon" onClick={() => navigate(b.linkUrl || "/shopitems")}>
                    {b.buttonText}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
