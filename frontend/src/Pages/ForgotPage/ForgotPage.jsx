import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import Input from "../../Components/Input/Input";
import Button from "../../Components/Button/Button";
import Header from "../../Components/Header/Header";
import "./ForgotPage.css";
import axios from "axios";

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); 

  const handleRequestCode = () => {
    if (!email) {
      setMessage("Please enter your email");
      return;
    }

    axios.post("http://localhost:8082/request-reset", { email })
      .then(() => {
        setMessage("Verification code sent to your email");
        setCodeSent(true);
      })
      .catch(err => {
        const msg =
          typeof err.response?.data === "string"
            ? err.response.data
            : err.response?.data?.message || "Failed to send code";
        setMessage(msg);
      });
  };

  const handleConfirmReset = () => {
    if (!code || !newPassword || !confirmNewPassword) {
      setMessage("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setMessage("Passwords do not match");
      return;
    }

    axios.post("http://localhost:8082/confirm-reset", {
      email,
      code,
      newPassword,
      confirmNewPassword
    })
    .then(() => {
      setMessage("Password reset successful");
      setTimeout(() => navigate("/login"), 1500);
    })
    .catch(err => {
      const msg =
        typeof err.response?.data === "string"
          ? err.response.data
          : err.response?.data?.message || "Reset failed";
      setMessage(msg);
    });
  };

  return (
    <>
      <Header />
      <div className="forgot-wrapper">
        <div className="forgot-box">
          <h2>Reset Your Password</h2>

          {!codeSent ? (
            <>
              <Input
                type="email"
                id="email"
                label="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
              <div className="button-row">
                <Button type="button" label="Send Code" onClick={handleRequestCode} />
              </div>
            </>
          ) : (
            <>
              <Input
                type="text"
                id="code"
                label="Verification Code"
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="Enter code from email"
              />
              <Input
                type="password"
                id="newPassword"
                label="New Password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
              <Input
                type="password"
                id="confirmNewPassword"
                label="Confirm New Password"
                value={confirmNewPassword}
                onChange={e => setConfirmNewPassword(e.target.value)}
                placeholder="Re-enter new password"
              />
              <div className="button-row">
                <Button type="button" label="Reset Password" onClick={handleConfirmReset} />
              </div>
            </>
          )}

          {message && <p className="message">{message}</p>}
        </div>
      </div>
    </>
  );
}

export default ForgotPage;