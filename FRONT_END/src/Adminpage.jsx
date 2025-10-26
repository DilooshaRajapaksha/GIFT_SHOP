import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './Admin/Components-admin/Header-admin/Header.jsx';
import ItemsManagement from './Admin/Pages-admin/ItemsManagement-admin/ItemsManagement.jsx';
import ManageGiftboxes from './Admin/Pages-admin/ManageGiftboxes-admin/ManafeGiftboxes.jsx';
import CreateGiftbox from './Admin/Pages-admin/CreateGiftbox-admin/CreateGiftbox.jsx';
import OrdersManagement from './Admin/Pages-admin/Orders-admin/OrdersManagement.jsx';
import './AdminPage.css';
import { GiftboxProvider } from './Admin/context-admin/GiftboxContext.jsx';

const isAdmin = () => {
  const token = localStorage.getItem('jwt') || sessionStorage.getItem('jwt');
  const role = localStorage.getItem('role') || sessionStorage.getItem('role');
  console.log('isAdmin check - Token:', !!token, 'Role:', role);
  return token && role?.toUpperCase() === 'ADMIN';
};

const ProtectedAdminRoute = ({ children }) => {
  const allowed = isAdmin();
  console.log("ProtectedAdminRoute check:", allowed);
  return allowed ? children : <Navigate to="/login" replace />;
};

export default function AdminPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    console.log("Checking admin access...");
    if (isAdmin()) {
      console.log('Admin page load successful');
      setIsAuthorized(true);
    }
  }, []);

  if (!isAuthorized) {
    return <div style={{ padding: "20px", textAlign: "center" }}>Checking access...</div>;
  }

  return (
    <ProtectedAdminRoute>
      <div className="admin-layout">
        <Header />
        <main className="admin-content">
          <Routes>
            <Route index element={
              <div style={{ padding: "24px 32px" }}>
                <h1 style={{ margin: 0 }}>Admin Dashboard</h1>
                <p style={{ color: "#6b7280" }}>Welcome! Use the top nav to manage items, orders, and giftboxes.</p>
              </div>
            } />
            <Route path="items" element={<ItemsManagement />} />
            <Route path="orders" element={<OrdersManagement />} />
            <Route path="giftboxes/manage" element={<ManageGiftboxes />} />
            <Route path="giftboxes/create" element={
              <GiftboxProvider>
                <CreateGiftbox />
              </GiftboxProvider>
            } />
          </Routes>
        </main>
      </div>
    </ProtectedAdminRoute>
  );
}