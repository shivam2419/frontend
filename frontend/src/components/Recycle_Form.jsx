import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../style/recycle_form.css";
import loaderGIF from "../assets/loader.gif";

const Recycle_Form = () => {
  const backendUrl = "https://scrapbridge-api-r54n.onrender.com/api/";
    // const backendUrl = 'http://127.0.0.1:8000/api/';
  const { user_id } = useParams();
  const [item, setItem] = useState([]);
  const [loading, setLoading] = useState(true);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    phone: "",
    weight: "",
    image: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${backendUrl}owner/${user_id}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        });

        if (res.status === 401 || res.status === 403) {
          alert("Authentication error. Please login again.");
          window.location.href = "/login";
          return;
        }

        const data = await res.json();
        setItem(data);
      } catch (err) {
        console.error("Error fetching owner details", err);
        alert("Something went wrong while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user_id]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          let message = "Geolocation error.";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = "Please enable location to continue.";
              break;
            case error.POSITION_UNAVAILABLE:
              message = "Location info unavailable.";
              break;
            case error.TIMEOUT:
              message = "Location request timed out.";
              break;
          }
          alert(message);
        }
      );
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const now = new Date();
    const order_id = `scrapbridge-${now.getFullYear()}${String(
      now.getMonth() + 1
    ).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}${String(
      now.getHours()
    ).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(
      now.getSeconds()
    ).padStart(2, "0")}`;

    const form = new FormData();
    form.append("item_type", "Scrap Item");
    form.append("date", formData.date);
    form.append("phone", formData.phone);
    form.append("weight", formData.weight);
    form.append("image", formData.image);
    form.append("location", `${latitude} ${longitude}`);
    form.append("user", localStorage.getItem("user_id"));
    form.append("organisation", item.organisation_id);
    form.append("order_id", order_id);

    try {
      const res = await fetch(backendUrl + "scrap-request/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        body: form,
      });

      if (res.status === 201) {
        alert("Request submitted successfully!");
        setFormData({
          date: "",
          phone: "",
          weight: "",
          image: "",
        });
        // Sending mail to User
        try {
          const payload = {
            receiver_email: localStorage.getItem("email"),
            receiver_name: localStorage.getItem("username"),
            subject: "🎉 Hurrah, Your Scrap Request is Submitted!",
            message: `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; padding: 16px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
    <h2 style="color: #2E86C1;">📦 Scrap Request Sent Successfully!</h2>
    <p>
      Your request has been successfully sent to <strong style="color: #117A65;">${item?.organisation_name}</strong>.
    </p>
    <p>
      <strong>Scrap collector</strong> will notify you about the next steps shortly.
    </p>
    <p><strong>Your submitted details:</strong></p>
    <ul style="padding-left: 20px;">
      <li><strong>Pickup Date:</strong> ${formData.date}</li>
      <li><strong>Phone:</strong> ${formData.phone}</li>
      <li><strong>Weight:</strong> ${formData.weight} kg</li>
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
            receiver_email: item?.user?.email,
            receiver_name: item?.organisation_name,
            subject: "♻️ New Scrap Request Received!",
            message: `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; padding: 16px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
    <h2 style="color: #117A65;">🚛 New Scrap Pickup Request!</h2>
    <p>Hello <strong>${item?.organisation_name.toUpperCase()}</strong>,</p>
    <p>A new scrap request has been submitted. Here are the details:</p>
    <ul style="padding-left: 20px;">
      <li><strong>Pickup Date:</strong> ${formData.date}</li>
      <li><strong>Phone:</strong> ${formData.phone}</li>
      <li><strong>Weight:</strong> ${formData.weight} kg</li>
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
        window.location.href = "/e-facility";
      } else if (res.status === 403) {
        alert("You are not authorized");
        window.location.reload();
      } else {
        const result = await res.json();
        alert("Error: " + JSON.stringify(result));
      }
    } catch (err) {
      console.error("Error submitting request:", err);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", margin: "20%" }}>
        <img src={loaderGIF} alt="Loading..." style={{ width: "70px" }} />
        <p>Loading...</p>
      </div>
    );
  }

  return item?.organisation_name ? (
    <div className="recycleform">
      <h1>{item.organisation_name.replace(/_/g, " ").toUpperCase()}</h1>
      <form onSubmit={handleSubmit}>
        <div className="row-1">
          <div className="recycle-form-col-1">
            <label>Select Date of pickup*</label>
            <input
              type="date"
              name="date"
              required
              value={formData.date}
              onChange={handleChange}
              min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
            />
          </div>
        </div>

        <div className="row-2">
          <div className="recycle-form-col-1">
            <label>Phone number*</label>
            <input
              type="tel"
              name="phone"
              pattern="[0-9]{10}"
              required
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="recycle-form-col-1">
            <label>Expected scrap weight*</label>
            <input
              type="number"
              name="weight"
              required
              value={formData.weight}
              onChange={handleChange}
              placeholder="In Kg*"
            />
          </div>
        </div>

        <div className="row-3" id="recycle-form-scrap-image-div-parent">
          <div className="recycle-form-col-1" id="recycle-form-scrap-image-div">
            <label htmlFor="image-upload">Upload item image</label>
            <input
              type="file"
              id="image-upload"
              name="image"
              required
              onChange={handleChange}
              accept="image/*"
            />
          </div>
        </div>

        <input type="submit" value="SUBMIT" id="recycle-btn" />
      </form>
    </div>
  ) : (
    <div className="loader">
      <img src={loaderGIF} alt="Loading..." />
      <br />
      Please log in or wait a few seconds...
    </div>
  );
};

export default Recycle_Form;
