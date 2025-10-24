import "./ProductCard.css";


export default function ProductCard({ product }) {
const { name, price, image, badge } = product;
return (
<article className="card">
<div className="media">
<img src={image} alt={name} loading="lazy" />
{badge && <span className="badge">{badge}</span>}
</div>
<div className="body">
<h3>{name}</h3>
<div className="row">
<span className="price">LKR {price.toLocaleString()}</span>
<button className="add">Add to cart</button>
</div>
</div>
</article>
);
}