import React, { useEffect, useState } from "react";
import "../style/facility.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import axios from "axios";
import userMapIcon from "../assets/icon.png";
import loaderGIF from "../assets/loader.gif"; // Optional loader icon, or use a CSS spinner

const Efacility = () => {
    const backendUrl = "https://scrapbridge-api.onrender.com/api/";
    const [rooms, setRooms] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); // Add state for search query
    const [filteredRooms, setFilteredRooms] = useState([]); // State for filtered rooms
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // Fetch data from API
        const fetchRooms = async () => {
            try {
                setLoading(true);
                const res = await axios.get(backendUrl+"owners/"); // Use your actual API endpoint
                setRooms(res.data);
                setFilteredRooms(res.data); // Initially set filteredRooms to all rooms
            } catch (error) {
                console.error("Failed to fetch rooms:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    // Handle search query change and filter rooms
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        // Filter rooms based on the search query
        if (query) {
            const filtered = rooms.filter((room) =>
                room.organisation_name.toLowerCase().includes(query) ||
                room.city.toLowerCase().includes(query) || // You can add more fields to filter by
                room.state.toLowerCase().includes(query)
            );
            setFilteredRooms(filtered);
        } else {
            setFilteredRooms(rooms); // Show all rooms if the search query is empty
        }
    };

    useEffect(() => {
        if (!filteredRooms || filteredRooms.length === 0) return;

        if (L.DomUtil.get("mapid") !== null) {
            L.DomUtil.get("mapid")._leaflet_id = null;
        }

        const myLat = filteredRooms.map((r) => parseFloat(r.latitude));
        const myLong = filteredRooms.map((r) => parseFloat(r.longitude));
        const orgNameList = filteredRooms.map((r) => r.organisation_name);
        const orgIDs = filteredRooms.map((r) => r.organisation_id);

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

        let recyclerMarkers = [];
        for (let i = 0; i < myLat.length; i++) {
            if (!isNaN(myLat[i]) && !isNaN(myLong[i])) {
                let marker = L.marker([myLat[i], myLong[i]], {
                    title: orgNameList[i],
                }).addTo(mymap);
                marker.bindPopup(orgNameList[i]);
                recyclerMarkers.push({
                    id: orgIDs[i],
                    lat: myLat[i],
                    lng: myLong[i],
                    name: orgNameList[i],
                    marker,
                });
            }
        }

        function getUserLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    showUserPosition,
                    showError,
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0,
                    }
                );
            } else {
                alert("Geolocation is not supported by this browser.");
            }
        }

        function showUserPosition(position) {
            const userLat = position.coords.latitude;
            const userLong = position.coords.longitude;

            const yourIcon = L.icon({
                iconUrl: userMapIcon,
                iconSize: [80, 80],
                iconAnchor: [30, 80],
                popupAnchor: [0, -30],
            });

            const userMarker = L.marker([userLat, userLong], { icon: yourIcon })
                .addTo(mymap)
                .bindPopup("<b>Your Location</b>")
                .openPopup();

            mymap.setView([userLat, userLong], 12);

            recyclerMarkers.forEach((recycler, index) => {
                const distance = getDistance(userLat, userLong, recycler.lat, recycler.lng);

                recycler.marker
                    .bindPopup(
                        `<b>${recycler.name}</b><br>Distance: ${distance.toFixed(2)} KM`
                    )
                    .openPopup();

                const facilityCards = document.querySelectorAll(".facility-card");
                if (facilityCards[index]) {
                    let distanceElement = facilityCards[index].querySelector(".distance");
                    if (!distanceElement) {
                        const newDistanceElement = document.createElement("p");
                        newDistanceElement.classList.add("distance");
                        newDistanceElement.innerHTML = `<b>Distance:</b> ${distance.toFixed(2)} KM`;
                        facilityCards[index].appendChild(newDistanceElement);
                    } else {
                        distanceElement.innerHTML = `<b>Distance:</b> ${distance.toFixed(2)} KM`;
                    }
                }
            });
        }

        function showError(error) {
            alert("Error fetching location: " + error.message);
        }

        function getDistance(lat1, lon1, lat2, lon2) {
            function toRad(value) {
                return (value * Math.PI) / 180;
            }
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
        }

        getUserLocation();
    }, [filteredRooms]);

    return (
        <>
            {loading ? (
                <div className="loader-container">
                    <center><img src={loaderGIF} alt="" /></center>
                </div>
            ) : (
                <div className="row">

                    <div className="col-1">
                        {searchQuery ? (
                            <h2>Search Results for "{searchQuery}"</h2>
                        ) : (
                            <h1>All Available Scrap Collectors</h1>
                        )}
                        <form action="" method="GET">
                            <input
                                type="text"
                                placeholder="Search your Shopper"
                                id="q"
                                name="q"
                                value={searchQuery}
                                onChange={handleSearch} // Add onChange handler to search input
                            />
                            <input type="submit" value="Search" id="search-btn" />
                        </form>
                        <i style={{ color: "gray" }}>
                            *Choose the nearest possible collector for high and fast availability*
                        </i>
                        {filteredRooms?.map((items) => (

                            <div className="facility-card" key={items.organisation_id}>
                                <div className="facility-header">
                                    <img
                                        src={items.image ? `https://scrapbridge-api.onrender.com${items.image}` : "../assets/default.jpg"}
                                        alt="Facility"
                                        className="facility-image"
                                    />
                                    <h3 className="org-name">
                                        {items.organisation_name.toUpperCase()} (Id: {items.organisation_id})
                                    </h3>
                                </div>
                                <p className="address">
                                    <b>ADDRESS - </b> {items.street}, {items.city}, {items.state}, {items.zipcode}
                                </p>
                                <p className="distance"></p>
                                <p className="contact">
                                    <b>Contact - </b> {items.phone}
                                </p>
                                <a href={`recycle_main/${items.user.id}`}>Book Recycling</a>
                            </div>
                        ))}
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
