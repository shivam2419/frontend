import React, { useEffect, useState } from "react";
import loader from "../assets/loader.gif";
const ScrapOrders = () => {
  const userId = localStorage.getItem("user_id"); // Logged-in user ID
  const backendUrl = "https://scrapbridge-api-r54n.onrender.com/api/";
    // const backendUrl = 'http://127.0.0.1:8000/api/';

  const [currentOrders, setCurrentOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);

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
        const token = localStorage.getItem("access"); // Or wherever you store your auth token

        const res = await fetch(`${backendUrl}scrap-orders/${userId}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token for authenticated access
          },
        });
        if (!res.ok) {
          if (res.status === 401) {
            // Handle unauthorized error (e.g., redirect to login)
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
      <center>
        <img src={loader} alt="" />
        <p>Loading orders...</p>
      </center>
    );

  return (
    <div style={styles.wrapper}>
      <h2 style={{ marginBottom: "30px" }}>Scrap Orders</h2>

      <section style={styles.section}>
        <h3 style={{ marginBottom: "20px" }}>🟡 Ongoing Orders</h3>
        {currentOrders.length === 0 ? (
          <p>No ongoing orders.</p>
        ) : (
          currentOrders.map((order) => (
            <div key={order.order_id} style={styles.card}>
              <p>
                <strong>Order ID:</strong> {order.order_id}
              </p>
              <p>
                <strong>Weight:</strong> {order.weight / 1000} kg
              </p>
              <p>
                <strong>Date:</strong> {new Date(order.date).toLocaleString()}
              </p>
              <p>
                <strong>Scrap collector :</strong>{" "}
                {order.organisation_name.replace(/_/g, " ").toUpperCase()}
              </p>
              {order.image && (
                <img
                  src={`${order.image}`}
                  alt="Scrap"
                  style={styles.image}
                  onClick={() => openImageModal(order.image)}
                />
              )}
              {isModalOpen && (
                <div style={styles.modalOverlay}>
                  <span style={styles.closeButton} onClick={closeImageModal}>
                    ×
                  </span>
                  <img
                    src={modalImage}
                    alt="Full view"
                    style={styles.modalImage}
                  />
                </div>
              )}
            </div>
          ))
        )}
      </section>

      <section style={styles.section}>
        <h3 style={{ marginBottom: "20px" }}>🟢 Completed Orders</h3>
        {completedOrders.length === 0 ? (
          <p>No completed orders.</p>
        ) : (
          completedOrders.map((order, index) => (
            <div key={index} style={styles.card}>
              <p>
                <strong>Transaction ID:</strong> {order.transaction_id}
              </p>
              <p>
                <strong>Amount:</strong> ₹{order.amount}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(order.created).toLocaleString()}
              </p>
              <p>
                <strong>Scrap collector :</strong>{" "}
                {order.organisation_name.replace(/_/g, " ").toUpperCase()}
              </p>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

const styles = {
  wrapper: {
    padding: "30px",
    background: "#f4f4f4",
    minHeight: "100vh",
  },
  section: {
    marginBottom: "40px",
  },
  card: {
    background: "#fff",
    padding: "20px",
    marginBottom: "15px",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  image: {
    width: "150px",
    cursor: "pointer",
    borderRadius: "4px",
    marginTop: "10px"
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalImage: {
    maxWidth: "90%",
    maxHeight: "90%",
    borderRadius: "8px",
  },
  closeButton: {
    position: "absolute",
    top: "20px",
    right: "30px",
    fontSize: "40px",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
    zIndex: 1001,
  },
};

export default ScrapOrders;
