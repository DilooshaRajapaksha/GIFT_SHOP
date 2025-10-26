import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import Input from "../../Components/Input/Input";
import Button from "../../Components/Button/Button";
import Header from "../../Components/Header/Header";
import "../../Components/Input/Input.css";
import "../../Components/Button/Button.css";
import "./RegisterPage.css";
import { Link } from "react-router-dom";
import welcomeImage from "../../assets/images/login.png";
import axios from "axios";

function RegisterPage() {
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate(); 

  const handleRegister = () => {
    if (!email || !email.includes("@")) {
      alert("Invalid email format");
      return;
    }
    if (password !== confirmedPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!/^\d{10}$/.test(phoneNumber)) {
      alert("Phone number must be 10 digits");
      return;
    }

    if (
    password.length < 6 ||
    !/[A-Z]/.test(password) ||        
    !/[^a-zA-Z0-9]/.test(password)   
  ) {
    alert("Password must be at least 6 characters, include an uppercase letter and a symbol");
    return;
  }


    axios.post("http://localhost:8082/register", {
      fname,
      lname,
      email,
      password,
      confirmedPassword,
      address,
      phoneNumber
    })
    .then(() => {
      alert("Registration successful!");
      navigate("/login"); //navigate to login
    })
    .catch(() => alert("Registration failed"));
  };

  return (
    <>
      <Header />
      <div className="register-wrapper">
        <div className="register-box">
          {/* Left image side */}
          <div
            className="register-image"
            style={{
              backgroundImage: `url(${welcomeImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          >
            <div className="welcome-text">Welcome Page</div>
          </div>

          {/* Right form side */}
          <div className="register-form">
            <h3>REGISTER</h3>

            <div className="form-row">
              <Input
                type="text"
                id="fname"
                label="First Name"
                placeholder="Enter your first name"
                value={fname}
                onChange={e => setFname(e.target.value)}
              />
              <Input
                type="text"
                id="lname"
                label="Last Name"
                placeholder="Enter your last name"
                value={lname}
                onChange={e => setLname(e.target.value)}
              />
            </div>

            <Input
              type="email"
              id="email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <div className="form-row">
              <Input
                type="password"
                id="password"
                label="Password"
                placeholder="Create a password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <Input
                type="password"
                id="confirmedPassword"
                label="Confirm Password"
                placeholder="Re-enter password"
                value={confirmedPassword}
                onChange={e => setConfirmedPassword(e.target.value)}
              />
            </div>

            <Input
              type="text"
              id="address"
              label="Address"
              placeholder="Enter your address"
              value={address}
              onChange={e => setAddress(e.target.value)}
            />

            <Input
              type="tel"
              id="phoneNumber"
              label="Phone Number"
              placeholder="eg: 0771234567"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
            />

            <div className="button-row">
              <Button label="Sign Up" onClick={handleRegister} />
            </div>

            <Link to="/login" className="sign-in">Already have an account?</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default RegisterPage;