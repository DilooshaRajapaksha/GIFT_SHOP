// Builds the WhatsApp link with the order already typed in the message.
// https://wa.me/<number>?text=<message>  opens WhatsApp (app on phone, WhatsApp Web on computer)
import { SHOP_NAME, WHATSAPP_NUMBER } from "../Service/api";

const money = (n) =>
  "Rs " + Number(n || 0).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function buildOrderMessage({ orderId, items, total, customer }) {
  const lines = [];
  lines.push(`Hello ${SHOP_NAME}! 🎁 I would like to place an order.`);
  lines.push("");
  lines.push(`*Order #${orderId}*`);

  items.forEach((it, i) => {
    lines.push(`${i + 1}. ${it.name} x ${it.qty} = ${money(Number(it.price) * it.qty)}`);
    // boxes made in "Build Your Own" also list what is inside
    if (it.contents && it.contents.length) {
      it.contents.forEach((c) => lines.push(`    - ${c.name} x ${c.qty}`));
    }
  });

  lines.push("");
  lines.push(`*Total: ${money(total)}* (delivery charge to be confirmed)`);
  lines.push("");
  lines.push(`Name: ${customer.name}`);
  lines.push(`Phone: ${customer.phone}`);
  lines.push(`Address: ${customer.address}${customer.city ? ", " + customer.city : ""}`);
  if (customer.note) lines.push(`Note: ${customer.note}`);

  return lines.join("\n");
}

// message for a Vehicle Surprise package (no cart, straight to WhatsApp)
export function buildPackageMessage(pkg) {
  const lines = [];
  lines.push(`Hello ${SHOP_NAME}! I would like to book a Vehicle Surprise.`);
  lines.push("");
  lines.push(`*Package: ${pkg.name}*`);
  if (pkg.price !== null && pkg.price !== undefined) lines.push(`Price: ${money(pkg.price)}`);
  lines.push("");
  lines.push("Date:");
  lines.push("Location:");
  lines.push("Vehicle type:");
  return lines.join("\n");
}

export function whatsappLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// plain chat link (footer / contact button)
export function whatsappChatLink() {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hello ${SHOP_NAME}!`)}`;
}
