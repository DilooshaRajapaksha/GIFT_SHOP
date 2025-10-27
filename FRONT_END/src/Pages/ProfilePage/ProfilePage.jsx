import React, { useEffect, useState } from "react";
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
      setMessage("Please login first.");
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
          "Failed to load profile. Please login again.";
        setMessage(errorMessage);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("userId");    
    localStorage.removeItem("role");
    localStorage.removeItem("seenSplash");

    sessionStorage.removeItem("jwt");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("seenSplash");
    navigate("/login");
  };

  if (message) {
    return (
      <>
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