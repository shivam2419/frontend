import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../style/Scrap_Collector/PendingPayments.css";
import rupeeImg from "../assets/rupee.png";
import loaderGIF from '../assets/loader.gif';
const PendingPayments = () => {
    const backendUrl = "https://scrapbridge-api.onrender.com/api/";
    const profileImg = "https://scrapbridge-api.onrender.com" + localStorage.getItem("user_profile");
    const user = {
        username: localStorage.getItem("username") ? localStorage.getItem("username") : "Undefined"
    };
    const [recycledItemData, setRecycledItemData] = useState([]); // State to store recycled item data (array)
    const [loading, setLoading] = useState(true);
    const user_id = localStorage.getItem("user_id");

    useEffect(() => {
        const fetchRecycledItemData = async () => {
            try {
                const response = await fetch(`${backendUrl}user-pending-order-detail/${user_id}/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('access')}`,
                    },
                });

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
                            const userResponse = await fetch(`${backendUrl}enduser/${item.user}/`, {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${localStorage.getItem('access')}`,
                                },
                            });

                            const userData = await userResponse.json();
                            return { ...item, username: userData.username };
                        } catch (userError) {
                            console.error(`Failed to fetch username for user ID ${item.user_id}:`, userError);
                            return { ...item, username: 'Unknown' };
                        }
                    })
                );

                setRecycledItemData(itemsWithUsernames);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching recycled item data:', error);
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
    return (
        <>
            <header>
                <div className="logosec">
                    <div className="logo">{user.username.toUpperCase()}</div>
                    <img
                        src="https://media.geeksforgeeks.org/wp-content/uploads/20221210182541/Untitled-design-(30).png"
                        className="icn menuicn"
                        id="menuicn"
                        alt="menu-icon"
                    />
                </div>

                <div className="searchbar">
                    <input type="text" placeholder="Search" />
                    <div className="searchbtn">
                        <img
                            src="https://media.geeksforgeeks.org/wp-content/uploads/20221210180758/Untitled-design-(28).png"
                            className="icn srchicn"
                            alt="search-icon"
                        />
                    </div>
                </div>

                <div className="message">
                    <div className="circle"></div>
                    <img
                        src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183322/8.png"
                        className="icn"
                        alt=""
                    />
                    <div className="dp">
                        <img
                            src={profileImg}
                            className="dpicn"
                            alt="dp"
                        />
                    </div>
                </div>
            </header>
            <div className="main-container">
                <div className="navcontainer">
                    <nav className="nav">
                        <div className="nav-upper-options">
                            <div className="nav-option opt">
                                <img
                                    src="https://media.geeksforgeeks.org/wp-content/uploads/20221210182148/Untitled-design-(29).png"
                                    className="nav-img"
                                    alt="dashboard"
                                />
                                <h3><Link to="/scrap-collector">Dashboard</Link></h3>
                            </div>

                            <div className="opt nav-option">
                                <img
                                    src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183322/9.png"
                                    className="nav-img"
                                    alt="articles"
                                />
                                <h3><Link to="/orders">Orders</Link></h3>
                            </div>

                            <div className="nav-option option4">
                                <img
                                    src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183321/6.png"
                                    className="nav-img"
                                    alt="institution"
                                />
                                <h3><Link to="/pending-order">Pending Payments</Link></h3>
                            </div>

                            <div className="nav-option option6">
                                <img
                                    src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183320/4.png"
                                    className="nav-img"
                                    alt="settings"
                                />
                                <h3><Link to={`/scrap-collector/profile`}>Settings</Link></h3>
                            </div>

                            <div className="nav-option logout">
                                <img
                                    src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183321/7.png"
                                    className="nav-img"
                                    alt="logout"
                                />
                                <h3><Link onClick={logout}>Logout</Link></h3>
                            </div>
                        </div>
                    </nav>
                </div>

                <div style={{ fontFamily: 'Arial, sans-serif', alignItems: 'center', height: '100vh', margin: 0, color: '#333' }} className='main'>
                    <h1 style={{ textAlign: 'left', marginBottom: '20px' }}>Pending Payment Orders</h1>
                    {loading ? (
                        <div className="loader-container">
                            <center>
                                <img src={loaderGIF} alt="Loading..." className="loader-gif" />
                                <p>Fetching data...</p>
                            </center>
                        </div>
                    ) : (
                        <div className="table-container" style={{ background: '#ffffff', padding: '30px', borderRadius: '15px', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '900px' }}>
                            <form>
                                {recycledItemData.length > 0 ? (
                                    <table className="my-table">
                                        <thead>
                                            <tr>
                                                <th>Order ID</th>
                                                <th>User ID</th>
                                                <th>Item Type</th>
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
                                                    <td data-label="Item Type">{items.item_type}</td>
                                                    <td data-label="Location">{items.location}</td>
                                                    <td data-label="Phone">{items.phone}</td>
                                                    <td data-label="Action">
                                                        <Link to={`/payment/${items.order_id}/${items.username}`}>
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
                                    <p style={{ textAlign: 'center', fontSize: '16px', color: '#00796b' }}>No pending orders found.</p>
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
