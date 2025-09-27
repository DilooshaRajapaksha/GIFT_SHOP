import React from 'react'

import './Giftbox.css';

import Products from '../../Components/Products/Products';
import Filters from '../../Components/FilterBy/Filter';

function Home() {
  return (
    
    <main className="content">
        <div className="layout">
          <aside className="sidebar">
            <Filters onChange={(s) => console.log("filters:", s)} />
          </aside>

          <section className="results">

            <Products />
          </section>
        </div>
      </main>
  )
}

export default Home