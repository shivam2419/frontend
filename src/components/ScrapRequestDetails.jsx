import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet-routing-machine';
import '../style/Scrap_Collector/ScrapRequestDetails.css';

const ScrapRequestDetails = () => {
    const backendUrl = "https://scrapbridge-api.onrender.com/api/";
    const { orderId } = useParams();
    const [userData, setUserData] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
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
                const locationArray = data.data.location.split(' ').map(coord => coord.trim());

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
            const map = L.map('mapid').setView(startLatLng, 13);
            mapRef.current = map;

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors',
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
                    styles: [{ color: 'blue', opacity: 1, weight: 3 }]
                }
            }).addTo(map);

            // Optionally get the distance from the route
            routingControl.on('routesfound', e => {
                const route = e.routes[0];
                const distKm = (route.summary.totalDistance / 1000).toFixed(2);
                const midPoint = route.coordinates[Math.floor(route.coordinates.length / 2)];
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
            const res = await fetch(`${backendUrl}order-accept/${orderId}/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access")}`,
                },
            });
            const data = await res.json();
            if (res.status === 200) {
                window.location.href = "/scrap-collector";
            }
        } catch (err) {
            console.log(err);
        }
    }

    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedReason, setSelectedReason] = useState("");

    const handleRejectOrder = async () => {
        if (!selectedReason) {
            alert("Please select a reason.");
            return;
        }

        try {
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
                alert("Order rejected successfully.");
                setShowRejectModal(false);
                window.location.href = "/scrap-collector";
            } else {
                alert("Failed to reject order. Please try again.");
            }
        } catch (err) {
            console.error("Error:", err);
            alert("An error occurred. Please check your connection and try again.");
        }
    };

    if (!userData) return <p>Loading...</p>;

    return (
        <div className="container">
            <div className="left-section">
                <div className="user">
                    <h2>SCRAP REQUEST DETAILS</h2>
                    <img src={"https://scrapbridge-api.onrender.com" + userData.image || '../assets/default.jpg'} alt="User" />
                </div>

                <table>
                    <tbody>
                        <tr><th>Content</th><th>Details</th></tr>
                        <tr><td>Customer name:</td><td>{userData.user.toUpperCase()}</td></tr>
                        <tr><td>Scrap Type:</td><td>{userData.item_type}</td></tr>
                        <tr><td>Date to reach:</td><td>{userData.date}</td></tr>
                        <tr><td>Scrap quantity:</td><td>{userData.weight / 1000} Kg</td></tr>
                        <tr><td>Address:</td><td>{userData.location}</td></tr>
                    </tbody>
                </table>

                <h2>Scrap Image (Click to enlarge)</h2>
                <img
                    className="scrap-img"
                    src={"https://scrapbridge-api.onrender.com" + userData.image || '../assets/default.jpg'}
                    alt="Scrap"
                    onClick={() => document.getElementById('myModal').style.display = 'flex'}
                />

                <div id="myModal" className="modal">
                    <span className="close" onClick={() => document.getElementById('myModal').style.display = 'none'}>×</span>
                    <img className="modal-content" src={"https://scrapbridge-api.onrender.com"+ userData.image || '../assets/default.jpg'} alt="Scrap Zoomed" />
                </div>

                <div className="submit-btns">
                    <button className='order-accepted' onClick={acceptOrder}><Link>Accept Order</Link></button>
                    <button className='order-rejected' onClick={() => setShowRejectModal(true)}>Reject Order</button>
                </div>

                {showRejectModal && (
                    <div className="modal" id="rejectModal">
                        <div className="reject-popup">
                            <button className="close-btn" onClick={() => setShowRejectModal(false)}>×</button>
                            <h2>Reject Scrap Request</h2>
                            <p>Please select a reason for rejection:</p>

                            <div className="radio-group">
                                <label><input type="radio" value="Not in service area" checked={selectedReason === "Not in service area"} onChange={(e) => setSelectedReason(e.target.value)} /> Not in service area</label>
                                <label><input type="radio" value="Schedule conflict" checked={selectedReason === "Schedule conflict"} onChange={(e) => setSelectedReason(e.target.value)} /> Schedule conflict</label>
                                <label><input type="radio" value="Invalid request" checked={selectedReason === "Invalid request"} onChange={(e) => setSelectedReason(e.target.value)} /> Invalid request</label>
                                <label><input type="radio" value="Other" checked={selectedReason === "Other"} onChange={(e) => setSelectedReason(e.target.value)} /> Other</label>
                            </div>

                            <button className="submit-reject-btn" onClick={handleRejectOrder}>Submit</button>
                        </div>
                    </div>
                )}
            </div>

            <div className="right-section">
                <div id="mapid"></div>
            </div>
        </div>
    );
};

export default ScrapRequestDetails;
