import React from 'react'
import { Link } from 'react-router-dom'
export default function ProductCard({p}){
  return (
    <div className="card">
      <img src={p.imageUrl || 'https://picsum.photos/seed/'+p.id+'/400/300'} alt={p.name}/>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:8}}>
        <h4 style={{margin:'8px 0'}}>{p.name}</h4>
        <span className="price">LKR {Number(p.price).toFixed(2)}</span>
      </div>
      <div className="stars">{'★'.repeat(Math.round(p.avgRating||0))}{'☆'.repeat(5-Math.round(p.avgRating||0))} ({p.reviewCount||0})</div>
      <div style={{display:'flex', gap:8, marginTop:8}}>
        <Link className="btn secondary" to={`/products/${p.id}`}>View</Link>
        <Link className="btn" to={`/products/${p.id}`}>Add to Cart</Link>
      </div>
    </div>
  )
}
