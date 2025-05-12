import React, { useState, useEffect } from "react";
import "../style/profile.css";
import loader from "../assets/loader.gif";

const Profile = () => {
  const backendUrl = "https://scrapbridge-api.onrender.com/api/";
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(false); // ADD THIS

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${backendUrl}get-enduser/${localStorage.getItem("user_id")}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        });
        if (!res.ok) {
          window.location.href = "/login";
        }
        const data = await res.json();
        if (data.image) {
          localStorage.setItem("user_profile", data.image);
        }
        setUser(data);
        setEmail(data?.user?.email || "");
      } catch (err) {
        window.location.href = "/login";
        console.error("User detail fetching error", err);
      }
    };

    fetchData();
  }, []);

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    if (imageFile) {
      formData.append("image", imageFile);
    }
    const profileBtn = document.getElementById("profile-update-btn");
    profileBtn.innerText = "Updating";
    try {
      const res = await fetch(`${backendUrl}update-user/${localStorage.getItem("user_id")}/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
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

  const profileImg = user?.image ? "https://scrapbridge-api.onrender.com" + user.image : "";

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
                onClick={() => setPreviewImage(true)} // ADD CLICK HANDLER
                style={{ cursor: "pointer" }}
              />
              <h2 className="username">{localStorage.getItem("username").toUpperCase()}</h2>
              <div className="created-at">
                Created On: {user.created_at && new Date(user.created_at).toISOString().split("T")[0]}
              </div>
            </div>

            <div className="info-grid">
              <div className="form-group">
                <label>Username</label>
                <input type="text" value={localStorage.getItem("username")} disabled />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div className="form-group">
                <label>Upload Profile Image</label>
                <input type="file" name="image" onChange={(e) => setImageFile(e.target.files[0])} />
              </div>

              <div className="btn-center">
                <button className="submit-btn" onClick={handleUpdateUser} id="profile-update-btn">
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
        <div className="image-preview-overlay" onClick={() => setPreviewImage(false)}>
          <span className="close-button" onClick={() => setPreviewImage(false)}>&times;</span>
          <div className="image-preview-container" onClick={(e) => e.stopPropagation()}>
              
            <img src={profileImg} alt="Zoomed" className="preview-img" />
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
