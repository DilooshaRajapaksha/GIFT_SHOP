import { useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight, MessageCircle, Check } from "lucide-react";
import { imageSrc } from "../../Service/api";
import { buildPackageMessage, whatsappLink } from "../../Utils/whatsapp";

const money = (n) => "Rs " + Number(n).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// floating window with the package photos + details + WhatsApp button
export default function PackageModal({ pkg, onClose }) {
  const [index, setIndex] = useState(0);
  const closeRef = useRef(null);
  const images = pkg.images || [];
  const includes = (pkg.includes || "").split("\n").map((l) => l.trim()).filter(Boolean);

  useEffect(() => {
    // stop the page behind from scrolling while the window is open
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => (images.length ? (i + 1) % images.length : 0));
      if (e.key === "ArrowLeft") setIndex((i) => (images.length ? (i - 1 + images.length) % images.length : 0));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = old;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, images.length]);

  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <div className="vs-overlay" onClick={onClose}>
      <div
        className="vs-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vs-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button ref={closeRef} className="vs-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <div className="vs-gallery">
          <div className="vs-photo">
            {images.length > 0 ? (
              <img src={imageSrc(images[index])} alt={`${pkg.name} photo ${index + 1}`} />
            ) : (
              <span>No photos yet</span>
            )}
            {images.length > 1 && (
              <>
                <button className="vs-arrow left" onClick={prev} aria-label="Previous photo"><ChevronLeft size={22} /></button>
                <button className="vs-arrow right" onClick={next} aria-label="Next photo"><ChevronRight size={22} /></button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="vs-thumbs">
              {images.map((url, i) => (
                <button
                  key={url + i}
                  className={i === index ? "on" : ""}
                  onClick={() => setIndex(i)}
                  aria-label={`Show photo ${i + 1}`}
                >
                  <img src={imageSrc(url)} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="vs-info">
          <h2 id="vs-modal-title">{pkg.name}</h2>
          <p className="vs-price">{pkg.price != null ? money(pkg.price) : "Price on request"}</p>
          {pkg.description && <p className="vs-text">{pkg.description}</p>}

          {includes.length > 0 && (
            <>
              <h3>What's included</h3>
              <ul className="vs-includes">
                {includes.map((line) => (
                  <li key={line}><Check size={16} /> {line}</li>
                ))}
              </ul>
            </>
          )}

          <a
            className="btn btn-whatsapp vs-book"
            href={whatsappLink(buildPackageMessage(pkg))}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={20} /> Book on WhatsApp
          </a>
          <p className="vs-note">We will reply to check the date, place and vehicle.</p>
        </div>
      </div>
    </div>
  );
}
