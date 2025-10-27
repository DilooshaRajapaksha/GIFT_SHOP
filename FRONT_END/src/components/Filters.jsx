import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams, createSearchParams } from 'react-router-dom'
import { api } from '../api/client'
export default function Filters(){
  const [cats, setCats] = useState([
    { category_id: '1', name: 'Electronics' },
    { category_id: '2', name: 'Books' },
    { category_id: '3', name: 'Toys' }
  ])
  
  // Commented out API call since backend is still not available
  // useEffect(()=>{ api.get('/categories').then(r=>setCats(r.data)) },[])
  const [sp] = useSearchParams()
  const nav = useNavigate()
  const [range, setRange] = useState(sp.get('range')||'')
  const [category, setCategory] = useState(sp.get('categoryId')||'')
  useEffect(()=>{
    const params = {}
    if (category) params.categoryId = category
    if (range) params.range = range
    if (sp.get('q')) params.q = sp.get('q')
    nav({
      pathname:'/',
      search: createSearchParams(params).toString()
    })
  }, [range, category, sp])
  return (
    <aside className="filters">
      <h3>Filter By</h3>
      <div className="list-row"><strong>Category</strong></div>
      <select value={category} onChange={e=>setCategory(e.target.value)} style={{width:'100%', padding:8}}>
        <option value="">All</option>
        {cats.map(c => <option key={c.category_id} value={c.category_id}>{c.name}</option>)}
      </select>
      <div className="list-row" style={{marginTop:16}}><strong>Price Range</strong></div>
      <select value={range} onChange={e=>setRange(e.target.value)} style={{width:'100%', padding:8}}>
        <option value="">Any</option>
        <option value="0-20">Under LKR 5000</option>
        <option value="20-50">LKR 5000 - LKR 20000</option>
        <option value="50-99999">Over LKR 20000</option>
      </select>
    </aside>
  )
}
