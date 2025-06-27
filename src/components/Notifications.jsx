import { useEffect, useState } from "react";
import loaderGIF from "../assets/loader.gif";
import "../style/Notification.css";

const Notifications = () => {
  const backendUrl = "https://scrapbridge-api-r54n.onrender.com/api/";
    // const backendUrl = 'http://127.0.0.1:8000/api/';
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(backendUrl + "notifications/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          body: JSON.stringify({
            user_id: localStorage.getItem("user_id")
          }),
        });
        
        const json = await res.json();
        if (res.status !== 200) {
          setLoading(true);
          alert("You are not Authorized");
          window.location.href = "/login";
        } else {
          setLoading(false);
        }
        setData(json.data);
        // Mark data as seen
        const markSeen = await fetch(backendUrl + "notifications/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          body: JSON.stringify({
            user_id: localStorage.getItem("user_id"),
            mark_seen: true,
          }),
        });
      } catch (err) {
        console.error("error", err);
      }
    };

    fetchData();
  }, []);

  // Filter data based on search term (case-insensitive)
  const filteredData = data.filter((item) => {
    const lowerSearch = searchTerm.toLowerCase();

    // Format date string to "23-may-2025"
    const formattedDate = new Date(item.created)
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .toLowerCase()
      .replace(/ /g, "-"); // replace spaces with dash for consistent format

    // Check if searchTerm matches message or formatted date substring
    return (
      item.message.toLowerCase().includes(lowerSearch) ||
      formattedDate.includes(lowerSearch)
    );
  });

  return (
    <div className="notification-container">
      <h1>Notifications :</h1>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search notifications..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "100%",
          padding: "8px 12px",
          marginBottom: "15px",
          borderRadius: "4px",
          border: "1px solid gray",
          fontSize: "16px",
        }}
      />

      {loading ? (
        <center>
          <img src={loaderGIF} alt="Loading..." style={{ width: "50px" }} />
        </center>
      ) : (
        <div className="notification-wrapper">
          {filteredData.length === 0 ? (
            <p>No notifications found.</p>
          ) : (
            filteredData.map((item, index) => (
              <div
                key={index}
                className={`notification-card ${
                  item.status === "True"
                    ? "notification-accepted"
                    : "notification-rejected"
                }`}
              >
                <div
                  className="notification-status"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {item.status === "True"
                    ? "Request Accepted :"
                    : "Request Rejected :"}
                  <p
                    style={{
                      textAlign: "right",
                      padding: "5px",
                      color: "gray",
                    }}
                  >
                    {new Date(item.created)
                      .toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      .replace(/ /g, "-")}
                  </p>
                </div>
                <div className="notification-message" id={item.seen ? "notification-message-seen" : "notification-message-unseen"}>{item.message}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
