import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ShopItems from './pages/ShopItems.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import Layout from './shared/Layout.jsx'
import './styles.css'

const App = () => (
  <BrowserRouter>
    <Layout>
      <Routes>
        <Route path="/" element={<ShopItems />} />
        <Route path="/products/:id" element={<ProductDetails />} />
      </Routes>
    </Layout>
  </BrowserRouter>
)

createRoot(document.getElementById('root')).render(<App />)
