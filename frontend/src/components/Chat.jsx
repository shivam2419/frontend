import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import '../style/Chat.css';

const Chat = () => {
  const backendUrl = "https://scrapbridge-api-r54n.onrender.com/api/";
    // const backendUrl = 'http://127.0.0.1:8000/api/';
  const { orderId, userId, collectorId } = useParams();
  const [orders, setOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(orderId ? { order_id: orderId, collector_id: collectorId } : null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [canChat, setCanChat] = useState(false);
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("access");
  const socket = io("https://scrapbridge-chat-app-backend.onrender.com", { auth: { token } });

  // Fetch all user orders for sidebar
  useEffect(() => {
  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `${backendUrl}scrap-orders/${userId}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // If API returns { data: [...] }, do this:
      setOrders(res.data.ongoing_orders || []);
      // If API returns array directly:
      // setOrders(res.data || []);
    } catch (err) {
      console.error(err);
      setOrders([]);
    }
  };
  fetchOrders();
}, [userId]);


  // Load messages when active order changes
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

        socket.on("oldMessages", msgs => setMessages(msgs));
        socket.on("receiveMessage", msg => setMessages(prev => [...prev, msg]));
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

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = () => {
    if (!canChat || input.trim() === "") return;
    const msgData = {
      orderId: activeOrder.order_id,
      senderId: userId,
      receiverId: activeOrder.collector_id,
      message: input,
      timestamp: new Date(),
    };
    socket.emit("sendMessage", msgData);
    setInput("");
  };

  return (
    <div className="chat-main-container">
      {/* Sidebar */}
      <div className="chat-sidebar">
        <h3>My Orders</h3>
        {orders.map(order => (
          <div
            key={order.order_id}
            className={`chat-order-item ${activeOrder?.order_id === order.order_id ? "active" : ""}`}
            onClick={() => setActiveOrder({ order_id: order.order_id, collector_id: order.collector_id })}
          >
            <span className={`status-dot ${order.status ? "green" : "red"}`}></span>
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
            <div className="chat-header">
              <h3>Chat - Order {activeOrder.order_id}</h3>
              {!canChat && <span className="chat-disabled">Chat not allowed for this order</span>}
            </div>
            <div className="chat-messages">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`chat-bubble ${msg.senderId === userId ? "sent" : "received"}`}
                >
                  <p>{msg.message}</p>
                  <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            {canChat && (
              <div className="chat-input">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Type a message..."
                />
                <button onClick={sendMessage}>Send</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
