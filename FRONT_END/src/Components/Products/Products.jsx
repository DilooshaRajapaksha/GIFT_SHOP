import "./Products.css";

// Products.jsx
export default function Products() {
  const items = [
    { id: 1, title: "Celebration Collection", price: 75,  img: "/img/1.jpg" },
    { id: 2, title: "Wellness Retreat",       price: 88,  img: "/img/2.jpg" },
    { id: 3, title: "Gourmet Delights",       price: 62.5,img: "/img/3.jpg" },
    { id: 4, title: "New Beginnings",         price: 95,  img: "/img/4.jpg" },
    { id: 5, title: "Cozy Comforts",          price: 55,  img: "/img/5.jpg" },
    { id: 6, title: "Floral Fantasy",         price: 70,  img: "/img/6.jpg" },
    { id: 7, title: "Sweet Tooth Box",        price: 48,  img: "/img/7.jpg" },
    { id: 8, title: "Home Spa Essentials",    price: 110, img: "/img/8.jpg" },
  ];

  return (
    <section className="page">
      <div className="product-grid">
        {items.map(p => (
          <article key={p.id} className="card">
            <div className="media">
              <img src={p.img} alt={p.title} loading="lazy" />
            </div>
            <h3 className="title">{p.title}</h3>
            <div className="price">£{p.price.toFixed(2)}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
