import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useNavigate } from "react-router-dom";
import { createAutoplay } from "./emblaAutoplay";
import { imageSrc } from "../../Service/api";
import styles from "./HeroCarousel.module.css";

// slides come from the database (admin panel -> Home page -> Hero slides)
export default function HeroCarousel({ slides = [] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: slides.length > 1 }, [createAutoplay(6000)]);
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  // keep the little dots in sync with the slide that is showing
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setCurrent(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi]);

  const goTo = useCallback((i) => emblaApi && emblaApi.scrollTo(i), [emblaApi]);

  if (slides.length === 0) return null;

  return (
    <section className={styles.wrap}>
      <div className={styles.hero} ref={emblaRef}>
        <div className={styles.track}>
          {slides.map((s, i) => (
            <div
              className={styles.slide}
              key={s.id}
              style={{ backgroundImage: s.imageUrl ? `url(${imageSrc(s.imageUrl)})` : undefined }}
            >
              <div className={`${styles.caption} ${i === 0 ? styles.shine : ""}`}>
                <h1>{s.title}</h1>
                {s.subtitle && <p>{s.subtitle}</p>}
                <div className={styles.btns}>
                  {s.buttonText && (
                    <button className="btn btn-ribbon" onClick={() => navigate(s.linkUrl || "/giftbox")}>
                      {s.buttonText}
                    </button>
                  )}
                  {s.linkUrl !== "/buildown" && (
                    <button className="btn btn-ghost" onClick={() => navigate("/buildown")}>
                      Build your own box
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {slides.length > 1 && (
        <div className={styles.dots}>
          {slides.map((s, i) => (
            <button
              key={s.id}
              className={i === current ? styles.dotOn : styles.dot}
              onClick={() => goTo(i)}
              aria-label={`Show slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
