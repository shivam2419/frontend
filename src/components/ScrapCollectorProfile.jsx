import React, { useState, useEffect } from "react";
import "../style/profile.css";
import loader from "../assets/loader.gif";

const ScrapCollectorProfile = () => {
  const backendUrl = "https://scrapbridge-api-r54n.onrender.com/api/";
    // const backendUrl = 'http://127.0.0.1:8000/api/';
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [previewImage, setPreviewImage] = useState(false);
  const [update, setUpdate] = useState(false);

  let latitude = "",
    longitude = "";
  navigator.geolocation.getCurrentPosition(function (position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        setUpdate(true);
        const res = await fetch(
          `${backendUrl}owner/${localStorage.getItem("user_id")}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
          }
        );
        const data = await res.json();
        if (res.status == 403 || res.status == 401) {
          setUpdate(false);
          window.location.href = "/login";
        }
        if (data) {
          setUser(data);
          setEmail(data?.user?.email || "");
          setPhone(data?.phone || "");
          setStreet(data?.street || "");
          setCity(data?.city || "");
          setState(data?.state || "");
          setZipcode(data?.zipcode || "");
        }
      } catch (err) {
        console.error("User detail fetching error", err);
      }
      setUpdate(false);
    };

    fetchData();
  }, []);

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!latitude || !longitude) {
      alert("Please provide location and refresh the page");
      return;
    }
    // Phone number validation
    if (!/^\d{10}$/.test(phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("street", street);
    formData.append("city", city);
    formData.append("state", state);
    formData.append("zipcode", zipcode);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      setUpdate(true);
      const res = await fetch(
        `${backendUrl}update-user/${localStorage.getItem("user_id")}/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok) {
        if (imageFile) {
          const user_info = await fetch(backendUrl + "auth/user/", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
          });
          const result = await user_info.json();
          localStorage.removeItem("user_profile");
          localStorage.setItem("user_profile", result.user_profile);
        }
        alert("User info updated successfully!");
        setUpdate(false);
        window.location.href = "/scrap-collector";
      } else {
        console.error("Update failed:", data);
        setUpdate(false);
        alert("Something went wrong");
        // window.location.href = "/login";
      }
    } catch (err) {
      console.error("Error:", err);
    }
    setUpdate(false);
  };

  const profileImg = localStorage.getItem("user_profile")
    ? localStorage.getItem("user_profile")
    : "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg";

  return (
    <>
      {user ? (
        <div className="profile-container">
          <div className="profile-card">
            <div className="created-at">
              Created On:{" "}
              {new Date(user.created_at).toISOString().split("T")[0]}
            </div>

            <div className="img">
              <img
                src={profileImg}
                alt="Profile"
                className="profile-img"
                onClick={() => setPreviewImage(true)}
                style={{ cursor: "pointer" }}
              />
              <h2 className="username">
                {localStorage.getItem("username").toUpperCase()}
              </h2>
            </div>

            <div className="info-grid">
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={localStorage.getItem("username")}
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      setPhone(value);
                    }
                  }}
                  maxLength="10"
                />
              </div>

              <div className="form-group">
                <label>Street</label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>ZIP Code</label>
                <input
                  type="text"
                  value={zipcode}
                  onChange={(e) => setZipcode(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Organisation</label>
                <input type="text" value={user.organisation_name} disabled />
              </div>

              <div className="form-group">
                <label>Upload Image</label>
                <input
                  type="file"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
              </div>
            </div>

            <div className="btn-center">
              {update ? (
                <button className="submit-btn" disabled>
                  Updating...
                </button>
              ) : (
                <button className="submit-btn" onClick={handleUpdateUser}>
                  Update
                </button>
              )}
            </div>
          </div>

          {previewImage && (
            <div
              className="image-preview-overlay"
              onClick={() => setPreviewImage(false)}
            >
              <span
                className="close-button"
                onClick={() => setPreviewImage(false)}
              >
                &times;
              </span>
              <div
                className="image-preview-container"
                onClick={(e) => e.stopPropagation()}
              >
                <img src={profileImg} alt="Zoom" className="preview-img" />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="loader">
          <img src={loader} alt="Loader" />
          <p>Check if you are logged-In or wait for a few seconds</p>
        </div>
      )}
    </>
  );
};

export default ScrapCollectorProfile;
