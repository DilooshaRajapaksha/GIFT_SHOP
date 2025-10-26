import React, { useEffect, useState } from "react";
import Header from "../../Components/Header/Header";
import Button from "../../Components/Button/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";
import profileImage from "../../assets/images/profile.png";

function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwt") || sessionStorage.getItem("jwt");

    if (!token) {
      setMessage("No token found. Please log in.");
      return;
    }

    axios
      .get("http://localhost:8082/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProfile(res.data))
      .catch((err) => {
        console.error("Failed to load profile", err.response?.data || err.message);
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to load profile. Please log in again.";
        setMessage(errorMessage);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    sessionStorage.removeItem("jwt");
    navigate("/login");
  };

  if (message) {
    return (
      <>
        <Header />
        <div className="page-center">
          <div className="profile-box">
            <p className="message">{message}</p>
            <Button type="button" label="Go to Login" onClick={handleLogout} />
          </div>
        </div>
      </>
    );
  }

  if (!profile) return <div>Loading...</div>;

  return (
    <>
      <Header />
      <div className="page-center">
        <div className="profile-box">
          <img src={profileImage} alt="Profile" className="profile-avatar" />
          <h1>My Profile</h1>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>First Name:</strong> {profile.firstName}</p>
          <p><strong>Last Name:</strong> {profile.lastName}</p>
          <p><strong>Address:</strong> {profile.address}</p>
          <p><strong>Phone Number:</strong> {profile.phoneNumber}</p>
          <div className="button-row">
            <Button type="button" label="Update" onClick={() => navigate("/profile/update")} />
            <Button type="button" label="Logout" onClick={handleLogout} />
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;