import { Link } from "react-router-dom";
import { Mail, Phone, Instagram, Facebook, MapPin, Clock, Heart, MessageCircle } from "lucide-react";
import { SHOP_NAME, WHATSAPP_DISPLAY } from "../../Service/api";
import { whatsappChatLink } from "../../Utils/whatsapp";
import logo from "../../assets/logo.jpg";
import styles from "./Footer.module.css";

// footer from the new home page design
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.section}>
            <img src={logo} alt={`${SHOP_NAME} logo`} className={styles.logo} />
            <h4>About {SHOP_NAME}</h4>
            <p className={styles.description}>
              A small gift shop in Kurunegala. We put together boxes of
              candles, treats and keepsakes, and wrap every one by hand.
            </p>
            <div className={styles.brand}>
              <Heart size={16} className={styles.brandIcon} />
              <span>Wrapped with love in Sri Lanka</span>
            </div>
          </div>

          <div className={styles.section}>
            <h4>Shop</h4>
            <ul className={styles.links}>
              <li><Link to="/giftbox">Gift boxes</Link></li>
              <li><Link to="/shopitems">Shop items</Link></li>
              <li><Link to="/buildown">Build your own</Link></li>
              <li><Link to="/vehicle-surprise">Vehicle Surprise</Link></li>
              <li><Link to="/cart">Your cart</Link></li>
            </ul>
          </div>

          <div className={styles.section}>
            <h4>Find us</h4>
            <div className={styles.contactInfo}>
              <p className={styles.row}><Phone size={16} /> {WHATSAPP_DISPLAY}</p>
              <p className={styles.row}><Mail size={16} /> info@pearlgifts.lk</p>
              <p className={styles.row}><MapPin size={16} /> Kurunegala, Sri Lanka</p>
              <p className={styles.row}><Clock size={16} /> Mon to Fri, 9am to 6pm</p>
            </div>
          </div>

          <div className={styles.section}>
            <h4>Talk to us</h4>
            <p className={styles.socialText}>Not sure what to pick? Ask us on WhatsApp.</p>
            <a className={styles.waButton} href={whatsappChatLink()} target="_blank" rel="noreferrer">
              <MessageCircle size={18} /> WhatsApp
            </a>
            <div className={styles.icons}>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="Facebook">
                <Facebook size={18} />
              </a>
            </div>
          </div>
        </div>

        <p className={styles.copy}>© {year} {SHOP_NAME}. All rights reserved.</p>
      </div>
    </footer>
  );
}
