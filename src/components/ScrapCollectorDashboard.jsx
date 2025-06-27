import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../style/Scrap_Collector/Style.css";
// import '../style/Scrap_Collector/Responsive.css';
import loaderGIF from "../assets/loader.gif";
const ScrapCollectorDashboard = () => {
  const backendUrl = "https://scrapbridge-api-r54n.onrender.com/api/";
    // const backendUrl = 'http://127.0.0.1:8000/api/';
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const toggleBtnRef = useRef(null);

  const profileImg = localStorage.getItem("user_profile")
    ? localStorage.getItem("user_profile")
    : "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Sending user to profile page if profile not completed
        const getOwnerInfoResponse = await fetch(
          `${backendUrl}owner/${localStorage.getItem("user_id")}/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
          }
        );
        if (getOwnerInfoResponse === 404) {
          alert("Scrap collector not found");
          return;
        }
        if (getOwnerInfoResponse.ok) {
          const ownerData = await getOwnerInfoResponse.json();
          if (
            !ownerData.city ||
            !ownerData.state ||
            !ownerData.street ||
            !ownerData.latitude ||
            !ownerData.longitude
          ) {
            alert("Please completed your information first");
            window.location.href = "/scrap-collector/profile";
            return;
          }
        }

        const response = await fetch(
          `${backendUrl}transaction-details/${localStorage.getItem(
            "user_id"
          )}/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
          }
        );

        // Setting up transaction done by user
        if (response.ok) {
          const data = await response.json();
          setItems(data.data);
          for (const transaction of data.data) {
            const enduser_id = transaction.user;

            if (!users[enduser_id]) {
              const userResponse = await fetch(
                `${backendUrl}enduser/${enduser_id}/`,
                {
                  method: "GET",
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("access")}`,
                  },
                }
              );

              if (userResponse.ok) {
                const userData = await userResponse.json();
                setUsers((prev) => ({
                  ...prev,
                  [enduser_id]: userData.username,
                }));
              }
            }
          }
        } else {
          alert(
            `Some error occured, please try again later : ${response.status}`
          );
          window.location.href = "/login";
        }
      } catch (e) {
        alert(
          `Some error occured, please try again later : ${response.status}`
        );
        window.location.href = "/login";
        console.log("Error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
  const user = {
    username: localStorage.getItem("username") || "Undefined",
  };

  const filteredItems = items.filter((item) => {
    const username = users[item.user] || "";
    const transactionId = item.transaction_id || "";
    const amount = item.amount?.toString() || "";

    return (
      username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      amount.includes(searchQuery)
    );
  });

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
  if (loading) {
    return (
      <div style={{ textAlign: "center", margin: "20%" }}>
        <img src={loaderGIF} alt="Loading..." style={{ width: "70px" }} />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div>
        <header>
          <div className="logosec">
            <Link className="logo" to="/scrap-collector">
              {user.username.toUpperCase()}
            </Link>
            <img
              ref={toggleBtnRef}
              src="https://media.geeksforgeeks.org/wp-content/uploads/20221210182541/Untitled-design-(30).png"
              className="icn menuicn"
              id="menuicn"
              alt="menu-icon"
              onMouseOver={toggleMenu}
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
        <div className="navbar" id="navbar" ref={sidebarRef}
  style={{ display: isSidebarOpen ? "block" : "none" }}>
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
            <nav className="nav">
              <div className="nav-upper-options">
                <Link className="nav-option option2" to="/scrap-collector">
                  <img
                    src="https://media.geeksforgeeks.org/wp-content/uploads/20221210182148/Untitled-design-(29).png"
                    className="nav-img"
                    alt="dashboard"
                  />
                  <h3>Dashboard</h3>
                </Link>

                <Link className="opt nav-option" to="/orders">
                  <img
                    src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183322/9.png"
                    className="nav-img"
                    alt="articles"
                  />
                  <h3 style={{ color: "black" }}>Orders</h3>
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
            <div className="searchbar2">
              <input type="text" placeholder="Search" />
              <div className="searchbtn">
                <img
                  src="https://media.geeksforgeeks.org/wp-content/uploads/20221210180758/Untitled-design-(28).png"
                  className="icn srchicn"
                  alt="search-button"
                />
              </div>
            </div>

            <div className="box-container">
              <Link className="box box1" >
                <div className="text">
                  <h3 className="topic-heading">60.5kg</h3>
                  <h3 className="topic">Scrap Recycled</h3>
                </div>
                <img
                  src="https://media.geeksforgeeks.org/wp-content/uploads/20221210184645/Untitled-design-(31).png"
                  alt="Views"
                />
              </Link>

              <Link className="box box2" >
                <div className="text">
                  <h3 className="topic-heading">153</h3>
                  <h3 className="topic">Users handled</h3>
                </div>
                <img
                  src="https://media.geeksforgeeks.org/wp-content/uploads/20221210185030/14.png"
                  alt="likes"
                />
              </Link>

              <Link className="box box3">
                <div className="text">
                  <h3 className="topic-heading">320</h3>
                  <h3 className="topic">Comments</h3>
                </div>
                <img
                  src="https://media.geeksforgeeks.org/wp-content/uploads/20221210184645/Untitled-design-(32).png"
                  alt="comments"
                />
              </Link>

              <Link className="box box4">
                <div className="text">
                  <h3 className="topic-heading">70k</h3>
                  <h3 className="topic">Earnings</h3>
                </div>
                <img
                  src="https://media.geeksforgeeks.org/wp-content/uploads/20221210185029/13.png"
                  alt="published"
                />
              </Link>
            </div>

            <div className="report-container">
              <div className="report-header">
                <h1 className="recent-Articles">Recent Transactions</h1>
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    padding: "6px 10px",
                    fontSize: "14px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    outline: "none",
                  }}
                />
              </div>

              <table className="report-body">
                <thead>
                  <tr className="report-topic-heading">
                    <th className="t-op">Username</th>
                    <th className="t-op">Transaction Id</th>
                    <th className="t-op">Amount</th>
                    <th className="t-op">Date</th>
                    <th className="t-op">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(users).length === 0 ? (
                    <tr>
                      <td colSpan="5">No transaction data found</td>
                    </tr>
                  ) : (
                    filteredItems.map((item, index) => (
                      <tr className="item1" key={index}>
                        <td className="t-op-nextlvl">
                          {users[item.user]?.toUpperCase() || "loading..."}
                        </td>
                        <td className="t-op-nextlvl">{item.transaction_id}</td>
                        <td className="t-op-nextlvl">{item.amount}</td>
                        <td className="t-op-nextlvl">
                          {new Date(item.created).toLocaleString("en-US", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}
                        </td>
                        <td className="t-op-nextlvl label-tag">Paid</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <script src="./index.js"></script>
      </div>
    </>
  );
};

export default ScrapCollectorDashboard;
