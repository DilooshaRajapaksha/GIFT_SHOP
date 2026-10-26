-- =====================================================================
-- Pearl Gifts database (GIFT_SHOP project)
-- Creates the database, all tables, and some sample data.
--
-- How to run:
--   MySQL Workbench: File > Open SQL Script > pick this file > click the lightning icon
--   or command line:  mysql -u root -p < giftshop_database.sql
--
-- WARNING: this DROPS the tables first, so running it again resets all data.
-- =====================================================================

CREATE DATABASE IF NOT EXISTS giftshoplast
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE giftshoplast;

-- drop in reverse order because of the foreign keys
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS PAYMENT;          -- old table, payment is now done on WhatsApp
DROP TABLE IF EXISTS HOME_ITEM;
DROP TABLE IF EXISTS VEHICLE_PACKAGE_IMAGE;
DROP TABLE IF EXISTS VEHICLE_PACKAGE;
DROP TABLE IF EXISTS ORDER_ITEM;
DROP TABLE IF EXISTS `ORDER`;
DROP TABLE IF EXISTS CART_ITEM;      -- old: the cart is now kept in the browser
DROP TABLE IF EXISTS CART;
DROP TABLE IF EXISTS GIFTBOX_PRODUCT;
DROP TABLE IF EXISTS PRODUCT;
SET FOREIGN_KEY_CHECKS = 1;


