# Pearl Gifts (GIFT_SHOP)

Online gift shop - React (Vite) frontend + Spring Boot / MySQL backend.
Customers add items to the cart and place the order on **WhatsApp** (no sign-in, no online payment).

## How to run

### 1. Database
Open `GiftCraft-BackEnd/database/giftshop_database.sql` in MySQL Workbench and run it (lightning button).
It creates the `giftshoplast` database with sample products and home page content.
Running it again **resets all data**.

### 2. Backend (GiftCraft-BackEnd)
1. Copy `.env.example` to `.env` and fill in your MySQL password and an admin password.
   `.env` is in `.gitignore`, so passwords never go to GitHub.
2. `cd GiftCraft-BackEnd` then `.\mvnw.cmd spring-boot:run`
3. API runs on http://localhost:8082

### 3. Frontend (FRONT_END)
1. Copy `.env.example` to `.env` (`VITE_API=http://localhost:8082`)
2. `npm install` then `npm run dev`
3. Open http://localhost:5173

## Pages
| Page | What it does |
|---|---|
| `/` | Home: hero slides, categories, best sellers, banners (all editable in admin) |
| `/giftbox` | Ready-made gift boxes |
| `/shopitems` | Single items with price filter and search |
| `/buildown` | Build your own gift box |
| `/cart` | Cart + customer details + **Place Order on WhatsApp** |
| `/admin` | Admin panel (password = `ADMIN_PASSWORD` in backend `.env`) |

## Admin panel (`/admin`)
- **Orders** - every WhatsApp order with customer details, change status, chat with the customer
- **Products** - add / edit / hide products, upload pictures, tick "Best seller"
- **Home page** - change hero slides, categories and banners (pictures + text)

## Images
Uploaded pictures are saved as files in `GiftCraft-BackEnd/uploads/images/` and the database stores only the link
(for example `/images/1730000000_ab12cd34.jpg`). The `uploads` folder is in `.gitignore`.

## Settings
- WhatsApp number and shop name: `FRONT_END/src/Service/api.jsx` (`WHATSAPP_NUMBER`, `SHOP_NAME`)
- Admin password: `ADMIN_PASSWORD` in `GiftCraft-BackEnd/.env`
