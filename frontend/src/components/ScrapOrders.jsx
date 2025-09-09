import React, { useEffect, useState } from "react";
import loader from "../assets/loader.gif";
import { Link } from "react-router-dom";
import "../style/ScrapOrders.css"; // Import CSS

const ScrapOrders = () => {
  const userId = localStorage.getItem("user_id"); 
  const backendUrl = "https://scrapbridge-api-r54n.onrender.com/api/";

  const [currentOrders, setCurrentOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  const fallbackImage =
    "https://5.imimg.com/data5/SELLER/Default/2022/9/DD/LB/XQ/4044508/crain-transportation-services.jpeg";

  const openImageModal = (imgSrc) => {
    setModalImage(imgSrc);
    setIsModalOpen(true);
  };

  const closeImageModal = () => {
    setIsModalOpen(false);
    setModalImage(null);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("access");

        const res = await fetch(`${backendUrl}scrap-orders/${userId}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          if (res.status === 401) {
            console.error("Unauthorized! Please log in.");
          }
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        setCurrentOrders(data.ongoing_orders || []);
        setCompletedOrders(data.completed_orders || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching scrap orders:", err);
      }
    };

    if (userId) fetchOrders();
  }, [userId]);

  if (loading)
    return (
      <center className="loading">
        <img src={loader} alt="" />
        <p>Loading orders...</p>
      </center>
    );

  return (
    <div className="orders-wrapper">
      <h1 className="page-title">📦 Scrap Orders</h1>

      {/* Ongoing Orders */}
      <section className="section">
        <h2 className="section-title">🟡 Ongoing Orders</h2>
        {currentOrders.length === 0 ? (
          <p className="empty-text">No ongoing orders 🚫</p>
        ) : (
          <div className="grid">
            {currentOrders.map((order) => (
              <div key={order.order_id} className="card">
                <div className="card-header">
                  <h3 className="order-id">#{order.order_id}</h3>
                  <span className="badge ongoing">Ongoing</span>
                </div>
                <p>
                  <strong>Weight:</strong> {order.weight} kg
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(order.date).toLocaleString()}
                </p>
                <p>
                  <strong>Scrap collector:</strong>{" "}
                  {order.organisation_name.replace(/_/g, " ").toUpperCase()}
                </p>
                {order.image && (
                  <img
                    src={order.image}
                    alt="Scrap"
                    className="scrap-img"
                    onClick={() => openImageModal(order.image)}
                    onError={(e) => (e.target.src = fallbackImage)}
                  />
                )}
                <Link
                  to={`/chat/${order.order_id}/${userId}/${order.organisation_id}`}
                  className="chat-btn"
                >
                  💬 Chat with Collector
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Completed Orders */}
      <section className="section">
        <h2 className="section-title">🟢 Completed Orders</h2>
        {completedOrders.length === 0 ? (
          <p className="empty-text">No completed orders ✅</p>
        ) : (
          <div className="grid">
            {completedOrders.map((order, index) => (
              <div key={index} className="card">
                <div className="card-header">
                  <h3 className="order-id">Txn: {order.transaction_id}</h3>
                  <span className="badge completed">Completed</span>
                </div>
                <p>
                  <strong>Amount:</strong> ₹{order.amount}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(order.created).toLocaleString()}
                </p>
                <p>
                  <strong>Scrap collector:</strong>{" "}
                  {order.organisation_name.replace(/_/g, " ").toUpperCase()}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <span className="close-btn" onClick={closeImageModal}>
            ×
          </span>
          <img src={modalImage} alt="Full view" className="modal-img" />
        </div>
      )}
    </div>
  );
};

export default ScrapOrders;
