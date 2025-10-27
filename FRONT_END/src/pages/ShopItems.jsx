import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../api/client'
import ProductCard from '../components/ProductCard.jsx'
import Filters from '../components/Filters.jsx'

export default function ShopItems(){
  const [sp] = useSearchParams()
  const [page, setPage] = useState(0)
  const [data, setData] = useState({ 
    content: [
      {
        id: 1,
        name: "Sample Product 1",
        price: 29.99,
        avgRating: 4,
        reviewCount: 10,
        imageUrl: "https://picsum.photos/seed/1/400/300"
      },
      {
        id: 2,
        name: "Sample Product 2",
        price: 39.99,
        avgRating: 5,
        reviewCount: 15,
        imageUrl: "https://picsum.photos/seed/2/400/300"
      }
    ], 
    totalPages: 1 
  })
  const [loading, setLoading] = useState(false)  // Changed to false for mock data
  const [error, setError] = useState(null)

  // Comment out the API call for now to test UI
  /*useEffect(()=>{
    setLoading(true)
    setError(null)
    const q = sp.get('q')||undefined
    const categoryId = sp.get('categoryId')||undefined
    const r = sp.get('range')
    const [minPrice, maxPrice] = r ? r.split('-').map(Number) : [undefined, undefined]
    api.get('/products', { params:{ q, categoryId, minPrice, maxPrice, page, size:12 } })
      .then(res => {
        setData(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch products:', err)
        setError('Failed to load products. Please try again later.')
        setLoading(false)
      })
  }, [sp, page])*/
  return (
    <div className="container sidebar">
      <Filters/>
      <div style={{flex:1}}>
        <h2>All Items</h2>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div style={{color: 'red'}}>{error}</div>
        ) : data.content.length === 0 ? (
          <div>No items found</div>
        ) : (
          <div className="grid">
            {data.content.map(p => <ProductCard key={p.id} p={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}
