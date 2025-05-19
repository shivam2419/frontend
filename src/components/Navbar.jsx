import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import notificationIcon from "../assets/notification.png";
import defaultProfile from "../assets/default.jpg";
import "../style/Navbar.css";

export const Navbar = () => {
  const backendUrl = "https://scrapbridge-api.onrender.com/api/";
  let userName = localStorage.getItem("username");
  if (userName) {
    userName = userName.toUpperCase();
  }
  let profileImage = localStorage.getItem("user_profile");
  if (profileImage) {
    profileImage =
      "https://scrapbridge-api.onrender.com" + localStorage.getItem("user_profile");
  } else {
    profileImage = defaultProfile;
  }

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const openNav = () => {
    document.getElementById("mySidebar").style.display = "block";
    document.getElementById("nav-side-btn").style.display = "none";
  };

  const closeNav = () => {
    document.getElementById("mySidebar").style.display = "none";
    document.getElementById("nav-side-btn").style.display = "block";
  };

  const logout = async () => {
    try {
      await fetch(backendUrl + "logout/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: localStorage.getItem("refresh") }),
      });
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      localStorage.clear();
      window.location.href = "/";
    }
  };

  const checkAuth = async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      return;
    }
    try {
      const res = await fetch(backendUrl + "check-authentication/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) return; // silent return on 401

      const data = await res.json();

      if (data.isAuthenticated) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      // Only log unexpected errors
      if (!err.message.includes("401")) {
        console.error("Auth check failed:", err);
      }
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById("mySidebar");
      const navButton = document.getElementById("nav-side-btn");

      if (
        sidebar &&
        !sidebar.contains(event.target) &&
        !navButton.contains(event.target)
      ) {
        sidebar.style.display = "none";
        navButton.style.display = "block";
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div id="mySidebar" className="sidebar">
        <button className="closebtn" onClick={closeNav}>
          &times;
        </button>
        <br />
        <Link to="/">Home</Link>
        <Link to="/about">About Us</Link>
        <Link to="/e-facility">E-Facilities</Link>
        <Link to="/education">Education</Link>
        <Link to="/contact">Contact Us</Link>
        <Link to="https://huggingface.co/spaces/shivam2419/scrap-classification">
          Classify-Image
        </Link>
        {isAuthenticated && (
          <>
            <Link to="/notification">Notifications</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/" onClick={logout}>
              Logout
            </Link>
          </>
        )}

        {!isAuthenticated && <Link to="/login">Login</Link>}
      </div>

      <div className="main-content">
        <nav>
          <span style={{ display: "flex", marginBottom: "5px" }}>
            <button
              className="openbtn"
              onClick={openNav}
              id="nav-side-btn"
              style={{ marginTop: "5px" }}
            >
              ☰
            </button>
            <Link to="/" className="logo">
              <img src={logo} alt="Logo" />
            </Link>
          </span>

          <ul className="navbar-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/e-facility">E-Facilities</Link>
            </li>
            <li>
              <Link to="/education">Education</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
            <li>
              <Link to="https://huggingface.co/spaces/shivam2419/scrap-classification">
                Classify-Image
              </Link>
            </li>
          </ul>

          {isAuthenticated && (
            <div style={{ display: "flex" }}>
              <button id="notification">
                <Link to="/notification">
                  <img src={notificationIcon} alt="Notification" />
                </Link>
              </button>
              <Link
                to="/profile"
                className="right_side"
                style={{
                  display: "flex",
                  textDecoration: "none",
                  color: "black",
                }}
              >
                <li className="nav-item dropdown">
                  <span className="profile-image" id="profileImage">
                    <img src={profileImage} alt="Profile" />
                    <p>{userName}</p>
                  </span>
                </li>
              </Link>
            </div>
          )}
          {!isAuthenticated && (
            <span>
              <Link to="/login" className="btn">
                LOGIN
              </Link>
            </span>
          )}
        </nav>
      </div>
    </div>
  );
};
