import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../style/Scrap_Collector/Orders.css"; // You can extract the style into this file
import loaderGIF from "../assets/loader.gif";

const ScrapCollectorOrders = () => {
  const backendUrl = "https://scrapbridge-api-r54n.onrender.com/api/";
    // const backendUrl = 'http://127.0.0.1:8000/api/';
  const profileImg = localStorage.getItem("user_profile")
    ? localStorage.getItem("user_profile")
    : "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg";
  const user = {
    username: localStorage.getItem("username")
      ? localStorage.getItem("username")
      : "Undefined",
  };
  const [items, setItem] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const toggleBtnRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access");
      setLoading(true);

      try {
        const response = await fetch(
          `${backendUrl}order-details/${localStorage.getItem("user_id")}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (response.ok) {
          const normalized = Array.isArray(result.data)
            ? result.data
            : [result.data];
          setItem(normalized);
        }

        if (response.status === 403 || response.status === 401) {
          alert("You are not Authorized");
          window.location.href = "/login";
        }
      } catch (error) {
        alert(`Some error occured, please try again later ${error}`);
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const logout = async () => {
    try {
      setLoading(true);
      await fetch(backendUrl + "logout/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: localStorage.getItem("refresh") }),
      });
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      setLoading(false);
      localStorage.clear();
      window.location.href = "/login";
    }
  };
  const toggleMenu = () => {
    setIsSidebarOpen((prev) => !prev);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        toggleBtnRef.current &&
        !toggleBtnRef.current.contains(event.target)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <>
      <header>
        <div className="logosec">
          <div className="logo">{user.username.toUpperCase()}</div>
          <img
            ref={toggleBtnRef}
            src="https://media.geeksforgeeks.org/wp-content/uploads/20221210182541/Untitled-design-(30).png"
            className="icn menuicn"
            id="menuicn"
            alt="menu-icon"
            onClick={toggleMenu}
          />
        </div>

        <div className="message">
          <div className="dp">
            <Link to="/scrap-collector/profile">
              <img src={profileImg} className="dpicn" alt="dp" />
            </Link>
          </div>
        </div>
      </header>
      <div
        className="navbar"
        id="navbar"
        ref={sidebarRef}
        style={{ display: isSidebarOpen ? "block" : "none" }}
      >
        <b
          onClick={toggleMenu}
          style={{
            float: "right",
            margin: "10px",
            marginRight: "20px",
            color: "white",
            fontSize: "20px",
          }}
        >
          X
        </b>
        <br />
        <div className="nav-links" id="navLinks">
          <Link to="/scrap-collector">Dashboard</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/pending-order">Pending Payments</Link>
          <Link to="/scrap-collector/profile">Profile</Link>
          <Link onClick={logout}>Logout</Link>
        </div>
      </div>

      <div className="main-container">
        <div className="navcontainer">
          <nav className="dashoard-nav">
            <div className="nav-upper-options">
              <Link className="nav-option opt" to="/scrap-collector">
                <img
                  src="https://media.geeksforgeeks.org/wp-content/uploads/20221210182148/Untitled-design-(29).png"
                  className="nav-img"
                  alt="dashboard"
                />
                <h3 style={{ color: "black" }}>Dashboard</h3>
              </Link>

              <Link className="option2 nav-option" to="/orders">
                <img
                  src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183322/9.png"
                  className="nav-img"
                  alt="articles"
                />
                <h3>Orders</h3>
              </Link>

              <Link className="nav-option opt" to="/pending-order">
                <img
                  src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183321/6.png"
                  className="nav-img"
                  alt="institution"
                />
                <h3 style={{ color: "black" }}>Pending Payments</h3>
              </Link>

              <Link
                className="nav-option option6"
                to={`/scrap-collector/profile`}
              >
                <img
                  src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183320/4.png"
                  className="nav-img"
                  alt="profile"
                />
                <h3 style={{ color: "black" }}>Profile</h3>
              </Link>

              <Link className="nav-option logout" onClick={logout}>
                <img
                  src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183321/7.png"
                  className="nav-img"
                  alt="logout"
                />
                <h3 style={{ color: "black" }}>Logout</h3>
              </Link>
            </div>
          </nav>
        </div>

        <div className="main">
          <h1>Orders:</h1>

          {loading ? (
            <div className="loader-container">
              <center>
                <img src={loaderGIF} alt="Loading..." className="loader-gif" />
                <p>Fetching data...</p>
              </center>
            </div>
          ) : (
            <div className="table-container">
              <table className="my-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Item Type</th>
                    <th>Pickup Date</th>
                    <th>Phone Number</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length > 0 ? (
                    items.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item?.weight} Kg</td>
                        <td>
                          {new Date(item.date).toLocaleString("en-US", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                            hour12: false,
                          })}
                        </td>
                        <td>{item.phone}</td>
                        <td>
                          <button>
                            <a href={`/scraprequest-details/${item.order_id}/`}>
                              Inspect
                            </a>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center" }}>
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ScrapCollectorOrders;
