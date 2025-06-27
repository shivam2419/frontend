import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "../style/Scrap_Collector/PendingPayments.css";
import rupeeImg from "../assets/rupee.png";
import loaderGIF from "../assets/loader.gif";
const PendingPayments = () => {
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const toggleBtnRef = useRef(null);
  const [recycledItemData, setRecycledItemData] = useState([]); // State to store recycled item data (array)
  const [loading, setLoading] = useState(true);
  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchRecycledItemData = async () => {
      try {
        const response = await fetch(
          `${backendUrl}user-pending-order-detail/${user_id}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
          }
        );

        if (response.status == 403 || response.status == 401) {
          alert("Something went wrong, please login again");
          window.location.href = "/login";
        }
        const result = await response.json();
        const items = result.data;

        // Fetch usernames for each item using user_id
        const itemsWithUsernames = await Promise.all(
          items.map(async (item) => {
            try {
              const userResponse = await fetch(
                `${backendUrl}enduser/${item.user}/`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access")}`,
                  },
                }
              );

              const userData = await userResponse.json();
              return { ...item, username: userData.username };
            } catch (userError) {
              console.error(
                `Failed to fetch username for user ID ${item.user_id}:`,
                userError
              );
              return { ...item, username: "Unknown" };
            }
          })
        );

        setRecycledItemData(itemsWithUsernames);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching recycled item data:", error);
      }
    };

    fetchRecycledItemData();
  }, [user_id]);

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
            <img src={profileImg} className="dpicn" alt="dp" />
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
          <Link to="/pending-order">Pending orders</Link>
          <Link to="/scrap-collector/profile">Profile</Link>
          <Link onClick={logout}>Logout</Link>
        </div>
      </div>
      <div className="main-container">
        <div className="navcontainer">
          <nav className="nav">
            <div className="nav-upper-options">
              <Link className="nav-option opt" to="/scrap-collector">
                <img
                  src="https://media.geeksforgeeks.org/wp-content/uploads/20221210182148/Untitled-design-(29).png"
                  className="nav-img"
                  alt="dashboard"
                />
                <h3 style={{ color: "black" }}>Dashboard</h3>
              </Link>

              <Link className="opt nav-option" to="/orders">
                <img
                  src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183322/9.png"
                  className="nav-img"
                  alt="articles"
                />
                <h3 style={{ color: "black" }}>Orders</h3>
              </Link>

              <Link className="nav-option option4" to="/pending-order">
                <img
                  src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183321/6.png"
                  className="nav-img"
                  alt="institution"
                />
                <h3>Pending Payments</h3>
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

        <div
          style={{
            fontFamily: "Arial, sans-serif",
            alignItems: "center",
            height: "100vh",
            margin: 0,
            color: "#333",
          }}
          className="main"
        >
          <h1 style={{ textAlign: "left", marginBottom: "20px" }}>
            Pending Payment Orders
          </h1>
          {loading ? (
            <div className="loader-container">
              <center>
                <img src={loaderGIF} alt="Loading..." className="loader-gif" />
                <p>Fetching data...</p>
              </center>
            </div>
          ) : (
            <div className="table-container">
              <form>
                {recycledItemData.length > 0 ? (
                  <table className="my-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>User ID</th>
                        <th>Location</th>
                        <th>Phone</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recycledItemData.map((items) => (
                        <tr key={items.order_id}>
                          <td data-label="Order ID">{items.order_id}</td>
                          <td data-label="User ID">{items.username}</td>
                          <td data-label="Location">{items.location}</td>
                          <td data-label="Phone">{items.phone}</td>
                          <td data-label="Action">
                            <Link
                              to={`/payment/${items.order_id}/${items.username}`}
                            >
                              <button className="pay-now-btn">
                                <img src={rupeeImg} alt="" />
                                Pay now
                              </button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p
                    style={{
                      textAlign: "center",
                      fontSize: "16px",
                      color: "#00796b",
                    }}
                  >
                    No pending orders found.
                  </p>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PendingPayments;
