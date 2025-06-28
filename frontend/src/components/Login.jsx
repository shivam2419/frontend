import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/Login.css";
import loaderGIF from "../assets/loader.gif";

export const Login = () => {
  const backendUrl = "https://scrapbridge-api-r54n.onrender.com/api/";
    // const backendUrl = 'http://127.0.0.1:8000/api/';
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const [userType, setUserType] = useState("user"); // 'user' or 'recycler'
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // <-- Add this

    let { username, password } = formData;

    if (!username || !password) {
      alert("Please fill in both fields");
      setLoading(false); // <-- Add this
      return;
    }
    const old_username = username;
    username = username.trimEnd();
    username = username.toLowerCase();
    username = username.includes(" ")
      ? username.replace(/ /g, "_").toLowerCase()
      : username;

    const loginBtn = document.getElementById("login-btn");
    loginBtn.innerText = "Logging In...";
    loginBtn.disabled = true;
    if (loginBtn.disabled) {
      loginBtn.style.opacity = "50%";
    }
    try {
      const response = await fetch(backendUrl + "token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);

        const user_info = await fetch(backendUrl + "auth/user/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${data.access}`,
          },
        });

        const result = await user_info.json();
        if (result) {
          localStorage.setItem("user_id", result.id);
          localStorage.setItem("username", result.username);
          localStorage.setItem("email", result.email);
          localStorage.setItem("role", result.role);
          localStorage.setItem("user_profile", result.user_profile);
        }
        navigate(result.role === "user" ? "/" : "/scrap-collector");
        window.location.reload();
      } else {
        alert("Username or password is incorrect");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Some error occured, please try again");
    }

    setLoading(false); // <-- Add this
    setFormData({ username: old_username, password: "" });
    loginBtn.innerText = "Login";
    loginBtn.disabled = false;
    loginBtn.style.opacity = "100%";
  };

  const handleGoogleLogin = async (credentialResponse) => {
    const access_token = credentialResponse.credential;
    try {
      const response = await fetch(backendUrl + "auth/google/google-oauth2/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token,
          user_type: userType,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // You can skip storing access_token if not using JWT
        localStorage.setItem("user_id", data.user.id);
        localStorage.setItem("username", data.user.username);
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("role", data.user.role);

        alert("Google login successful!");

        navigate(data.user.role === "user" ? "/" : "/scrap-collector");
        window.location.reload();
      } else {
        alert(data.error || "Google login failed.");
      }
    } catch (err) {
      console.error("Google Login Error:", err);
      alert("Something went wrong during Google login.");
    }
  };

  return (
    <div className="form">
      {loading && (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <img src={loaderGIF} alt="Loading..." style={{ width: "50px" }} />
          <p>Logging in...</p>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <h1>Welcome back!</h1>
        <p>Please enter your details here</p>
        <br />

        <label htmlFor="username">User name*</label>
        <br />
        <input
          type="text"
          name="username"
          placeholder="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <label htmlFor="password">Password*</label>
        <br />
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          id="password"
          placeholder="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <br />

        <span>
          <span className="left">
            <input
              type="checkbox"
              id="show-password-checkbox"
              style={{ width: "20px", marginTop: "10px" }}
              onClick={() => setShowPassword((prev) => !prev)}
            />
            <label htmlFor="show-password-checkbox">
              {showPassword ? "Hide Password" : "Show Password"}
            </label>
          </span>
        </span>

        <button type="submit" id="login-btn">
          Login
        </button>

        {/* <div className="google-login-section">
                    <label>Select Role:</label>
                    <select value={userType} onChange={(e) => setUserType(e.target.value)}>
                        <option value="user">User</option>
                        <option value="recycler">Recycler</option>
                    </select>

                    <br /><br />
                    <GoogleLogin
                        onSuccess={handleGoogleLogin}
                        onError={() => {
                            alert("Google login failed.");
                        }}
                    />
                </div> */}

        <span id="signupBtn">
          <p>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </span>
      </form>
    </div>
  );
};
