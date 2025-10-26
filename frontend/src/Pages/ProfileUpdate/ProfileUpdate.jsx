import React, { useState, useEffect } from "react";
import Header from "../../Components/Header/Header";
import Input from "../../Components/Input/Input";
import Button from "../../Components/Button/Button";
import "../../Components/Input/Input.css";
import "../../Components/Button/Button.css";
import "./ProfileUpdate.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ProfileUpdate() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    address: "",
    phoneNumber: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwt") || sessionStorage.getItem("jwt");// access to the page without remeber me 
    axios.get("http://localhost:8082/profile", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setFormData({
        fname: res.data.firstName || "",
        lname: res.data.lastName || "",
        address: res.data.address || "",
        phoneNumber: res.data.phoneNumber || "",
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
      });
    })
    .catch(() => {
      setMessage("Failed to load profile. Please log in again.");
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleUpdate = () => {
    if (!formData.currentPassword) {
      setMessage("Please enter your current password to update.");
      return;
    }

    const token = localStorage.getItem("jwt") || sessionStorage.getItem("jwt"); //to both remember me and not remember me
    axios.put("http://localhost:8082/profile/update", formData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => setMessage("Profile updated successfully!"))
    .catch(err => {
      setMessage(err.response?.data || "Update failed. Please check your details.");
    });
  };

  const handleDeleteAccount = () => {
  const token = localStorage.getItem("jwt") || sessionStorage.getItem("jwt");

  if (!formData.currentPassword) {
    setMessage("Please enter your current password before deleting.");
    return;
  }

  axios.delete("http://localhost:8082/profile/delete", {
    headers: { Authorization: `Bearer ${token}` },
    data: { currentPassword: formData.currentPassword }
  })
  .then(() => {
    setMessage("Account deleted successfully.");
    localStorage.removeItem("jwt");
    navigate("/register");
  })
  .catch(err => {
    setMessage(err.response?.data || "Delete failed. Please try again.");
  });
};

  return (
    <>
      <Header />
      <div className="page-center">
        <div className="profile-box">
          <h1>Update Your Profile</h1>
          <form className="profile-form">
            <div className="form-row">
              <div className="input-wrapper">
                <Input type="text" id="fname" label="First Name" value={formData.fname} onChange={handleChange} />
              </div>
              <div className="input-wrapper">
                <Input type="text" id="lname" label="Last Name" value={formData.lname} onChange={handleChange} />
              </div>
            </div>

            <div className="input-wrapper full-width">
              <Input type="text" id="address" label="Address" value={formData.address} onChange={handleChange} />
            </div>

            <div className="input-wrapper full-width">
              <Input type="text" id="phoneNumber" label="Phone Number" value={formData.phoneNumber} onChange={handleChange} />
            </div>

            <div className="input-wrapper full-width">
              <Input type="password" id="currentPassword" label="Current Password" value={formData.currentPassword} onChange={handleChange} placeholder="Enter your current password"/>
            </div>

            <div className="form-row">
              <div className="input-wrapper">
                <Input type="password" id="newPassword" label="New Password" value={formData.newPassword} onChange={handleChange} placeholder="optional"/>
              </div>
              <div className="input-wrapper">
                <Input type="password" id="confirmNewPassword" label="Confirm New Password" value={formData.confirmNewPassword} onChange={handleChange} placeholder="optional" />
              </div>
            </div>

            <div className="button-row">
              <Button type="button" label="Update Profile" onClick={handleUpdate} />
              <Button type="button" label="Delete Account" onClick={handleDeleteAccount} />
            </div>

            {message && <p className="message">{message}</p>}
          </form>
        </div>
      </div>
    </>
  );
}

export default ProfileUpdate;