import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import L from "leaflet";
import "leaflet-routing-machine";
import "../style/Scrap_Collector/ScrapRequestDetails.css";
import LoaderGIF from "../assets/loader.gif";
const ScrapRequestDetails = () => {
  const backendUrl = "https://scrapbridge-api-r54n.onrender.com/api/";
    // const backendUrl = 'http://127.0.0.1:8000/api/';
  const { orderId } = useParams();
  const [userData, setUserData] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [update, setUpdate] = useState(false);
  const [loader, setLoader] = useState(true);
  const mapRef = useRef(null); // Ref to store map instance
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${backendUrl}user-order-detail/${orderId}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        });
        const data = await res.json();
        if(res.ok) {
          setLoader(false);
          console.log(data);
        }
        const locationArray = data.data.location
          .split(" ")
          .map((coord) => coord.trim());

        if (locationArray.length === 2) {
          const [latitude, longitude] = locationArray.map(parseFloat);
          if (!isNaN(latitude) && !isNaN(longitude)) {
            setUserData({ ...data.data, latitude, longitude });
          } else {
            console.error("Invalid latitude or longitude values");
          }
        } else {
          console.error("Invalid location format:", data.data.location);
        }
      } catch (err) {
        console.error("Failed to fetch order details:", err);
      }
    };
    fetchData();
  }, [orderId]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
      }
    );
  }, []);

  useEffect(() => {
    if (userData && currentLocation) {
      // Clean up old map
      if (mapRef.current) {
        mapRef.current.off();
        mapRef.current.remove();
      }

      const destLat = parseFloat(userData.latitude);
      const destLng = parseFloat(userData.longitude);
      const startLatLng = L.latLng(currentLocation.lat, currentLocation.long);
      const destLatLng = L.latLng(destLat, destLng);

      // Initialize map
      const map = L.map("mapid").setView(startLatLng, 13);
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      // Add routing control
      const routingControl = L.Routing.control({
        waypoints: [startLatLng, destLatLng],
        routeWhileDragging: false,
        showAlternatives: false,
        addWaypoints: false,
        draggableWaypoints: false,
        createMarker: (i, wp) => {
          // customize markers if you want
          const marker = L.marker(wp.latLng);
          if (i === 0) marker.bindPopup("Your Location").openPopup();
          if (i === 1) marker.bindPopup("Customer Location").openPopup();
          return marker;
        },
        lineOptions: {
          styles: [{ color: "blue", opacity: 1, weight: 3 }],
        },
      }).addTo(map);

      // Optionally get the distance from the route
      routingControl.on("routesfound", (e) => {
        const route = e.routes[0];
        const distKm = (route.summary.totalDistance / 1000).toFixed(2);
        const midPoint =
          route.coordinates[Math.floor(route.coordinates.length / 2)];
        L.popup()
          .setLatLng(midPoint)
          .setContent(`<b>Distance:</b> ${distKm} km`)
          .openOn(map);
      });

      // Cleanup on unmount or dependencies change
      return () => {
        if (mapRef.current) {
          mapRef.current.removeControl(routingControl);
          mapRef.current.remove();
        }
      };
    }
  }, [userData, currentLocation]);

  const acceptOrder = async () => {
    try {
      setUpdate(true);
      const res = await fetch(`${backendUrl}order-accept/${orderId}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
      const data = await res.json();
      if (res.status === 200) {
        // Sending mail to User
        try {
          const payload = {
            receiver_email: userData.email,
            receiver_name: userData.user,
            subject: "🎉 Hurrah, Your Scrap Request is Accepted!",
            message: `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; padding: 16px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
    <h2 style="color: #2E86C1;">📦 Scrap Request Accepted!</h2>
    <p>
      Your request has been successfully accepted by <strong style="color: #117A65;">${localStorage
        .getItem("username")
        .toUpperCase()}</strong>.
    </p>
    <p>
      <strong>Scrap collector</strong> will come at your location on the specified date.
    </p>
    <p><strong>Your submitted details:</strong></p>
    <ul style="padding-left: 20px;">
      <li><strong>Scrap collector:</strong> ${localStorage
        .getItem("username")
        .toUpperCase()}</li>
        <li><strong>Pickup Date:</strong> ${new Date(userData.date)
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
          .replace(/ /g, "-")}</li>
      <li><strong>Contact number:</strong> ${
        userData.organisation_phone_number
      }</li>
    </ul>
    <p style="margin-top: 20px;">Thank you for using <strong>Scrapbridge</strong> 🌍</p>
  </div>`,
          };

          const emailObj = await fetch(`${backendUrl}send-mail/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          const emailData = await emailObj.json();
          if (emailObj.ok) {
            console.log(emailData.message || "Mail sent successfully!");
          } else {
            console.log(emailData.error || "Failed to send mail");
          }
        } catch (error) {
          console.log("Error sending mail: " + error.message);
        }
        // Sending mail to Scrap-collector
        try {
          const payload = {
            receiver_email: localStorage.getItem("email"),
            receiver_name: localStorage.getItem("username"),
            subject: "♻️ New Request Accepted!",
            message: `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; padding: 16px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
    <h2 style="color: #117A65;">🚛 You have accepted a scrap request!</h2>
    <p>Hello <strong>${localStorage
      .getItem("username")
      .toUpperCase()}</strong>,</p>
    <p>A new scrap request has been accepted. Here are the details:</p>
    <ul style="padding-left: 20px;">
      <li><strong>Name:</strong> ${userData.user}</li>
      <li><strong>Pickup Date:</strong> ${new Date(userData.date)
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(/ /g, "-")}</li>
      <li><strong>Phone:</strong> ${userData.phone}</li>
      <li><strong>Expected weight:</strong> ${userData.weight / 1000} Kg</li>
    </ul>
    <p>Please check your dashboard for more information and take action.</p>
    <p style="margin-top: 20px;">Thank you for being part of <strong>Scrapbridge</strong> 🌍</p>
  </div>
  `,
          };

          const emailObj = await fetch(`${backendUrl}send-mail/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          const emailData = await emailObj.json();
          if (emailObj.ok) {
            console.log(emailData.message || "Mail sent successfully!");
          } else {
            console.log(emailData.error || "Failed to send mail");
          }
        } catch (error) {
          console.log("Error sending mail: " + error.message);
        }
        setUpdate(false);
        window.location.href = "/scrap-collector";
      }
    } catch (err) {
      console.log(err);
    }
    setUpdate(false);
  };

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");

  const handleRejectOrder = async () => {
    if (!selectedReason) {
      alert("Please select a reason.");
      return;
    }

    try {
      setUpdate(true);
      const res = await fetch(`${backendUrl}order-reject/${orderId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        body: JSON.stringify({ reason: selectedReason }),
      });

      const data = await res.json();
      if (res.status === 403) {
        alert("Please login again");
        window.location.href = "/login";
      }
      if (res.status === 200) {
        setShowRejectModal(false);
        // Sending mail to User
        try {
          const payload = {
            receiver_email: userData.email,
            receiver_name: userData.user,
            subject: "❌ Sorry, Your Scrap Request Has Been Rejected",
            message: `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; padding: 16px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
    <h2 style="color: #C0392B;">❌ Scrap Request Rejected</h2>
    <p>
      We regret to inform you that your scrap request has been rejected by <strong style="color: #117A65;">${localStorage
        .getItem("username")
        .toUpperCase()}</strong>.
    </p>
    <p>
      Reason of scrap rejection <strong>${selectedReason}</strong>.
    </p>
    <p><strong>Your submitted details:</strong></p>
    <ul style="padding-left: 20px;">
      <li><strong>Scrap collector:</strong> ${localStorage
        .getItem("username")
        .toUpperCase()}</li>
      <li><strong>Pickup Date:</strong> ${new Date(userData.date)
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(/ /g, "-")}</li>
      <li><strong>Contact number:</strong> ${
        userData.organisation_phone_number
      }</li>
    </ul>
    <p style="margin-top: 20px;">You may try placing the request again later. Thank you for using <strong>Scrapbridge</strong> 🌍</p>
  </div>`,
          };

          const emailObj = await fetch(`${backendUrl}send-mail/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          const emailData = await emailObj.json();
          if (emailObj.ok) {
            console.log(emailData.message || "Mail sent successfully!");
          } else {
            console.log(emailData.error || "Failed to send mail");
          }
        } catch (error) {
          console.log("Error sending mail: " + error.message);
        }
        // Sending mail to Scrap-collector
        try {
          const payload = {
            receiver_email: localStorage.getItem("email"),
            receiver_name: localStorage.getItem("username"),
            subject: "🚫 Scrap Request Rejected",
            message: `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; padding: 16px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
    <h2 style="color: #C0392B;">❌ You have rejected a scrap request</h2>
    <p>Hello <strong>${localStorage
      .getItem("username")
      .toUpperCase()}</strong>,</p>
    <p>You have rejected a scrap pickup request. Here are the request details:</p>
    <ul style="padding-left: 20px;">
      <li><strong>Name:</strong> ${userData.user}</li>
      <li><strong>Pickup Date:</strong> ${new Date(userData.date)
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(/ /g, "-")}</li>
      <li><strong>Phone:</strong> ${userData.phone}</li>
      <li><strong>Expected Weight:</strong> ${userData.weight / 1000} Kg</li>
      <li><strong>Rejection reason:</strong> ${selectedReason}</li>
    </ul>
    <p>The user has been notified. You can check your dashboard for further actions if needed.</p>
    <p style="margin-top: 20px;">Thank you for being part of <strong>Scrapbridge</strong> 🌍</p>
  </div>
  `,
          };

          const emailObj = await fetch(`${backendUrl}send-mail/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          const emailData = await emailObj.json();
          if (emailObj.ok) {
            console.log(emailData.message || "Mail sent successfully!");
          } else {
            console.log(emailData.error || "Failed to send mail");
          }
        } catch (error) {
          console.log("Error sending mail: " + error.message);
        }
        setUpdate(false);
        window.location.href = "/scrap-collector";
      } else {
        alert("Failed to reject order. Please try again.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred. Please check your connection and try again.");
    }
    setUpdate(false);
  };

  if (loader) return <center><img src={LoaderGIF}></img></center>;

  return (
    <div className="scrap-details-container">
      <div className="scrap-details-left-section">
        <div className="scrap-details-user">
          <h2>SCRAP REQUEST DETAILS</h2>
          <img
            src={
              "https://res.cloudinary.com/dqeftodl5/" + userData.image ||
              "https://res.cloudinary.com/dqeftodl5/image/upload/v1748065619/users/shoes.png"
            }
            alt="User"
          />
        </div>

        <table className="scrap-details-table">
          <tbody>
            <tr>
              <th>Content</th>
              <th>Details</th>
            </tr>
            <tr>
              <td>Customer name:</td>
              <td>{userData.user.toUpperCase()}</td>
            </tr>
            <tr>
              <td>Date to reach:</td>
              <td>{new Date(userData.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
</td>
            </tr>
            <tr>
              <td>Scrap quantity:</td>
              <td>{userData.weight} Kg</td>
            </tr>
            <tr>
              <td>Address:</td>
              <td class="address-cell">{userData.street}, {userData.city}, {userData.state}, {userData.zipcode} </td>
            </tr>
          </tbody>
        </table>
        <h2>Scrap Image (Click to enlarge)</h2>
        <img
          className="scrap-img"
          src={
            "https://res.cloudinary.com/dqeftodl5/" + userData.image ||
            "../assets/default.jpg"
          }
          alt="Scrap"
          onClick={() =>
            (document.getElementById("myModal").style.display = "flex")
          }
        />
        <div id="myModal" className="modal">
          <span
            className="close"
            onClick={() =>
              (document.getElementById("myModal").style.display = "none")
            }
          >
            ×
          </span>
          <img
            className="modal-content"
            src={
              "https://res.cloudinary.com/dqeftodl5/" + userData.image ||
              "../assets/default.jpg"
            }
            alt="Scrap Zoomed"
          />
        </div>
        {update ? (
          <div className="submit-btns">
            <button
              className="order-accepted"
              disabled
              style={{ backgroundColor: "blue" }}
            >
              Updating Order...
            </button>
          </div>
        ) : (
          <div className="submit-btns">
            <button className="order-accepted" onClick={acceptOrder}>
              Accept Order
            </button>
            <button
              className="order-rejected"
              onClick={() => setShowRejectModal(true)}
            >
              Reject Order
            </button>
          </div>
        )}

        {showRejectModal && (
          <div className="modal" id="rejectModal">
            <div className="reject-popup">
              <button
                className="close-btn"
                onClick={() => setShowRejectModal(false)}
              >
                ×
              </button>
              <h2>Reject Scrap Request</h2>
              <p>Please select a reason for rejection:</p>

              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    value="Not in service area"
                    checked={selectedReason === "Not in service area"}
                    onChange={(e) => setSelectedReason(e.target.value)}
                  />{" "}
                  Not in service area
                </label>
                <label>
                  <input
                    type="radio"
                    value="Schedule conflict"
                    checked={selectedReason === "Schedule conflict"}
                    onChange={(e) => setSelectedReason(e.target.value)}
                  />{" "}
                  Schedule conflict
                </label>
                <label>
                  <input
                    type="radio"
                    value="Invalid request"
                    checked={selectedReason === "Invalid request"}
                    onChange={(e) => setSelectedReason(e.target.value)}
                  />{" "}
                  Invalid request
                </label>
                <label>
                  <input
                    type="radio"
                    value="Other"
                    checked={selectedReason === "Other"}
                    onChange={(e) => setSelectedReason(e.target.value)}
                  />{" "}
                  Other
                </label>
              </div>

              <button className="submit-reject-btn" onClick={handleRejectOrder}>
                Submit
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="scrap-details-right-section">
        <div id="mapid"></div>
      </div>
    </div>
  );
};

export default ScrapRequestDetails;
