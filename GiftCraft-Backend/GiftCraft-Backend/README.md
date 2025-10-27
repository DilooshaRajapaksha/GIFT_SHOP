
# GiftCraft Backend (Fixed)

A cleaned-up Spring Boot backend for Category, Product, and Review management,
compatible with the provided MySQL schema (`GiftShop` database). No auth, no in-memory DB.

## Build & Run

1. Create the DB schema (run your `Gift_Box.sql` in MySQL).
2. Set env vars:
   ```bash
   export DB_URL="jdbc:mysql://localhost:3306/GiftShop?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
   export DB_USER="root"
   export DB_PASSWORD="yourpassword"
   ```
3. Build & run:
   ```bash
   ./mvnw spring-boot:run
   ```
4. Open API docs: `http://localhost:8080/swagger-ui.html`

## Notes
- `ddl-auto=none`: the app **does not** create or modify tables.
- Entities map to existing tables: `CATEGORY`, `PRODUCT`, `REVIEW`.
- Product `product_type` and `visible` are stored as strings to match DB (`VARCHAR(20)`).
