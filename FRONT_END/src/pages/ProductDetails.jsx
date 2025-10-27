import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api/client'
function Stars({value}){ return <div className="stars">{'★'.repeat(Math.round(value||0))}{'☆'.repeat(5-Math.round(value||0))}</div> }
export default function ProductDetails(){
  const { id } = useParams()
  const [p, setP] = useState(null)
  const [reviews, setReviews] = useState([])
  const [qty, setQty] = useState(1)
  useEffect(()=>{
    // Mock data for testing without backend
    const mockProduct = {
      id: id,
      name: `Product ${id}`,
      price: 1500 + (id * 500),
      avgRating: 4.2,
      description: `This is a great product with amazing features. Product ID: ${id}`,
      stock: 15,
      imageUrl: `https://picsum.photos/seed/${id}/800/600`
    }
    const mockReviews = [
      { review_id: 1, rating: 5, comment: "Great product, highly recommended!" },
      { review_id: 2, rating: 4, comment: "Good quality, fast shipping." }
    ]
    setP(mockProduct)
    setReviews(mockReviews)
    
    // Uncomment these lines when backend is available:
    // api.get(`/products/${id}`).then(r=>setP(r.data))
    // api.get(`/products/${id}/reviews`).then(r=>setReviews(r.data))
  }, [id])
  const addToCart = async ()=>{
    // Mock add to cart - works without backend
    alert(`Added ${qty} item(s) to cart!`)
    
    // Uncomment when backend is available:
    // const userId = 1
    // await api.post(`/cart/${userId}/items`, { productId: Number(id), quantity: qty })
  }
  const submitReview = async (e)=>{
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const rating = Number(fd.get('rating'))
    const comment = fd.get('comment')
    
    // Mock review submission - works without backend
    const newReview = { 
      review_id: Date.now(), 
      rating: rating, 
      comment: comment 
    }
    setReviews([...reviews, newReview])
    e.currentTarget.reset()
    alert('Review submitted successfully!')
    
    // Uncomment when backend is available:
    // const payload = { userId: 1, rating: Number(fd.get('rating')), comment: fd.get('comment') }
    // const r = await api.post(`/products/${id}/reviews`, payload)
    // setReviews([...reviews, r.data]); e.currentTarget.reset()
  }
  if(!p) return <div className="container">Loading...</div>
  return (
    <div className="container details">
      <div className="product-details-grid">
        <div className="product-images">
          <div className="main-image">
            <img src={p.imageUrl || 'https://picsum.photos/seed/'+p.id+'/800/600'} alt={p.name}/>
          </div>
        </div>
        
        <div className="product-info">
          <h1 className="product-title">{p.name}</h1>
          <div className="product-price">LKR {Number(p.price).toFixed(2)}</div>
          <p className="product-description">{p.description}</p>
          
          <div className="quantity-section">
            <label>Quantity:</label>
            <input 
              type="number" 
              min="1" 
              value={qty} 
              onChange={e=>setQty(Number(e.target.value))}
              className="quantity-input"
            />
          </div>
          
          <button className="add-to-cart-btn" onClick={addToCart}>
            Add to Cart
          </button>
        </div>
      </div>
      <section style={{marginTop:24}}>
        <h3>Reviews</h3>
        {reviews.map(rv => <div key={rv.review_id} className="review"><Stars value={rv.rating}/><div>{rv.comment}</div></div>)}
        <div className="review">
          <h4>Add a review</h4>
          <form onSubmit={submitReview}>
            <label>Rating: <input type="number" name="rating" min="1" max="5" required /></label>
            <div><textarea name="comment" placeholder="Write your thoughts..."/></div>
            <button className="btn">Submit</button>
          </form>
        </div>
      </section>
    </div>
  )
}
