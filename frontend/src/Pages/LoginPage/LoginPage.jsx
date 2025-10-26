import React, { useState } from "react";
import Input from "../../Components/Input/Input";
import Button from "../../Components/Button/Button";
import Header from "../../Components/Header/Header";
import "./LoginPage.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import loginImage from "../../assets/images/login.png"; 

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    axios.post('http://localhost:8082/login', { email, password })
      .then(res => {
        const token = res.data.token;
        const role = res.data.role;

        if (token && role) {
          if(rememberMe){
            localStorage.setItem("jwt", token);
            localStorage.setItem("role", role);
          }else{
            sessionStorage.setItem("jwt", token);
            sessionStorage.setItem("role",role);
          }
          alert("Login successful!");

          if (role === "ADMIN") {
            navigate("/Admin");
          } else {
            navigate("/UserPage");
          }
        } else {
          alert("Login failed: Please login again");
        }
      })
      .catch(err => {
  const errorMessage = err.response?.data?.error || "Login failed";
  alert(errorMessage);
});
  };

  return (
    <>
      <Header />
      <div className="login-wrapper">
        <div className="login-box">
          <div className="login-form">
            <h3>WELCOME BACK</h3>
            <Input
              type="text"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
            <Input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            <div className="remember-row">
              <label htmlFor="rememberMe" className="remember-me">
                <input type="checkbox" id="rememberMe" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)} />Remember Me
              </label>
              <a href="/forgot-password" className="forgot-me">Forgot Password?</a>
            </div>
            <div className="button-row">
              <Button type="button" label="Log In" onClick={handleLogin} />
            </div>
            <div className="sign-up">
              <span>Don't have an account?</span>
              <Link to="/register">Sign up</Link>
            </div>
          </div>

          
          <div
            className="login-image"
            style={{
              backgroundImage: `url(${loginImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          >
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;