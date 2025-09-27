// src/Components/AddItems/AddItems.jsx
import "./Additems.css";
 // <-- IMPORTANT: import the CSS for this component

export default function AddItems() {
  const data = [
    { group: "Candles", items: [{ id: 1, title: "Scented Soy Candle", price: 35, img: "/img/candle.jpg" }] },
    { group: "Gourmet Treats", items: [
      { id: 2, title: "Artisan Chocolate Bar", price: 12, img: "/img/chocolate.jpg" },
      { id: 3, title: "Premium Loose Leaf Tea", price: 15, img: "/img/tea.jpg" },
    ]},
    { group: "Home Decor", items: [{ id: 4, title: "Handmade Ceramic Mug", price: 22, img: "/img/mug.jpg" }] },
  ];

  const onAdd = (item) => console.log("add:", item);

  return (
    <section className="add-box">
      <h1 className="add-title">Add Items to Your Box</h1>

      {data.map(section => (
        <div key={section.group} className="group">
          <h2 className="group-title">{section.group}</h2>

          <ul className="list">
            {section.items.map(item => (
              <li key={item.id} className="row">
                <div className="media">
                  <img src={item.img} alt={item.title} />
                </div>

                <div className="meta">
                  <div className="name">{item.title}</div>
                  <div className="price">£{item.price.toFixed(2)}</div>
                </div>

                <button className="add-btn" onClick={() => onAdd(item)} aria-label={`Add ${item.title}`}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="11" />
                    <path d="M12 7v10M7 12h10" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