-- ---------------------------------------------------------------------
-- PRODUCT  (Entity/Product.java)
-- both single items AND gift boxes are stored here
--   product_type: 'single' or 'giftbox'
--   visible:      'public' (shown in the shop) or 'private' (user's own box / draft)
-- ---------------------------------------------------------------------
CREATE TABLE PRODUCT (
  product_id    BIGINT        NOT NULL AUTO_INCREMENT,
  category_id   BIGINT        NULL,
  name          VARCHAR(150)  NOT NULL,
  description   TEXT          NULL,
  price         DECIMAL(10,2) NOT NULL,
  stock         INT           NOT NULL,
  product_type  VARCHAR(20)   NOT NULL,
  created_by    BIGINT        NULL,
  visible       VARCHAR(20)   NULL,
  image_url     VARCHAR(255)  NULL,          -- link to the image, e.g. /images/123_abc.jpg
  best_seller   BIT(1)        NOT NULL DEFAULT b'0',   -- 1 = show in "Best Sellers" on the home page
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (product_id)
);


-- ---------------------------------------------------------------------
-- GIFTBOX_PRODUCT  (Entity/GiftBoxItem.java)
-- which single items are inside which gift box
-- ---------------------------------------------------------------------
CREATE TABLE GIFTBOX_PRODUCT (
  giftbox_id  BIGINT NOT NULL,
  product_id  BIGINT NOT NULL,
  quantity    INT    NOT NULL,
  PRIMARY KEY (giftbox_id, product_id),   -- needed for "on duplicate key update" in GiftBoxItemRepo
  CONSTRAINT fk_gbp_giftbox FOREIGN KEY (giftbox_id) REFERENCES PRODUCT (product_id),
  CONSTRAINT fk_gbp_product FOREIGN KEY (product_id) REFERENCES PRODUCT (product_id)
);


-- ---------------------------------------------------------------------
-- ORDER + ORDER_ITEM  (Entity/Order.java, OrderItem.java)
-- saved when the customer clicks "Place Order on WhatsApp"
-- ORDER is a reserved word in SQL, so it always needs `backticks`
-- ---------------------------------------------------------------------
CREATE TABLE `ORDER` (
  order_id              BIGINT        NOT NULL AUTO_INCREMENT,
  user_id               BIGINT        NULL,
  customer_name         VARCHAR(255)  NULL,
  customer_phone        VARCHAR(255)  NULL,
  note                  VARCHAR(500)  NULL,
  delivery_address      VARCHAR(255)  NULL,
  delivery_city         VARCHAR(255)  NULL,
  delivery_postal_code  VARCHAR(255)  NULL,
  total_price           DECIMAL(38,2) NULL,
  status                VARCHAR(20)   NULL,   -- Pending, Processing, Shipped, Delivered, Cancelled
  order_date            DATETIME(6)   NULL,
  PRIMARY KEY (order_id)
);

CREATE TABLE ORDER_ITEM (
  order_item_id  BIGINT        NOT NULL AUTO_INCREMENT,
  order_id       BIGINT        NULL,
  product_id     BIGINT        NULL,
  quantity       INT           NULL,
  unit_price     DECIMAL(38,2) NULL,
  PRIMARY KEY (order_item_id),
  CONSTRAINT fk_oi_order FOREIGN KEY (order_id) REFERENCES `ORDER` (order_id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- HOME_ITEM  (Entity/HomeItem.java)
-- home page content the admin can change:
--   HERO = big top slides, CATEGORY = scrolling circles, BANNER = wide middle slides
-- ---------------------------------------------------------------------
CREATE TABLE HOME_ITEM (
  home_item_id  BIGINT        NOT NULL AUTO_INCREMENT,
  type          VARCHAR(20)   NOT NULL,
  title         VARCHAR(150)  NULL,
  subtitle      VARCHAR(300)  NULL,
  button_text   VARCHAR(60)   NULL,
  link_url      VARCHAR(255)  NULL,
  image_url     VARCHAR(255)  NULL,
  sort_order    INT           NULL DEFAULT 0,
  active        BIT(1)        NULL DEFAULT b'1',
  PRIMARY KEY (home_item_id)
);


-- ---------------------------------------------------------------------
-- VEHICLE_PACKAGE + VEHICLE_PACKAGE_IMAGE  (Entity/VehiclePackage.java)
-- "Vehicle Surprise" packages (car decorations). Photos are in their own table.
-- ---------------------------------------------------------------------
CREATE TABLE VEHICLE_PACKAGE (
  package_id   BIGINT        NOT NULL AUTO_INCREMENT,
  name         VARCHAR(150)  NOT NULL,
  description  TEXT          NULL,
  includes     TEXT          NULL,          -- one item per line
  price        DECIMAL(10,2) NULL,          -- empty = price on request
  sort_order   INT           NULL DEFAULT 0,
  active       BIT(1)        NULL DEFAULT b'1',
  PRIMARY KEY (package_id)
);

CREATE TABLE VEHICLE_PACKAGE_IMAGE (
  package_id  BIGINT       NOT NULL,
  position    INT          NOT NULL,
  image_url   VARCHAR(255) NULL,
  PRIMARY KEY (package_id, position),
  CONSTRAINT fk_vpi_package FOREIGN KEY (package_id) REFERENCES VEHICLE_PACKAGE (package_id) ON DELETE CASCADE
);


-- =====================================================================
-- SAMPLE DATA
-- category_id is just a number for now (there is no CATEGORY table in the code):
--   1 = Candles, 2 = Gourmet Treats, 3 = Home Decor, 4 = Beauty & Care, 5 = Flowers
-- images come from picsum.photos (random photos) - replace with your own later
-- =====================================================================

INSERT INTO PRODUCT (product_id, category_id, name, description, price, stock, product_type, created_by, visible, image_url) VALUES
-- single items (these show in Shop Items and Build Your Own)
(1,  1, 'Scented Soy Candle',      'Hand-poured soy candle with vanilla scent.',        1200.00, 25, 'single', NULL, 'public', 'https://picsum.photos/seed/candle/400/400'),
(2,  1, 'Lavender Tealight Set',   'Pack of 12 lavender tealights.',                      850.00, 40, 'single', NULL, 'public', 'https://picsum.photos/seed/tealight/400/400'),
(3,  2, 'Artisan Chocolate Bar',   'Dark chocolate with sea salt, 100g.',                 650.00, 50, 'single', NULL, 'public', 'https://picsum.photos/seed/chocolate/400/400'),
(4,  2, 'Premium Ceylon Tea',      'Loose leaf Ceylon black tea, 100g tin.',              950.00, 30, 'single', NULL, 'public', 'https://picsum.photos/seed/tea/400/400'),
(5,  2, 'Butter Cookies Tin',      'Classic butter cookies, 250g.',                       780.00, 35, 'single', NULL, 'public', 'https://picsum.photos/seed/cookies/400/400'),
(6,  3, 'Handmade Ceramic Mug',    'Glazed ceramic mug, 350ml.',                         1500.00, 20, 'single', NULL, 'public', 'https://picsum.photos/seed/mug/400/400'),
(7,  3, 'Mini Photo Frame',        'Wooden photo frame, 4x6 inch.',                      1100.00, 15, 'single', NULL, 'public', 'https://picsum.photos/seed/frame/400/400'),
(8,  4, 'Rose Hand Cream',         'Moisturising hand cream with rose oil, 75ml.',        990.00, 30, 'single', NULL, 'public', 'https://picsum.photos/seed/handcream/400/400'),
(9,  4, 'Bath Salt Jar',           'Relaxing eucalyptus bath salts, 300g.',              1350.00, 18, 'single', NULL, 'public', 'https://picsum.photos/seed/bathsalt/400/400'),
(10, 5, 'Dried Flower Bouquet',    'Small bunch of dried flowers.',                      2400.00, 10, 'single', NULL, 'public', 'https://picsum.photos/seed/flowers/400/400'),
(11, 3, 'Teddy Bear',              'Soft brown teddy bear, 25cm.',                       2800.00, 12, 'single', NULL, 'public', 'https://picsum.photos/seed/teddy/400/400'),
(12, 2, 'Honey Jar',               'Pure bee honey, 250g.',                               720.00,  0, 'single', NULL, 'public', 'https://picsum.photos/seed/honey/400/400'),  -- out of stock on purpose (to test)

-- ready-made gift boxes (these show in Gift Boxes > Ready-made boxes)
-- price = sum of (item price x quantity), same as the backend calculates
(13, NULL, 'Tea Lover''s Box',     'Ceylon tea, a mug and cookies.',                     3230.00, 0, 'giftbox', 1, 'public', 'https://picsum.photos/seed/teabox/400/400'),
(14, NULL, 'Relax & Unwind Box',   'Candle, bath salts and hand cream.',                 3540.00, 0, 'giftbox', 1, 'public', 'https://picsum.photos/seed/spabox/400/400'),
(15, NULL, 'Sweet Treats Box',     'Chocolate, cookies and honey.',                      2800.00, 0, 'giftbox', 1, 'public', 'https://picsum.photos/seed/sweetbox/400/400');

-- what is inside each ready-made box
INSERT INTO GIFTBOX_PRODUCT (giftbox_id, product_id, quantity) VALUES
(13, 4, 1),   -- Tea Lover's Box: tea 950 + mug 1500 + cookies 780 = 3230
(13, 6, 1),
(13, 5, 1),
(14, 1, 1),   -- Relax & Unwind: candle 1200 + bath salt 1350 + hand cream 990 = 3540
(14, 9, 1),
(14, 8, 1),
(15, 3, 2),   -- Sweet Treats: 2 x chocolate 1300 + cookies 780 + honey 720 = 2800
(15, 5, 1),
(15, 12, 1);

-- best sellers shown on the home page (admin can change this with the tick box)
UPDATE PRODUCT SET best_seller = b'1' WHERE product_id IN (1, 3, 6, 10, 11);

-- home page content (replace the pictures from the admin panel: /admin -> Home page)
INSERT INTO HOME_ITEM (type, title, subtitle, button_text, link_url, image_url, sort_order) VALUES
('HERO', 'Gifts wrapped with care',        'Boxes we put together by hand, for birthdays, thank-yous and everything in between', 'Shop gift boxes', '/giftbox',   'https://picsum.photos/seed/pearlhero1/1600/700', 1),
('HERO', 'Build your own gift box',      'Pick the items, we wrap it beautifully',          'Start building',  '/buildown',  'https://picsum.photos/seed/pearlhero2/1600/700', 2),
('HERO', 'Small things they will keep',    'Candles, treats, flowers and more',               'Browse items',      '/shopitems', 'https://picsum.photos/seed/pearlhero3/1600/700', 3),

('CATEGORY', 'Candles',        NULL, NULL, '/shopitems?search=candle',    'https://picsum.photos/seed/catcandle/300/300',  1),
('CATEGORY', 'Chocolates',     NULL, NULL, '/shopitems?search=chocolate', 'https://picsum.photos/seed/catchoco/300/300',   2),
('CATEGORY', 'Tea & Coffee',   NULL, NULL, '/shopitems?search=tea',       'https://picsum.photos/seed/cattea/300/300',     3),
('CATEGORY', 'Mugs',           NULL, NULL, '/shopitems?search=mug',       'https://picsum.photos/seed/catmug/300/300',     4),
('CATEGORY', 'Flowers',        NULL, NULL, '/shopitems?search=flower',    'https://picsum.photos/seed/catflower/300/300',  5),
('CATEGORY', 'Teddy Bears',    NULL, NULL, '/shopitems?search=teddy',     'https://picsum.photos/seed/catteddy/300/300',   6),
('CATEGORY', 'Self Care',      NULL, NULL, '/shopitems?search=cream',     'https://picsum.photos/seed/catcare/300/300',    7),
('CATEGORY', 'Gift Boxes',     NULL, NULL, '/giftbox',                    'https://picsum.photos/seed/catbox/300/300',     8),

('BANNER', 'Make it personal',           'Build a gift box with exactly what they love',    'Build your own',  '/buildown',  'https://picsum.photos/seed/pearlbanner1/1600/500', 1),
('BANNER', 'Order easily on WhatsApp',   'Fill your cart, tap the green button and we sort out the rest in the chat', 'Start shopping', '/shopitems', 'https://picsum.photos/seed/pearlbanner2/1600/500', 2);

-- make sure new products continue after the sample ids
ALTER TABLE PRODUCT AUTO_INCREMENT = 100;

-- Vehicle Surprise sample packages (change the photos in /admin -> Vehicle surprise)
INSERT INTO VEHICLE_PACKAGE (package_id, name, description, includes, price, sort_order) VALUES
(1, 'Birthday Car Surprise',
    'We decorate the car while they are away, so it is ready when they walk out.',
    'Helium balloons inside the car\nHappy Birthday banner\nRose petals on the seats\nSmall cake and a card', 8500.00, 1),
(2, 'Proposal Car Setup',
    'A romantic setup for the big question. Fairy lights, flowers and a ring box spot.',
    'Fairy lights\nRed and white roses\nHeart balloons\n"Will you marry me?" sign', 15000.00, 2),
(3, 'Welcome Home Baby',
    'Bring the new baby home in a car full of soft colours.',
    'Pink or blue balloons\nBaby name banner\nTeddy bear\nFlowers for mum', 9500.00, 3);

INSERT INTO VEHICLE_PACKAGE_IMAGE (package_id, position, image_url) VALUES
(1, 0, 'https://picsum.photos/seed/carbday1/900/700'),
(1, 1, 'https://picsum.photos/seed/carbday2/900/700'),
(1, 2, 'https://picsum.photos/seed/carbday3/900/700'),
(2, 0, 'https://picsum.photos/seed/carlove1/900/700'),
(2, 1, 'https://picsum.photos/seed/carlove2/900/700'),
(3, 0, 'https://picsum.photos/seed/carbaby1/900/700'),
(3, 1, 'https://picsum.photos/seed/carbaby2/900/700');

-- quick check
SELECT product_type, visible, COUNT(*) AS how_many
FROM PRODUCT
GROUP BY product_type, visible;
