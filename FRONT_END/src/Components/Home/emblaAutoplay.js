// autoplay plugin for the Embla carousels (hero + banner)
// (this file was missing from the Home_page zip, so it is rewritten here)
import Autoplay from "embla-carousel-autoplay";

export function createAutoplay(delay = 4500) {
  return Autoplay({ delay, stopOnInteraction: false, stopOnMouseEnter: true });
}
