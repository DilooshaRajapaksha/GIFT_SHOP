import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./Pages/LoginPage/LoginPage";
import RegisterPage from "./Pages/RegisterPage/RegisterPage";
import ProfileUpdate from "./Pages/ProfileUpdate/ProfileUpdate";
import AdminPage from "./Pages/AdminPage/AdminPage";
import UserPage from "./Pages/UserPage/UserPage";
import ForgotPage from "./Pages/ForgotPage/ForgotPage";
import ProfilePage from "./Pages/ProfilePage/ProfilePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/update" element={<ProfileUpdate />} />
        <Route path="/Admin" element={<AdminPage />} />
        <Route path="/UserPage" element={<UserPage />} />
        <Route path="/forgot-password" element={<ForgotPage />} />
      </Routes>
    </Router>
  );
}

export default App;