
import { useMemo, useState } from "react";
import ProductCard from "../../Components/ProductCard/ProductCard";
import ProductFilters from "../../Components/ProductFilters/ProductFilters";
import productsData from "../../Data/Products";
import "./products.css";

export default function Products() {
  const [selectedCategories, setSelectedCategories] = useState([]); // ← array
  const [sort, setSort] = useState("popularity");
  const [priceRange, setPriceRange] = useState([0, 20000]);

  const categories = useMemo(() => [
    { id: "giftbox", label: "Gift Boxes" },
    { id: "flowers", label: "Flowers" },
    { id: "chocolate", label: "Chocolate" },
    { id: "toys", label: "Toys" },
    { id: "cards", label: "Cards" },
  ], []);

  const filtered = useMemo(() => {
    let list = [...productsData];

    // filter by selected categories
    if (selectedCategories.length > 0) {
      list = list.filter(p => selectedCategories.includes(p.category));
    }

    // price range
    list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // sort
    list.sort((a, b) => {
      switch (sort) {
        case "price-asc":  return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "newest":     return new Date(b.addedAt) - new Date(a.addedAt);
        default:           return b.popularity - a.popularity;
      }
    });

    return list;
  }, [selectedCategories, sort, priceRange]);

  return (
    <main className="products-page">
      <div className="container">
        <aside className="filters-col">
          <ProductFilters
            categories={categories}
            selectedCategories={selectedCategories}
            onCategoriesChange={setSelectedCategories}
            sort={sort}
            onSortChange={setSort}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            maxPrice={20000}
          />
        </aside>

        <section className="grid-col">
          <header className="grid-head">
            <h1>All Products</h1>
            <p>{filtered.length} items</p>
          </header>

          <div className="product-grid">
            {filtered.map(item => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
