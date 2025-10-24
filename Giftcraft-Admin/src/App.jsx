import { useState } from 'react'
import './App.css'
import Header from './Components/Header/Header'
import CreateGiftbox from './Pages/CreateGiftbox/CreateGiftbox'
import ItemsManagement from "./Pages/ItemsManagement/ItemsManagement";
import ManageGiftboxes from "./Pages/ManageGiftboxes/ManafeGiftboxes";
import Orders from "./Pages/Orders/OrdersManagement";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GiftboxProvider } from './context/GiftboxContext';

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Header />
      <div className="page-container">
        <Routes>
          <Route path="/" element={<Navigate to="/giftboxes/create" replace />} />
          <Route path="/items" element={<ItemsManagement />} />
          <Route
            path="/giftboxes/create"
            element={
              <GiftboxProvider>
                <CreateGiftbox />
              </GiftboxProvider>
            }
          />
          <Route path="/giftboxes/manage" element={<ManageGiftboxes />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App
