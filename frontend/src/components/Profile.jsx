import React, { useState, useEffect } from "react";
import "../style/profile.css";
import loader from "../assets/loader.gif";
import defaultProfile from "../assets/default.jpg";

const Profile = () => {
  const backendUrl = "https://scrapbridge-api-r54n.onrender.com/api/";
    // const backendUrl = 'http://127.0.0.1:8000/api/';
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${backendUrl}get-enduser/${localStorage.getItem("user_id")}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
          }
        );
        if (!res.ok) {
          window.location.href = "/login";
          return;
        }
        const data = await res.json();
        setUser(data);
        setEmail(data?.user?.email || "");
        setPhone(data?.phone || "");
        setStreet(data?.street || "");
        setCity(data?.city || "");
        setState(data?.state || "");
        setZipcode(data?.zipcode || "");

        if (
          !data?.user?.email ||
          !data?.phone ||
          !data?.street ||
          !data?.city ||
          !data?.state ||
          !data?.zipcode
        ) {
          setError("Please complete your profile.");
        } else {
          setError("");
        }
      } catch (err) {
        console.error("User detail fetching error", err);
      }
    };

    fetchData();
  }, []);

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!email || !phone || !street || !city || !state || !zipcode) {
      alert("Enter all the fields");
      return;
    }
    const formData = new FormData();
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("street", street);
    formData.append("city", city);
    formData.append("state", state);
    formData.append("zipcode", zipcode);
    if (imageFile) {
      formData.append("image", imageFile);
    }
    const profileBtn = document.getElementById("profile-update-btn");
    profileBtn.innerText = "Updating...";
    profileBtn.disabled;
    try {
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
        if(imageFile) {
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
        window.location.reload();
      } else {
        console.error("Update failed:", data);
        alert("Something went wrong");
        window.location.href = "/login";
      }
    } catch (err) {
      console.error("Error:", err);
      window.location.href = "/login";
    }
    profileBtn.innerText = "Update";
  };

  const profileImg = user?.image
    ?
      localStorage.getItem("user_profile")
    : "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg";

  return (
    <>
      {user ? (
        <div className="profile-container">
          <div className="profile-card">
            <div className="img">
              <img
                src={profileImg}
                alt="Profile"
                className="profile-img"
                onClick={() => setPreviewImage(true)}
                style={{ cursor: "pointer" }}
                onError={(e) => {
                  e.target.onerror = null; // prevent infinite loop
                  e.target.src = defaultProfile; // fallback image path
                }}
              />
              <h2 className="username">
                {localStorage.getItem("username")?.toUpperCase()}
              </h2>
              <div className="created-at">
                Created On:{" "}
                {user.created_at &&
                  new Date(user.created_at).toISOString().split("T")[0]}
              </div>
              <div id="profile-error" style={{ color: "red" }}>
                {error}
              </div>
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
                  name="email"
                  placeholder="Enter email*"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone number</label>
                <input
                  type="phone"
                  name="phone"
                  value={phone}
                  placeholder="Enter Phone number*"
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Street</label>
                <input
                  type="text"
                  name="street"
                  value={street}
                  placeholder="Enter street*"
                  onChange={(e) => setStreet(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={city}
                  placeholder="Enter city*"
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  value={state}
                  name="state"
                  placeholder="Enter state*"
                  onChange={(e) => setState(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Zipcode</label>
                <input
                  type="text"
                  value={zipcode}
                  name="zipcode"
                  placeholder="Enter zipcode*"
                  onChange={(e) => setZipcode(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Upload Profile Image</label>
                <input
                  type="file"
                  name="image"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
              </div>

              <div className="btn-center">
                <button
                  className="submit-btn"
                  onClick={handleUpdateUser}
                  id="profile-update-btn"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="loader">
          <img src={loader} alt="Loader" />
          <p>Check if you are logged-In or wait for a few seconds</p>
        </div>
      )}

      {/* Full Screen Image Preview */}
      {previewImage && (
        <div
          className="image-preview-overlay"
          onClick={() => setPreviewImage(false)}
        >
          <span className="close-button" onClick={() => setPreviewImage(false)}>
            &times;
          </span>
          <div
            className="image-preview-container"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={profileImg} alt="Zoomed" className="preview-img" onError={(e) => {
                  e.target.onerror = null; // prevent infinite loop
                  e.target.src = defaultProfile; // fallback image path
                }}  />
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
