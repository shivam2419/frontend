import { useEffect, useState } from 'react';
import loaderGIF from "../assets/loader.gif";
const Notifications = () => {
  const backendUrl = "https://scrapbridge-api.onrender.com/api/";
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // loader state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(backendUrl+"notifications/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          body: JSON.stringify({ user_id: localStorage.getItem("user_id") }),
        });
        const json = await res.json();
        if(res.status !== 200) {
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
    <div className="notification-container" style={{ margin: "2%" }}>
      <h1>Notifications :</h1>

      {loading ? (
        <center><img src={loaderGIF} alt="Loading..." style={{ width: '50px' }} /></center>
      ) : (
        <table>
          <tbody>
            {data?.map((item, index) => (
              <tr key={index}>
                <td style={{ backgroundColor: "rgb(146, 210, 255)", padding: "8px", width: "200px" }}>
                  {item.status === "True" ? "Request Accepted :" : "Request Rejected :"}
                </td>
                <td
                  style={{
                    backgroundColor:
                      item.status === "True"
                        ? "rgb(138, 255, 138)"
                        : "rgb(255, 105, 105)",
                    color: item.status === "True" ? "black" : "white",
                    padding: "5px",
                  }}
                >
                  {item.message}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Notifications;
