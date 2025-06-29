import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import notificationIcon from "../assets/notification.png";
import defaultProfile from "../assets/default.jpg";
import "../style/Navbar.css";
export const Navbar = () => {
  const backendUrl = "https://scrapbridge-api-r54n.onrender.com/api/";
    // const backendUrl = 'http://127.0.0.1:8000/api/';
  const [unseenCount, setUnseenCount] = useState(0);
  let userName = localStorage.getItem("username");
  let profileImage = localStorage.getItem("user_profile");
  const logoutGif = "https://i.pinimg.com/originals/47/03/09/4703093a70ba47001bf2c86319aae091.gif";
  const [logoutLoader, setLogoutLoader] = useState(false);
  if (!profileImage) {
    profileImage = defaultProfile;
  }
  if (userName) {
    userName = userName.toUpperCase();
  }
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
      setLogoutLoader(true);
      await fetch(backendUrl + "logout/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: localStorage.getItem("refresh") }),
      });
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      localStorage.clear();
      setLogoutLoader(false);
      window.location.href = "/";
    }
  };

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication
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
      if (data.role === "recycler") {
        window.location.href = "/scrap-collector";
        return;
      }
      if (data.isAuthenticated) {
        setIsAuthenticated(true);
        const userInfoResponse = await fetch(
          backendUrl + `get-enduser/${localStorage.getItem("user_id")}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const userInfo = await userInfoResponse.json();
        if (
          !userInfo.phone ||
          !userInfo.street ||
          !userInfo.city ||
          !userInfo.state ||
          !userInfo.zipcode
        ) {
          if (window.location.pathname !== "/profile") {
            window.location.href = "/profile";
          }
          return;
        }
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

  // Handle click outside for sidebar
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

  // Get notification count
  const getNotificationCount = async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      return;
    }
    try {
      const res = await fetch(backendUrl + "notifications/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        body: JSON.stringify({ user_id: localStorage.getItem("user_id") }),
      });
      const json = await res.json();
      if (res.ok) {
        const unseenCount = json.data.filter((n) => !n.seen).length;
        setUnseenCount(unseenCount);
      }
    } catch (err) {
      console.error("error", err);
    }
  };
  useEffect(() => {
    getNotificationCount();
  }, []);
  if (logoutLoader) {
    return (
      <div style={styles.overlay}>
        <img src={logoutGif} alt="Logging out..." style={styles.loaderImage} />
      </div>
    );
  }
  return (
    <div>
      <div id="mySidebar" className="sidebar">
        <button className="closebtn" onClick={closeNav}>
          &times;
        </button>
        <br />
        <Link to="/">Home</Link>
        <Link to="/about">About Us</Link>
        <Link to="/e-facility">Book Recycling</Link>
        <Link to="/education">Education</Link>
        <Link to="/contact">Contact Us</Link>
        <Link to="https://huggingface.co/spaces/shivam2419/scrap-classification">
          Classify-Image
        </Link>
        {isAuthenticated && <Link to="/scrap-orders">Orders</Link>}
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
              <Link to="/e-facility">Book Recycling</Link>
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
            <li>{isAuthenticated && <Link to="/scrap-orders">Orders</Link>}</li>
            <li>
              {isAuthenticated && (
                <Link onClick={logout} style={{ color: "red" }}>
                  Logout
                </Link>
              )}
            </li>
          </ul>

          {isAuthenticated && (
            <div style={{ display: "flex" }}>
              <button id="notification" className="notification-button">
                <Link to="/notification" className="notification-link">
                  <div className="notification-wrapper">
                    {unseenCount > 0 && (
                      <span className="notification-badge">{unseenCount}</span>
                    )}
                    <img
                      src={notificationIcon}
                      alt="Notification"
                      className="notification-icon"
                    />
                  </div>
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
                    <img
                      src={profileImage}
                      alt="Profile"
                      style={{ border: "1px solid cyan" }}
                      onError={(e) => {
                        e.target.onerror = null; // prevent infinite loop
                        e.target.src = defaultProfile; // fallback image path
                      }}
                    />
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
const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "white", // Optional: light overlay
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999, // Ensure it's on top
  },
  loaderImage: {
    maxWidth: "200px", // Adjust as needed
    maxHeight: "200px",
  },
};
