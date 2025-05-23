import React, { useEffect, useState } from "react";

const ScrapOrders = () => {
  const userId = localStorage.getItem("user_id"); // Logged-in user ID
  const backendUrl = "https://scrapbridge-api.onrender.com/api/";

  const [currentOrders, setCurrentOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p>Loading orders...</p>;

  return (
    <div style={styles.wrapper}>
      <h2>Scrap Orders</h2>

      <section style={styles.section}>
        <h3>🟡 Ongoing Orders</h3>
        {currentOrders.length === 0 ? (
          <p>No ongoing orders.</p>
        ) : (
          currentOrders.map((order) => (
            <div key={order.order_id} style={styles.card}>
              <p>
                <strong>Order ID:</strong> {order.order_id}
              </p>
              <p>
                <strong>Item:</strong> {order.item_type.toUpperCase()}
              </p>
              <p>
                <strong>Weight:</strong> {order.weight/1000} kg
              </p>
              <p>
                <strong>Date:</strong> {new Date(order.date).toLocaleString()}
              </p>
              <p>
                <strong>Scrap collector :</strong> {order.organisation_name.replace(/_/g, ' ').toUpperCase()}
              </p>
              {order.image && (
                <img
                  src={`https://scrapbridge-api.onrender.com${order.image}`}
                  alt="Scrap"
                  style={styles.image}
                />
              )}
            </div>
          ))
        )}
      </section>

      <section style={styles.section}>
        <h3>🟢 Completed Orders</h3>
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
                <strong>Owner ID:</strong> {order.owner_id}
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
    width: "100px",
    height: "100px",
    objectFit: "contain",
    borderRadius: "8px",
    marginTop: "10px",
  },
};

export default ScrapOrders;
