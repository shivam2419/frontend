// ScrapCollectorChat.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import "../style/Chat.css";
import { FaBars, FaTimes } from "react-icons/fa";

const ScrapCollectorChat = () => {
  const backendUrl = "https://scrapbridge-api-r54n.onrender.com/api/";
  const { orderId } = useParams();
  const collectorId = localStorage.getItem("user_id");
  const [orders, setOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(
    orderId ? { order_id: orderId } : null
  );
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [canChat, setCanChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("access");
  const socket = io("https://scrapbridge-chat-app-backend.onrender.com", {
    auth: { token },
  });

  // Fetch collector orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}all-order-details/${collectorId}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrders(res.data.data || []);
      } catch (err) {
        console.error(err);
        setOrders([]);
      }
    };
    if (collectorId) fetchOrders();
  }, [collectorId, token]);

  // Chat setup
  useEffect(() => {
    if (!activeOrder) return;

    const checkOrderStatus = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}user-order-detail/${activeOrder.order_id}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCanChat(res.data.data.status === true);

        socket.emit("joinRoom", { orderId: activeOrder.order_id });
        socket.on("oldMessages", (msgs) => setMessages(msgs));
        socket.on("receiveMessage", (msg) =>
          setMessages((prev) => [...prev, msg])
        );
      } catch (err) {
        setCanChat(false);
      }
    };

    checkOrderStatus();

    return () => {
      socket.off("oldMessages");
      socket.off("receiveMessage");
    };
  }, [activeOrder]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!canChat || input.trim() === "") return;
    const msgData = {
      orderId: activeOrder.order_id,
      senderId: collectorId,
      receiverId: activeOrder.user_id,
      message: input,
      timestamp: new Date(),
    };
    socket.emit("sendMessage", msgData);
    setInput("");
  };

  // Filter orders
  const filteredOrders = orders.filter((order) =>
    order.order_id.toString().includes(searchQuery.trim())
  );

  return (
    <div className="chat-main-container">
      {/* Sidebar */}
      <div className={`chat-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h3>Assigned Orders</h3>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes />
          </button>
        </div>
        {/* Search bar */}
        <input
          type="text"
          className="chat-search"
          placeholder="Search by Order ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Orders list */}
        {filteredOrders.map((order) => (
          <div
            key={order.order_id}
            className={`chat-order-item ${
              activeOrder?.order_id === order.order_id ? "active" : ""
            }`}
            onClick={() =>
              setActiveOrder({
                order_id: order.order_id,
                user_id: order.user_id,
              })
            }
          >
            <span
              className={`status-dot ${order.status ? "green" : "red"}`}
            ></span>
            <div>
              <p>Order #{order.order_id}</p>
              <small>{order.status ? "Ongoing" : "Completed"}</small>
            </div>
          </div>
        ))}
      </div>

      {/* Chat window */}
      <div className="chat-window">
        {!activeOrder ? (
          <div className="no-chat">Select an order to chat</div>
        ) : (
          <>
            {/* Header */}
            <div className="chat-header">
              <div className="chat-header-left">
                {!sidebarOpen && (
                  <button
                    className="sidebar-toggle-open"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <FaBars />
                  </button>
                )}
                <span className="brand-name">SCRAPBRIDGE</span>
              </div>

              <div className="chat-header-right">
                <h3>Chat - Order {activeOrder.order_id}</h3>
                {!canChat && (
                  <span className="chat-disabled">
                    Chat not allowed for this order
                  </span>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="chat-messages">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`chat-bubble ${
                    msg.senderId === collectorId ? "sent" : "received"
                  }`}
                >
                  <p>{msg.message}</p>
                  <span>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            {canChat && (
              <div className="chat-input">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message..."
                />
                <button onClick={sendMessage} className="send-btn">
                  Send
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ScrapCollectorChat;
