import { useEffect, useState } from 'react';
import loaderGIF from "../assets/loader.gif";
import "../style/Notification.css";

const Notifications = () => {
  const backendUrl = "https://scrapbridge-api.onrender.com/api/";
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(backendUrl + "notifications/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          body: JSON.stringify({ user_id: localStorage.getItem("user_id") }),
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
      } catch (err) {
        console.error("error", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="notification-container">
      <h1>Notifications :</h1>

      {loading ? (
        <center>
          <img src={loaderGIF} alt="Loading..." style={{ width: '50px' }} />
        </center>
      ) : (
        <div className="notification-wrapper">
          {data?.map((item, index) => (
            <div
              key={index}
              className={`notification-card ${
                item.status === "True" ? "notification-accepted" : "notification-rejected"
              }`}
            >
              <div className="notification-status">
                {item.status === "True" ? "Request Accepted :" : "Request Rejected :"}
              </div>
              <div className="notification-message">{item.message}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
