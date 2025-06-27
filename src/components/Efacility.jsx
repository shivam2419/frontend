import React, { useEffect, useState } from "react";
import "../style/facility.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import axios from "axios";
import userMapIcon from "../assets/icon.png";
import loaderGIF from "../assets/loader.gif";
import { Link } from "react-router-dom";

const Efacility = () => {
  const backendUrl = "https://scrapbridge-api-r54n.onrender.com/api/";
    // const backendUrl = 'http://127.0.0.1:8000/api/';
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(false);

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError(true);
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setLocationError(false);
        const userLat = position.coords.latitude;
        const userLong = position.coords.longitude;

        try {
          const res = await axios.get(backendUrl + "owners/");
          const roomsWithDistance = res.data.map((room) => {
            const distance = getDistance(
              userLat,
              userLong,
              parseFloat(room.latitude),
              parseFloat(room.longitude)
            );
            return { ...room, distance };
          });
          const sortedRooms = roomsWithDistance.sort(
            (a, b) => a.distance - b.distance
          );

          setRooms(sortedRooms);
          setFilteredRooms(sortedRooms);
        } catch (err) {
          console.error("Failed to fetch data:", err);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setLocationError(true);
        setLoading(false);
        console.error("Location access denied:", error);
      }
    );
  }, []);

  useEffect(() => {
    if (!filteredRooms.length) return;

    if (L.DomUtil.get("mapid") !== null) {
      L.DomUtil.get("mapid")._leaflet_id = null;
    }

    const mymap = L.map("mapid", {
      center: [20, 80],
      zoom: 5,
      layers: [
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }),
      ],
    });

    const userIcon = L.icon({
      iconUrl: userMapIcon,
      iconSize: [80, 80],
      iconAnchor: [30, 80],
      popupAnchor: [0, -30],
    });

    navigator.geolocation.getCurrentPosition((position) => {
      const userLat = position.coords.latitude;
      const userLong = position.coords.longitude;

      L.marker([userLat, userLong], { icon: userIcon })
        .addTo(mymap)
        .bindPopup("<b>Your Location</b>")
        .openPopup();

      mymap.setView([userLat, userLong], 12);
    });

    filteredRooms.forEach((room) => {
      if (!room.latitude || !room.longitude) return;

      const icon = L.icon({
        iconUrl:
          "https://chiropracticgilbert.com/wp-content/uploads/2017/12/locatio.png",
        iconSize: [45, 60],
        iconAnchor: [30, 80],
        popupAnchor: [0, -30],
      });

      L.marker([parseFloat(room.latitude), parseFloat(room.longitude)], {
        icon,
      })
        .addTo(mymap)
        .bindPopup(
          `<b>${
            room.organisation_name
          }</b><br>Distance: ${room.distance?.toFixed(2)} KM`
        );
    });
  }, [filteredRooms]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (query) {
      const filtered = rooms
        .filter(
          (room) =>
            room.organisation_name.toLowerCase().includes(query) ||
            room.city.toLowerCase().includes(query) ||
            room.state.toLowerCase().includes(query) ||
            room.phone.includes(query)
        )
        .sort((a, b) => a.distance - b.distance);
      setFilteredRooms(filtered);
    } else {
      setFilteredRooms([...rooms]);
    }
  };

  return (
    <>
      {loading ? (
        <div className="loader-container">
          <center>
            <img src={loaderGIF} alt="Loading..." />
          </center>
        </div>
      ) : (
        <div className="row">
          <div className="col-1">
            {searchQuery ? (
              <h2>Search Results for "{searchQuery}"</h2>
            ) : (
              <h1>Available Scrap Collectors</h1>
            )}
            <input
              type="text"
              placeholder="Search your Scrap Collector"
              id="q"
              name="q"
              value={searchQuery}
              style={{ marginBottom: "10px" }}
              onChange={handleSearch} // Add onChange handler to search input
            />
            <i style={{ color: "gray" }}>
              *Choose the nearest possible collector for high and fast
              availability*
            </i>

            {locationError ? (
              <div
                style={{
                  backgroundColor: "#ffcccc",
                  color: "#990000",
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "5px",
                  textAlign: "center",
                }}
              >
                ⚠️ Location access is required to show nearest facilities.
                Please allow it in your browser settings.
                <br />
                <br />
                <button
                  onClick={() => window.location.reload()}
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    cursor: "pointer",
                    padding: "10px",
                    marginBottom: "10px",
                    borderRadius: "5px",
                  }}
                >
                  Try Again
                </button>
              </div>
            ) : (
              filteredRooms.map((item) => (
                <div className="facility-card" key={item.organisation_id}>
                  <div className="facility-header">
                    <Link
                      to={`/recycler-profile/${item.user.id}`}
                      style={{
                        backgroundColor: "white",
                        color: "black",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <img
                        // Did changes here
                        src={
                          item.image
                            ? `https://res.cloudinary.com/dqeftodl5/${item.image}`
                            : "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
                        }
                        alt="Facility"
                        className="facility-image"
                      />
                      <h3 className="org-name">
                        {item.organisation_name
                          .replace(/_/g, " ")
                          .toUpperCase()}
                      </h3>
                    </Link>
                  </div>
                  <p className="address">
                    {item.street ? (
                      <div>
                        <b>Address - </b>
                        {`${item.street}, ${item.city}, ${item.state} ${item.zipcode}`}
                      </div>
                    ) : (<div><b>Address - </b> Address not given</div>)}
                  </p>
                  <p className="distance">
                    {item.distance ? (
                      <div>
                        <b>Distance : </b>
                        {`${item.distance?.toFixed(2)} KM`}
                      </div>
                    ) : (<div><b>Distance : </b> ♾️ KM</div>)}
                  </p>
                  <p className="contact">
                    {item.phone ? (
                      <div>
                        <b>Contact - </b>
                        {`${item.phone}`}
                      </div>
                    ) : (<div><b>Contact - </b> +91-XXXXXXXXX</div>)}
                  </p>
                  <a href={`recycle_main/${item.user.id}`}>Book Recycling</a>
                </div>
              ))
            )}
          </div>
          <div className="col-2">
            <div id="mapid"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default Efacility;
