import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../style/RecyclerProfile.css";

const RecyclerProfile = () => {
  const { userId } = useParams();
  const backendUrl = "http://127.0.0.1:8000/api/";
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchOwnerProfile = async () => {
      try {
        const res = await fetch(`${backendUrl}owner/${userId}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        } else {
          console.error("Failed to fetch recycler profile");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (userId) {
      fetchOwnerProfile();
    }
  }, [userId]);

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="recycler-wrapper">
      <div className="recycler-card">
        <div className="recycler-left">
          <img
            src={`http://localhost:8000/${profile.image}`}
            alt="Recycler"
            className="recycler-avatar"
          />
          <h2 className="recycler-name">{profile.organisation_name.replace(/_/g, ' ').toUpperCase()}</h2>
          <p className="recycler-date">
            Joined: {new Date(profile.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="recycler-right">
          <h3 className="recycler-section-title">Contact Info</h3>
          <p><strong>Phone:</strong> {profile.phone}</p>

          <h3 className="recycler-section-title">Address</h3>
          <p><strong>Street:</strong> {profile.street}</p>
          <p><strong>City:</strong> {profile.city}</p>
          <p><strong>State:</strong> {profile.state}</p>
          <p><strong>Zipcode:</strong> {profile.zipcode}</p>

          <Link to={`/recycle_main/${userId}`} className="recycler-button">
            Book Recycling
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecyclerProfile;
