import { useId } from "react";
import "./ProductFilters.css";

export default function ProductFilters({
  categories,                       
  selectedCategories,               
  onCategoriesChange,               
  sort,
  onSortChange,
  priceRange,
  onPriceRangeChange,
  maxPrice = 20000,
}) {
  const groupId = useId();

  const cats = categories.filter(c => c.id !== "all"); // show only real categories

  const toggleCat = (id) => {
    const has = selectedCategories.includes(id);
    const next = has
      ? selectedCategories.filter(c => c !== id)
      : [...selectedCategories, id];
    onCategoriesChange(next);
  };

  const clearAll = () => onCategoriesChange([]);

  return (
    <div className="filters neat">
      <div className="card fx">
        <div className="section-title">
          Category
          {selectedCategories.length > 0 && (
            <button className="link-clear" onClick={clearAll} type="button">
              Clear
            </button>
          )}
        </div>

        <ul className="checkbox-list" aria-labelledby={groupId}>
          {cats.map((c) => {
            const inputId = `${groupId}-${c.id}`;
            return (
              <li key={c.id} className="checkbox-item">
                <input
                  id={inputId}
                  type="checkbox"
                  checked={selectedCategories.includes(c.id)}
                  onChange={() => toggleCat(c.id)}
                />
                <label htmlFor={inputId}>{c.label}</label>
              </li>
            );
          })}
        </ul>
      </div>

      {/* SORT */}
      <div className="card fx">
        <div className="section-title">Sort by</div>
        <select value={sort} onChange={(e) => onSortChange(e.target.value)}>
          <option value="popularity">Popularity</option>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {/* PRICE */}
      <div className="card fx">
        <div className="section-title">Price range (LKR)</div>
        <div className="price-row">
          <div className="price-field">
            <label>Min</label>
            <input
              type="number"
              min={0}
              max={priceRange[1]}
              value={priceRange[0]}
              onChange={(e) =>
                onPriceRangeChange([Number(e.target.value), priceRange[1]])
              }
            />
          </div>
          <div className="price-field">
            <label>Max</label>
            <input
              type="number"
              min={priceRange[0]}
              max={maxPrice}
              value={priceRange[1]}
              onChange={(e) =>
                onPriceRangeChange([priceRange[0], Number(e.target.value)])
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
